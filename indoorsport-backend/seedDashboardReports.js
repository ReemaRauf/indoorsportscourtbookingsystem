/**
 * SEED dashboardStats + reports COLLECTIONS
 * Run: node seedDashboardReports.js
 *
 * Creates:
 *   - "dashboardStats" → pre-calculated dashboard summary
 *   - "reports"        → sport-wise monthly revenue/booking breakdown
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ── Helper: detect sport from court name ────────────────────────────────────
function getSport(courtName) {
  if (!courtName) return "Other";
  const c = courtName.toLowerCase();
  if (c.includes("badminton"))    return "Badminton";
  if (c.includes("cricket"))      return "Cricket";
  if (c.includes("table tennis")) return "Table Tennis";
  if (c.includes("tennis"))       return "Tennis";
  return "Other";
}

async function main() {
  console.log("🚀 Seeding dashboardStats + reports collections...\n");

  // ── Read all bookings ─────────────────────────────────────────────────────
  const bookingsSnap = await db.collection("bookings").get();
  const bookings = [];
  bookingsSnap.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));
  console.log(`📋 Found ${bookings.length} bookings\n`);

  // ── Read coaches + equipments ─────────────────────────────────────────────
  const coachesSnap = await db.collection("coaches").get();
  const coaches = [];
  coachesSnap.forEach(doc => coaches.push({ id: doc.id, ...doc.data() }));

  const equipSnap = await db.collection("equipments").get();
  const equipments = [];
  equipSnap.forEach(doc => equipments.push({ id: doc.id, ...doc.data() }));

  // ════════════════════════════════════════════════════════════════════════════
  //  1. DASHBOARD STATS
  // ════════════════════════════════════════════════════════════════════════════
  console.log("📊 Building dashboardStats...");

  const now        = new Date();
  const todayISO   = now.toISOString().split("T")[0];

  const confirmed  = bookings.filter(b => b.status === "Confirmed");
  const cancelled  = bookings.filter(b => b.status === "Cancelled" || b.status === "Rejected");
  const pending    = bookings.filter(b => b.status === "Pending");
  const todayBks   = bookings.filter(b => b.createdAt && b.createdAt.startsWith(todayISO));
  const fullyPaid  = confirmed.filter(b => b.paymentStatus === "Fully Paid");
  const totalRev   = confirmed.reduce((s, b) => s + (b.price || 0), 0);
  const totalAdv   = confirmed.reduce((s, b) => s + (b.advancePaid || 0), 0);
  const balanceDue = confirmed.reduce((s, b) => {
    if (b.paymentStatus === "Fully Paid") return s;
    return s + Math.max(0, (b.price || 0) - (b.advancePaid || 0));
  }, 0);

  // Recent 5 bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(b => ({
      id: b.id, user: b.user, court: b.court,
      date: b.date, time: b.time, status: b.status,
    }));

  // Court-wise booking counts
  const courtBreakdown = {};
  bookings.forEach(b => {
    if (!b.court) return;
    if (!courtBreakdown[b.court]) courtBreakdown[b.court] = { total: 0, confirmed: 0, cancelled: 0 };
    courtBreakdown[b.court].total++;
    if (b.status === "Confirmed") courtBreakdown[b.court].confirmed++;
    if (b.status === "Cancelled" || b.status === "Rejected") courtBreakdown[b.court].cancelled++;
  });

  const dashboardData = {
    generatedAt:       now.toISOString(),
    totalBookings:     bookings.length,
    todayBookings:     todayBks.length,
    confirmedBookings: confirmed.length,
    pendingBookings:   pending.length,
    cancelledBookings: cancelled.length,
    fullyPaidBookings: fullyPaid.length,
    totalRevenue:      totalRev,
    totalAdvance:      totalAdv,
    balanceDue:        balanceDue,
    totalCoaches:      coaches.length,
    totalEquipments:   equipments.length,
    recentBookings,
    courtBreakdown,
  };

  await db.collection("dashboardStats").doc("current").set(dashboardData);
  console.log("  ✅ dashboardStats/current → saved!\n");

  // ════════════════════════════════════════════════════════════════════════════
  //  2. REPORTS — sport-wise breakdown per year-month
  // ════════════════════════════════════════════════════════════════════════════
  console.log("📈 Building reports collection...");

  // Group bookings by year-month and sport
  const grouped = {}; // { "2026-05": { Badminton: {...}, Cricket: {...} } }

  bookings.forEach(b => {
    if (!b.date) return;
    const parts = b.date.split("-");
    if (parts.length < 2) return;
    const yearMonth = `${parts[0]}-${parts[1]}`; // e.g. "2026-05"
    const sport = getSport(b.court);

    if (!grouped[yearMonth]) grouped[yearMonth] = {};
    if (!grouped[yearMonth][sport]) {
      grouped[yearMonth][sport] = {
        sport,
        yearMonth,
        year:              parts[0],
        month:             parts[1],
        totalBookings:     0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        pendingBookings:   0,
        totalRevenue:      0,
        advancePaid:       0,
        balanceDue:        0,
        fullyPaid:         0,
      };
    }

    const entry = grouped[yearMonth][sport];
    entry.totalBookings++;
    if (b.status === "Confirmed") {
      entry.confirmedBookings++;
      entry.totalRevenue  += b.price || 0;
      entry.advancePaid   += b.advancePaid || 0;
      entry.balanceDue    += b.paymentStatus === "Fully Paid"
                              ? 0
                              : Math.max(0, (b.price || 0) - (b.advancePaid || 0));
      if (b.paymentStatus === "Fully Paid") entry.fullyPaid++;
    }
    if (b.status === "Cancelled" || b.status === "Rejected") entry.cancelledBookings++;
    if (b.status === "Pending") entry.pendingBookings++;
  });

  // Also build yearly summaries
  const yearlyGrouped = {};
  bookings.forEach(b => {
    if (!b.date) return;
    const year  = b.date.split("-")[0];
    const sport = getSport(b.court);
    if (!yearlyGrouped[year]) yearlyGrouped[year] = {};
    if (!yearlyGrouped[year][sport]) {
      yearlyGrouped[year][sport] = {
        sport, year, totalBookings: 0, confirmedBookings: 0,
        cancelledBookings: 0, pendingBookings: 0,
        totalRevenue: 0, advancePaid: 0, balanceDue: 0, fullyPaid: 0,
      };
    }
    const e = yearlyGrouped[year][sport];
    e.totalBookings++;
    if (b.status === "Confirmed") {
      e.confirmedBookings++;
      e.totalRevenue += b.price || 0;
      e.advancePaid  += b.advancePaid || 0;
      e.balanceDue   += b.paymentStatus === "Fully Paid"
                          ? 0
                          : Math.max(0, (b.price || 0) - (b.advancePaid || 0));
      if (b.paymentStatus === "Fully Paid") e.fullyPaid++;
    }
    if (b.status === "Cancelled" || b.status === "Rejected") e.cancelledBookings++;
    if (b.status === "Pending") e.pendingBookings++;
  });

  // Clear old reports
  const oldReports = await db.collection("reports").get();
  const batch = db.batch();
  oldReports.docs.forEach(doc => batch.delete(doc.ref));
  if (oldReports.docs.length > 0) await batch.commit();
  console.log(`  🗑️  Cleared ${oldReports.docs.length} old report docs`);

  // Save monthly reports: doc ID = "2026-05_Badminton"
  let monthlyCount = 0;
  for (const [yearMonth, sports] of Object.entries(grouped)) {
    for (const [sport, data] of Object.entries(sports)) {
      const docId = `${yearMonth}_${sport.replace(" ", "_")}`;
      await db.collection("reports").doc(docId).set(data);
      console.log(`  ✅ reports/${docId}`);
      monthlyCount++;
    }
  }

  // Save yearly reports: doc ID = "2026_Badminton"
  let yearlyCount = 0;
  for (const [year, sports] of Object.entries(yearlyGrouped)) {
    for (const [sport, data] of Object.entries(sports)) {
      const docId = `${year}_${sport.replace(" ", "_")}`;
      await db.collection("reports").doc(docId).set(data);
      console.log(`  ✅ reports/${docId} (yearly)`);
      yearlyCount++;
    }
  }

  console.log(`\n🎉 All done! Summary:`);
  console.log(`   ✅ dashboardStats → 1 document (current stats)`);
  console.log(`   ✅ reports        → ${monthlyCount} monthly + ${yearlyCount} yearly = ${monthlyCount + yearlyCount} documents`);
  console.log(`\n   Dashboard shows:`);
  console.log(`      Total Bookings    : ${bookings.length}`);
  console.log(`      Today's Bookings  : ${todayBks.length}`);
  console.log(`      Total Revenue     : Rs. ${totalRev.toLocaleString()}/=`);
  console.log(`      Confirmed         : ${confirmed.length}`);
  console.log(`      Cancelled/Rejected: ${cancelled.length}`);
  console.log(`      Fully Paid        : ${fullyPaid.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
