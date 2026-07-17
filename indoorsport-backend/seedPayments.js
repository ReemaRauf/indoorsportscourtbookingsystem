/**
 * SEED PAYMENTS COLLECTION
 * Run: node seedPayments.js
 *
 * Reads all existing bookings from Firestore
 * and creates a separate "payments" document for each one.
 * Format: PAY-001, PAY-002, ...
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function main() {
  console.log("🚀 Seeding 'payments' collection from existing bookings...\n");

  // 1. Read all bookings
  const bookingsSnap = await db.collection("bookings").get();
  const bookings = [];
  bookingsSnap.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));

  console.log(`📋 Found ${bookings.length} bookings\n`);

  // 2. Clear old payments collection
  const oldPayments = await db.collection("payments").get();
  const batch = db.batch();
  oldPayments.docs.forEach(doc => batch.delete(doc.ref));
  if (oldPayments.docs.length > 0) await batch.commit();
  console.log(`🗑️  Cleared ${oldPayments.docs.length} old payment records\n`);

  // 3. Create a payment record for each booking
  let count = 0;
  for (const booking of bookings) {
    count++;
    const payId = `PAY-${String(count).padStart(3, "0")}`;

    const paymentData = {
      paymentId:     payId,
      bookingId:     booking.id,
      userId:        booking.userId || "",
      user:          booking.user || "",
      phone:         booking.phone || "",
      court:         booking.court || "",
      date:          booking.date || "",
      time:          booking.time || "",
      type:          booking.type || "",
      totalAmount:   Number(booking.price) || 0,
      advancePaid:   Number(booking.advancePaid) || 0,
      balanceDue:    booking.paymentStatus === "Fully Paid"
                       ? 0
                       : Math.max(0, (Number(booking.price) || 0) - (Number(booking.advancePaid) || 0)),
      paymentStatus: booking.paymentStatus || "Unpaid",
      bookingStatus: booking.status || "Pending",
      paymentIntentId: booking.paymentIntentId || null,
      walletAmountUsed: Number(booking.walletAmountUsed) || 0,
      useWallet:     booking.useWallet || false,
      refunded:      booking.refunded || false,
      refundStatus:  booking.refundStatus || "",
      createdAt:     booking.createdAt || new Date().toISOString(),
    };

    await db.collection("payments").doc(payId).set(paymentData);
    console.log(`  ✅ ${payId} → Booking ${booking.id} | ${booking.court} | Rs.${booking.price} | ${booking.paymentStatus || "Unpaid"} | ${booking.status}`);
  }

  console.log(`\n🎉 Done! ${count} payment records created in "payments" collection.`);
  console.log("\nPayments collection now shows:");
  console.log(`  • Fully Paid    : ${bookings.filter(b => b.paymentStatus === "Fully Paid").length}`);
  console.log(`  • Balance Pending: ${bookings.filter(b => b.paymentStatus !== "Fully Paid" && b.status === "Confirmed").length}`);
  console.log(`  • Unpaid        : ${bookings.filter(b => !b.paymentStatus || b.paymentStatus === "Unpaid").length}`);
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
