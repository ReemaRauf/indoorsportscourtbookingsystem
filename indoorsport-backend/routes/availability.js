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

// Get admin slots for a specific court (and optionally a specific date)
router.get("/", async (req, res) => {
  const { courtId, date } = req.query;
  try {
    if (date) {
      const doc = await db.collection("availability").doc(`${courtId}_${date}`).get();
      const adminSlots = doc.exists ? (doc.data().slots || []) : [];

      // Also fetch bookings for this court and date
      const courtDoc = await db.collection("courts").doc(courtId).get();
      const courtName = courtDoc.exists ? courtDoc.data().name : "";
      
      if (courtName) {
        const bookingsSnap = await db.collection("bookings")
          .where("court", "==", courtName)
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
                isBooking: true,
              });
            }
          }
        });
      }

      return res.json(adminSlots);
    } else {
      // Fetch admin-configured slots
      const snapshot = await db.collection("availability").get();
      let allSlots = [];
      snapshot.docs.forEach(doc => {
        if (doc.id.startsWith(`${courtId}_`)) {
          const docDate = doc.id.substring(courtId.length + 1);
          const slots = doc.data().slots || [];
          slots.forEach(s => allSlots.push({ ...s, date: docDate }));
        }
      });

      // Fetch bookings for this court and merge as "Booked" slots
      const courtDoc = await db.collection("courts").doc(courtId).get();
      const courtName = courtDoc.exists ? courtDoc.data().name : "";

      if (courtName) {
        const bookingsSnap = await db.collection("bookings")
          .where("court", "==", courtName)
          .get();

        bookingsSnap.docs.forEach(doc => {
          const b = doc.data();
          if (b.status === "Confirmed" || b.status === "Pending") {
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
                isBooking: true,
              });
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

// Save admin slots for a specific court and date
router.post("/", auth, async (req, res) => {
  const { courtId, date, slots } = req.body;
  try {
    await db.collection("availability").doc(`${courtId}_${date}`).set({ slots });
    res.json({ message: "Availability saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Check Availability (used by users when booking)
router.post("/check", async (req, res) => {
  const { courtId, courtName, date, time, startTime, endTime } = req.body;
  
  try {
    // 1. Check existing bookings (exact time string match)
    const bookingsSnapshot = await db.collection("bookings")
      .where("court", "==", courtName)
      .where("date", "==", date)
      .get();
      
    const isConflictWithBooking = bookingsSnapshot.docs.some(doc => {
      const data = doc.data();
      if (data.status !== "Confirmed" && data.status !== "Pending") return false;
      // Check time overlap using stored time string
      const storedTime = data.time || "";
      const [sStart, sEnd] = storedTime.split("–").map(t => t.trim());
      if (!sStart) return false;
      const reqS = timeToMinutes(startTime);
      const reqE = endTime ? timeToMinutes(endTime) : reqS;
      const bkS = timeToMinutes(sStart);
      const bkE = sEnd ? timeToMinutes(sEnd) : bkS;
      
      return reqS < bkE && reqE > bkS;
    });

    if (isConflictWithBooking) {
      return res.json({ available: false, reason: "Already booked" });
    }

    // 2. Check admin-configured blocked slots
    const reqStart = startTime || "";
    const reqEnd = endTime || "";

    const availDoc = await db.collection("availability").doc(`${courtId}_${date}`).get();
    if (availDoc.exists && reqStart) {
      const slots = availDoc.data().slots || [];
      const blockedSlots = slots.filter(s => s.status === "Blocked");
      
      const reqStartMin = timeToMinutes(reqStart);
      const reqEndMin = reqEnd ? timeToMinutes(reqEnd) : reqStartMin;

      const isBlockedByAdmin = blockedSlots.some(slot => {
        const sStart = (slot.start || "").trim();
        const sEnd = (slot.end || "").trim();

        const slotStartMin = timeToMinutes(sStart);
        const slotEndMin = timeToMinutes(sEnd);
        
        if (!reqEnd || reqEndMin === reqStartMin) {
          // Point-in-time check (package booking with only start time)
          return reqStartMin >= slotStartMin && reqStartMin < slotEndMin;
        } else {
          // Range overlap: (StartA < EndB) and (EndA > StartB)
          return reqStartMin < slotEndMin && reqEndMin > slotStartMin;
        }
      });

      if (isBlockedByAdmin) {
        return res.json({ available: false, reason: "Blocked by administration" });
      }
    }
    
    res.json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get already booked or blocked times for a specific court and date
router.get("/booked-times", async (req, res) => {
  const { courtId, courtName, date } = req.query;
  if (!date) return res.json([]);

  try {
    const unavailableTimes = [];

    // 1. Fetch from bookings collection
    if (courtName) {
      const bookingsSnapshot = await db.collection("bookings")
        .where("court", "==", courtName)
        .where("date", "==", date)
        .get();

      bookingsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === "Confirmed" || data.status === "Pending") {
          if (data.time) {
            unavailableTimes.push({ time: data.time, type: 'Booking' });
          }
        }
      });
    }

    // 2. Fetch from admin blocked slots
    if (courtId) {
      const availDoc = await db.collection("availability").doc(`${courtId}_${date}`).get();
      if (availDoc.exists) {
        const slots = availDoc.data().slots || [];
        slots.forEach(slot => {
          if (slot.status === "Blocked") {
            const timeStr = `${slot.start} – ${slot.end}`;
            unavailableTimes.push({ time: timeStr, type: 'Blocked' });
          }
        });
      }
    }

    // Sort by start time roughly
    unavailableTimes.sort((a, b) => timeToMinutes(a.time.split('–')[0].trim()) - timeToMinutes(b.time.split('–')[0].trim()));

    res.json(unavailableTimes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
