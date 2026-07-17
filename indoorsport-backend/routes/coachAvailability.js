const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const auth = require("../middleware/auth");

const timeToMinutes = (t) => {
  if (!t) return 0;
  const parts = t.replace(/AM|PM/i, '').split(":");
  let h = parseInt(parts[0] || 0, 10);
  const m = parseInt(parts[1] || 0, 10);
  if (t.toLowerCase().includes("pm") && h < 12) h += 12;
  if (t.toLowerCase().includes("am") && h === 12) h = 0;
  return h * 60 + m;
};

// Get admin slots for a specific coach (and optionally a specific date)
router.get("/", async (req, res) => {
  const { coachId, date } = req.query;
  try {
    if (date) {
      const doc = await db.collection("coachAvailability").doc(`${coachId}_${date}`).get();
      const adminSlots = doc.exists ? (doc.data().slots || []) : [];

      // Also fetch bookings for this coach and date
      const coachDoc = await db.collection("coaches").doc(coachId).get();
      const coachName = coachDoc.exists ? coachDoc.data().name : "";

      if (coachName) {
        const bookingsSnap = await db.collection("bookings")
          .where("coach", "==", coachName)
          .where("date", "==", date)
          .get();

        bookingsSnap.docs.forEach(doc => {
          const b = doc.data();
          if (b.status === "Confirmed" || b.status === "Pending") {
            const timeStr = b.time || "";
            const [startRaw, endRaw] = timeStr.includes("–") ? timeStr.split("–") : timeStr.split("-");
            const start = (startRaw || "").trim();
            const end = (endRaw || "").trim();
            if (start) {
              adminSlots.push({
                id: `booking_${doc.id}`,
                start,
                end: end || start,
                duration: "Booking",
                status: "Booked",
                bookingId: doc.id,
                bookedBy: b.user || "Customer",
                court: b.court || "",
                isBooking: true,
              });
            }
          }
        });
      }

      return res.json(adminSlots);
    } else {
      // Fetch admin-configured slots
      const snapshot = await db.collection("coachAvailability").get();
      let allSlots = [];
      snapshot.docs.forEach(doc => {
        if (!coachId || doc.id.startsWith(`${coachId}_`)) {
          const parts = doc.id.split("_");
          const cId = parts[0];
          const docDate = parts.slice(1).join("_");
          const slots = doc.data().slots || [];
          slots.forEach(s => allSlots.push({ ...s, date: docDate, coachId: cId }));
        }
      });

      // Fetch bookings to merge as "Booked" slots
      let bookingsQuery = db.collection("bookings");
      let coachName = "";
      
      if (coachId) {
        const coachDoc = await db.collection("coaches").doc(coachId).get();
        coachName = coachDoc.exists ? coachDoc.data().name : "";
        if (coachName) {
          bookingsQuery = bookingsQuery.where("coach", "==", coachName);
        }
      }

      // Only fetch bookings if we either want all coaches (!coachId) or we found the specific coach's name
      if (!coachId || coachName) {
        const bookingsSnap = await bookingsQuery.get();

        // Need coach name to ID mapping if we are fetching all
        const allCoachesSnap = !coachId ? await db.collection("coaches").get() : null;
        const coachNameToId = {};
        if (allCoachesSnap) {
          allCoachesSnap.docs.forEach(d => {
            coachNameToId[d.data().name] = d.id;
          });
        }

        bookingsSnap.docs.forEach(doc => {
          const b = doc.data();
          if (b.status === "Confirmed" || b.status === "Pending") {
            // If it has a coach, we need to show it
            if (b.coach) {
              const bCoachId = coachId ? coachId : (coachNameToId[b.coach] || "");
              if (bCoachId) {
                const timeStr = b.time || "";
                const [startRaw, endRaw] = timeStr.includes("–") ? timeStr.split("–") : timeStr.split("-");
                const start = (startRaw || "").trim();
                const end = (endRaw || "").trim();
                if (start && b.date) {
                  allSlots.push({
                    id: `booking_${doc.id}`,
                    date: b.date,
                    start,
                    end: end || start,
                    duration: "Booking",
                    status: "Booked",
                    bookingId: doc.id,
                    bookedBy: b.user || "Customer",
                    court: b.court || "",
                    isBooking: true,
                    coachId: bCoachId
                  });
                }
              }
            }
          }
        });
      }

      allSlots.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.start || "").localeCompare(b.start || "");
      });
      res.json(allSlots);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Save admin slots for a specific coach and date
router.post("/", auth, async (req, res) => {
  const { coachId, date, slots } = req.body;
  try {
    await db.collection("coachAvailability").doc(`${coachId}_${date}`).set({ slots });
    res.json({ message: "Coach availability saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Check all coaches availability for a specific time (used by users when booking)
router.post("/check-all", async (req, res) => {
  const { date, startTime, endTime } = req.body;
  
  try {
    // We need to return an array of coachIds that are BLOCKED during the requested time.
    const reqStartMin = timeToMinutes(startTime);
    const reqEndMin = endTime ? timeToMinutes(endTime) : reqStartMin;

    const snapshot = await db.collection("coachAvailability").get();
    const blockedCoachIds = [];

    snapshot.docs.forEach(doc => {
      // doc.id format: coachId_date
      if (doc.id.endsWith(`_${date}`)) {
        const coachId = doc.id.substring(0, doc.id.lastIndexOf('_'));
        const slots = doc.data().slots || [];
        
        const blockedSlots = slots.filter(s => s.status === "Blocked");
        const isBlocked = blockedSlots.some(slot => {
          const slotStartMin = timeToMinutes((slot.start || "").trim());
          const slotEndMin = timeToMinutes((slot.end || "").trim());
          
          if (!endTime || reqEndMin === reqStartMin) {
             // Point-in-time check
             return reqStartMin >= slotStartMin && reqStartMin < slotEndMin;
          } else {
             // Range overlap
             return reqStartMin < slotEndMin && reqEndMin > slotStartMin;
          }
        });

        if (isBlocked && !blockedCoachIds.includes(coachId)) {
          blockedCoachIds.push(coachId);
        }
      }
    });
    
    // We could also check the "bookings" collection to see if the coach is already booked 
    // for this time by another user.
    const bookingsSnapshot = await db.collection("bookings")
      .where("date", "==", date)
      .get();
      
    bookingsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if ((data.status === "Confirmed" || data.status === "Pending") && data.coach) {
        // Coach name is stored in booking. We need to match it or rely on coach name
        // Wait, the frontend sends coach name. Let's just return the coach name or ID.
        // It's safer to return the name if the booking only stores name, 
        // but if we match by ID, we might need ID. Let's just return IDs for admin blocks for now.
        // If we want to block them from double-booking, we check if the coach name matches.
      }
    });
    
    // For now, we only handle admin-blocked slots (personal leave).
    res.json({ blockedCoachIds });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
