const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { admin, db } = require("../firebase");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  sendEmail,
  buildBookingConfirmationEmail,
  buildCancellationEmail,
  buildRejectionEmail
} = require("../utils/email");

// ─── Helper: get user email from Firestore ─────────────────────────────────
const getUserEmail = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists && userDoc.data().email) {
      return userDoc.data().email;
    }
  } catch (e) {
    console.error("Could not fetch user email:", e.message);
  }
  return null;
};

// ─── GET /bookings ─────────────────────────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    let bookingsSnapshot;
    if (req.user.role === "admin") {
      bookingsSnapshot = await db.collection("bookings").orderBy("createdAt", "desc").get();
    } else {
      bookingsSnapshot = await db.collection("bookings")
        .where("userId", "==", req.user.id)
        .get();
    }

    const bookings = [];
    bookingsSnapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    if (req.user.role !== "admin") {
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ─── POST /bookings — Create a new booking ─────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const {
      court, date, time, type, user, phone,
      pkg, coach, equipments, advancePaid,
      paymentStatus: clientPaymentStatus, status: clientStatus, paymentIntentId, useWallet, walletAmountUsed
    } = req.body;

    // --- Stripe Verification & Secure Status Overrides ---
    let finalStatus = "Pending";
    let finalPaymentStatus = "Unpaid";

    if (paymentIntentId) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== 'succeeded') {
        throw new Error("Payment verification failed. Please try again.");
      }
      finalStatus = "Confirmed";
      finalPaymentStatus = "Advance Paid";
    } else if (useWallet) {
      finalStatus = "Confirmed";
      finalPaymentStatus = "Paid via Wallet";
    }

    // --- Price Calculation on Backend ---
    let calculatedPrice = 0;
    
    // Helper for duration
    const calculateDuration = (tStr) => {
      if(!tStr || !tStr.includes(" - ")) return 1;
      const [s, e] = tStr.split(" - ");
      const parseTime = (t) => {
        let [timeStr, modifier] = t.split(" ");
        let [h, m] = timeStr.split(":");
        h = parseInt(h, 10);
        if(modifier === "PM" && h !== 12) h += 12;
        if(modifier === "AM" && h === 12) h = 0;
        return h + parseInt(m||0, 10)/60;
      };
      return Math.max(1, parseTime(e) - parseTime(s));
    };

    const getHourlyRate = (name) => {
      const lowerName = name?.toLowerCase() || "";
      if (lowerName.includes("cricket")) return 1000;
      if (lowerName.includes("badminton")) return 600;
      if (lowerName.includes("table tennis")) return 1000;
      return 1000;
    };

    let hrs = calculateDuration(time);
    let durationHrs = hrs;

    if (type === "package" && pkg) {
      const pkgDocs = await db.collection("packages").where("name", "==", pkg).get();
      if(!pkgDocs.empty) {
        const pData = pkgDocs.docs[0].data();
        calculatedPrice += pData.price;
        durationHrs = pData.duration || 1;
      } else {
        calculatedPrice += 2000;
      }
    } else {
      calculatedPrice += (hrs > 0 ? hrs * getHourlyRate(court) : 2000);
    }

    if (coach) {
      const coachDocs = await db.collection("coaches").where("name", "==", coach).get();
      if(!coachDocs.empty) {
        calculatedPrice += (coachDocs.docs[0].data().price || 500) * durationHrs;
      }
    }

    if (equipments && equipments.length > 0) {
      for (let eq of equipments) {
        const eqDocs = await db.collection("equipments").where("name", "==", eq.name).get();
        if(!eqDocs.empty) {
           calculatedPrice += (eqDocs.docs[0].data().price || 0) * (eq.quantity || 1);
        }
      }
    }

    let finalAdvancePaid = advancePaid ? Number(advancePaid) : 0;
    if (finalAdvancePaid > calculatedPrice) finalAdvancePaid = calculatedPrice;

    let finalWalletAmountUsed = walletAmountUsed ? Number(walletAmountUsed) : 0;
    if (finalWalletAmountUsed > calculatedPrice) finalWalletAmountUsed = calculatedPrice;

    // Automatically confirm if advance is paid
    if (finalAdvancePaid > 0) {
      finalStatus = "Confirmed";
      if (finalPaymentStatus === "Unpaid") {
        finalPaymentStatus = "Advance Paid";
      }
    }

    // --- Transaction for ID Generation and Wallet Deduction ---
    const result = await db.runTransaction(async (transaction) => {
      // 1. Check availability
      const conflictSnapshot = await transaction.get(db.collection("bookings")
        .where("court", "==", court)
        .where("date", "==", date)
        .where("time", "==", time));

      const isConflict = conflictSnapshot.docs.some(doc => {
        const d = doc.data();
        return d.status === "Confirmed" || d.status === "Pending";
      });

      if (isConflict) {
        throw new Error("Time slot is no longer available");
      }

      // 2. Get next IDs securely
      const counterRef = db.collection("counters").doc("system");
      const counterDoc = await transaction.get(counterRef);
      
      let nextBookingNum = 1;
      let nextPaymentNum = 1;
      
      if (counterDoc.exists) {
        const data = counterDoc.data();
        nextBookingNum = (data.bookingCount || 0) + 1;
        nextPaymentNum = (data.paymentCount || 0) + 1;
      }

      const nextId = `ISC${String(nextBookingNum).padStart(2, "0")}`;
      const payId = `PAY-${String(nextPaymentNum).padStart(3, "0")}`;

      // 3. Deduct Wallet Balance Atomically
      if (useWallet && finalWalletAmountUsed > 0) {
        const userRef = db.collection("users").doc(req.user.id);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new Error("User not found");
        
        const currentBalance = userDoc.data().walletBalance || 0;
        if (currentBalance < finalWalletAmountUsed) {
          throw new Error("Insufficient wallet balance");
        }
        
        transaction.update(userRef, { 
          walletBalance: admin.firestore.FieldValue.increment(-finalWalletAmountUsed) 
        });
      }

      // 4. Update counters
      transaction.set(counterRef, {
        bookingCount: nextBookingNum,
        paymentCount: nextPaymentNum
      }, { merge: true });

      // 5. Create Booking Document
      const bookingData = {
        court, date, time, type,
        price: calculatedPrice,
        user, phone,
        package: pkg || "—",
        coach: coach || "",
        equipments: equipments || [],
        advancePaid: finalAdvancePaid,
        paymentStatus: finalPaymentStatus,
        status: finalStatus,
        paymentIntentId: paymentIntentId || null,
        useWallet: useWallet || false,
        walletAmountUsed: finalWalletAmountUsed,
        userId: req.user.id,
        createdAt: new Date().toISOString()
      };
      const bookingRef = db.collection("bookings").doc(nextId);
      transaction.set(bookingRef, bookingData);

      // 6. Create Payment Document
      const paymentRef = db.collection("payments").doc(payId);
      const balanceDue = finalPaymentStatus === "Fully Paid" ? 0 : Math.max(0, calculatedPrice - finalAdvancePaid);
      transaction.set(paymentRef, {
        paymentId: payId,
        bookingId: nextId,
        userId: req.user.id,
        user: user,
        phone: phone,
        court: court,
        date: date,
        time: time,
        type: type,
        totalAmount: calculatedPrice,
        advancePaid: finalAdvancePaid,
        balanceDue: balanceDue,
        paymentStatus: finalPaymentStatus,
        bookingStatus: finalStatus,
        paymentIntentId: paymentIntentId || null,
        walletAmountUsed: finalWalletAmountUsed,
        useWallet: useWallet || false,
        refunded: false,
        refundStatus: "",
        createdAt: new Date().toISOString()
      });

      return { nextId, bookingData };
    });

    // Success response
    res.json({ id: result.nextId, ...result.bookingData });

    // Send confirmation email asynchronously
    const userEmail = await getUserEmail(req.user.id);
    if (userEmail) {
      const isConfirmed = result.bookingData.status === "Confirmed";
      const html = buildBookingConfirmationEmail({ id: result.nextId, ...result.bookingData });
      sendEmail({
        email: userEmail,
        subject: `${isConfirmed ? "✅ Booking Confirmed!" : "⏳ Booking Received"} — ${result.nextId} | Sportiva`,
        message: `Dear ${user},\n\nYour booking (${result.nextId}) for ${court} on ${date} at ${time} has been ${isConfirmed ? 'confirmed' : 'received and is pending confirmation'}.\n\nThank you for choosing Sportiva!`,
        html
      });
    }

  } catch (err) {
    console.error(err);
    res.status(err.message === "Time slot is no longer available" || err.message === "Insufficient wallet balance" ? 400 : 500).json({ message: err.message || "Server error" });
  }
});

// ─── PUT /bookings/:id/status — Update booking status ─────────────────────
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const docRef = db.collection("bookings").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = { id: req.params.id, ...docSnap.data() };

    // Permission check: non-admin can only cancel their own active bookings
    if (req.user.role !== "admin") {
      const isOwner = booking.userId === req.user.id;
      const isActive = booking.status === "Confirmed" || booking.status === "Pending";
      if (status !== "Cancelled" || !isOwner || !isActive) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Build Firestore update payload
    const updatePayload = { status };
    if (status === "Cancelled") {
      updatePayload.cancelledBy = req.user.role === "admin" ? "admin" : "user";
      if (reason) updatePayload.cancelReason = reason;
    }
    if (status === "Rejected") {
      updatePayload.cancelledBy = "admin";
      if (reason) updatePayload.rejectReason = reason;
    }

    if ((status === "Cancelled" || status === "Rejected") && booking.advancePaid > 0 && !booking.refunded) {
      const userRef = db.collection("users").doc(booking.userId);
      // Atomic increment for refund
      await userRef.update({ 
        walletBalance: admin.firestore.FieldValue.increment(booking.advancePaid) 
      });
      updatePayload.refunded = true;
      updatePayload.refundStatus = "Refunded to Wallet";
    }

    await docRef.update(updatePayload);

    // Sync payments collection
    if (status === "Cancelled" || status === "Rejected") {
      const paymentsSnapshot = await db.collection("payments").where("bookingId", "==", req.params.id).get();
      if (!paymentsSnapshot.empty) {
        const paymentRef = paymentsSnapshot.docs[0].ref;
        await paymentRef.update({ 
          bookingStatus: status,
          paymentStatus: updatePayload.refunded ? "Refunded" : "Cancelled" 
        });
      }
    }

    // ✅ Respond immediately — don't block for email
    res.json({ id: req.params.id, ...booking, status });

        // ── Send email notifications ───────────────────────────────────────────

    // Admin cancelled a confirmed booking → email user with reason
    if (status === "Cancelled" && req.user.role === "admin") {
      const userEmail = await getUserEmail(booking.userId);
      if (userEmail) {
        const html = buildCancellationEmail(booking, reason);
        sendEmail({
          email: userEmail,
          subject: `❌ Booking Cancelled — ${booking.id} | Sportiva`,
          message: `Dear ${booking.user},\n\nYour booking (${booking.id}) for ${booking.court} on ${booking.date} at ${booking.time} has been cancelled by our admin.${reason ? `\n\nReason: ${reason}` : ""}\n\nSportiva Team`,
          html
        });
      }
    }

    // Admin rejected a pending booking → email user with reason
    if (status === "Rejected") {
      const userEmail = await getUserEmail(booking.userId);
      if (userEmail) {
        const html = buildRejectionEmail(booking, reason);
        sendEmail({
          email: userEmail,
          subject: `🚫 Booking Rejected — ${booking.id} | Sportiva`,
          message: `Dear ${booking.user},\n\nYour booking (${booking.id}) for ${booking.court} on ${booking.date} at ${booking.time} has been rejected by our admin.${reason ? `\n\nReason: ${reason}` : ""}\n\nSportiva Team`,
          html
        });
      }
    }

    // Admin confirmed a booking → email user
    if (status === "Confirmed") {
      const userEmail = await getUserEmail(booking.userId);
      if (userEmail) {
        const html = buildBookingConfirmationEmail(booking);
        sendEmail({
          email: userEmail,
          subject: `✅ Booking Confirmed! — ${booking.id} | Sportiva`,
          message: `Dear ${booking.user},\n\nYour booking (${booking.id}) for ${booking.court} on ${booking.date} at ${booking.time} has been confirmed by our admin!\n\nSportiva Team`,
          html
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ─── PUT /bookings/mark-paid/:id — Mark booking as fully paid ───────────────
router.put("/mark-paid/:id", auth, async (req, res) => {
  try {
    const docRef = db.collection("bookings").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const booking = docSnap.data();
    
    // Update paymentStatus to "Fully Paid"
    await docRef.update({ paymentStatus: "Fully Paid" });

    // ── Also update the payments collection ───────────────────────────────
    const paySnap = await db.collection("payments").where("bookingId", "==", req.params.id).get();
    paySnap.forEach(async doc => {
      await doc.ref.update({ paymentStatus: "Fully Paid", balanceDue: 0 });
    });

    res.json({ id: req.params.id, ...booking, paymentStatus: "Fully Paid" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
