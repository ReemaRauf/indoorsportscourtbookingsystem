/**
 * FULL SEED SCRIPT — IndoorSport Firestore
 * Run: node seedData.js
 *
 * This script:
 *   1. Clears old incorrectly-IDed data (from previous seed)
 *   2. Re-seeds all collections with correct IDs matching the system format:
 *      Courts:     CRT-B01, CRT-C01, CRT-T01
 *      Coaches:    COH-C01, COH-B01, COH-T01
 *      Equipments: EQP-C01, EQP-B01, EQP-T01
 *      Packages:   PKG-B01, PKG-C01, PKG-T01
 *      Availability: {courtId}_{date}
 *      CoachAvailability: {coachId}_{date}
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ── Helper: get next N dates from today ──────────────────────────────────────
function getNextDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// ── Helper: delete all docs in a collection ──────────────────────────────────
async function clearCollection(name) {
  const snap = await db.collection(name).get();
  const batch = db.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  if (snap.docs.length > 0) await batch.commit();
  console.log(`  🗑️  Cleared ${snap.docs.length} old docs from "${name}"`);
}

// ─── DATA DEFINITIONS ──────────────────────────────────────────────────────────

const courts = [
  { id: "CRT-B01", name: "Badminton Court",    sport: "Badminton",    image: "/court_badminton.png" },
  { id: "CRT-C01", name: "Cricket Court",      sport: "Cricket",      image: "/court_cricket.png" },
  { id: "CRT-T01", name: "Table Tennis Court", sport: "Table Tennis", image: "/court_table_tennis.png" },
  { id: "CRT-O01", name: "Tennis Court",       sport: "Tennis",       image: "/sl_tennis.png" },
];

const coaches = [
  // Cricket — each coach has a unique sport-specific photo
  { id: "COH-C01", name: "Ashan Perera",     sport: "Cricket",      role: "Head Coach",       desc: "10+ years of first-class cricket. Specializes in batting technique and match strategy.", price: 800, avatar: "/coach_ashan.png" },
  { id: "COH-C02", name: "Nuwan Silva",       sport: "Cricket",      role: "Bowling Coach",    desc: "Former national-level fast bowler. Expert in pace, swing, and spin bowling.", price: 700, avatar: "/coach_nuwan.png" },
  { id: "COH-C03", name: "Dilan Fernando",    sport: "Cricket",      role: "Fielding Coach",   desc: "Certified fielding specialist. Trains agility, catching, and ground fielding skills.", price: 600, avatar: "/coach_dilan.png" },
  // Badminton — each coach has a unique sport-specific photo
  { id: "COH-B01", name: "Kasun Rajapaksa",   sport: "Badminton",    role: "Head Coach",       desc: "National-level badminton champion with 8 years of coaching experience.", price: 700, avatar: "/coach_kasun.png" },
  { id: "COH-B02", name: "Hiruni Mendis",     sport: "Badminton",    role: "Smash Specialist", desc: "Expert in offensive play. Trains players in power smashing and net kill techniques.", price: 600, avatar: "/coach_hiruni.png" },
  { id: "COH-B03", name: "Sahan Jayasooriya", sport: "Badminton",    role: "Fitness Coach",    desc: "Specializes in agility and footwork for competitive badminton players.", price: 600, avatar: "/coach_sahan_new.png" },
  // Table Tennis — each coach has a unique photo
  { id: "COH-T01", name: "Ruwan Wickrama",    sport: "Table Tennis", role: "Head Coach",       desc: "Certified TT coach specializing in spin play, footwork, and defensive loops.", price: 600, avatar: "/coach_ruwan.png" },
  { id: "COH-T02", name: "Kamal Gunawardena", sport: "Table Tennis", role: "Attack Coach",     desc: "Specializes in loop drives, counter-attack, and pressure game strategies.", price: 500, avatar: "/coach_kamal.png" },
  { id: "COH-T03", name: "Nalaka Silva",      sport: "Table Tennis", role: "Defensive Coach",  desc: "Expert in defensive strokes, chop blocks, and tactical endurance.", price: 550, avatar: "/coach_nalaka.png" },
];

const equipments = [
  // Cricket — EQP-C
  { id: "EQP-C01", sport: "Cricket",      name: "Cricket Bat",        price: 500, unit: "each",   icon: "🏏", image: "/images/equipments/bat.png", desc: "Premium grade-A English Willow bat for optimal stroke play." },
  { id: "EQP-C02", sport: "Cricket",      name: "Leather Ball",       price: 100, unit: "each",   icon: "⚾", image: "/images/equipments/ball.png", desc: "Standard 5.5oz leather cricket ball for tournament play." },
  { id: "EQP-C03", sport: "Cricket",      name: "Stumps Set",         price: 350, unit: "set",    icon: "🎴", image: "/images/equipments/stumps.png", desc: "Full set of spring-back wooden stumps with bails." },
  { id: "EQP-C04", sport: "Cricket",      name: "Batting Gloves",     price: 200, unit: "pair",   icon: "🧤", image: "/images/equipments/gloves.png", desc: "High-impact absorbing foam gloves with premium leather palm." },
  { id: "EQP-C05", sport: "Cricket",      name: "Leg Guards (Pads)",  price: 200, unit: "pair",   icon: "🛡️", image: "/images/equipments/pads.png", desc: "Lightweight contoured batting leg pads for maximum mobility." },
  { id: "EQP-C06", sport: "Cricket",      name: "Helmet",             price: 400, unit: "each",   icon: "🪖", image: "/images/equipments/helmet.png", desc: "Steel visor certified helmet with adjustable strap." },
  // Badminton — EQP-B
  { id: "EQP-B01", sport: "Badminton",    name: "Racket Pair",        price: 350, unit: "couple", icon: "🏸", image: "/images/equipments/racket.png", desc: "Carbon fiber lightweight rackets for perfect control and smash." },
  { id: "EQP-B02", sport: "Badminton",    name: "Shuttlecock",        price: 50,  unit: "each",   icon: "🏸", image: "/images/equipments/shuttlecock.png", desc: "Premium nylon shuttlecocks with high durability and stable flight." },
  // Table Tennis — EQP-T
  { id: "EQP-T01", sport: "Table Tennis", name: "TT Ball",            price: 100, unit: "each",   icon: "🏓", image: "/images/equipments/ttball.png", desc: "Standard 3-star 40mm seamless table tennis balls for high speed." },
  { id: "EQP-T02", sport: "Table Tennis", name: "Paddle Couple",      price: 350, unit: "couple", icon: "🏓", image: "/images/equipments/paddle.png", desc: "Double-sided rubber paddles with optimal grip and bounce." },

];

const packages = [
  // Badminton — PKG-B
  { id: "PKG-B01", courtName: "Badminton Court", name: "1 Hour Package",  duration: 1, price: 800,  label: "" },
  { id: "PKG-B02", courtName: "Badminton Court", name: "2 Hours Package", duration: 2, price: 1400, label: "Save 200/=" },
  { id: "PKG-B03", courtName: "Badminton Court", name: "3 Hours Package", duration: 3, price: 1900, label: "Save 500/=" },
  // Cricket — PKG-C
  { id: "PKG-C01", courtName: "Cricket Court",   name: "1 Hour Package",  duration: 1, price: 1000, label: "" },
  { id: "PKG-C02", courtName: "Cricket Court",   name: "2 Hours Package", duration: 2, price: 1800, label: "Save 200/=" },
  { id: "PKG-C03", courtName: "Cricket Court",   name: "3 Hours Package", duration: 3, price: 2500, label: "Save 500/=" },
  // Table Tennis — PKG-T
  { id: "PKG-T01", courtName: "Table Tennis Court", name: "1 Hour Package",  duration: 1, price: 600,  label: "" },
  { id: "PKG-T02", courtName: "Table Tennis Court", name: "2 Hours Package", duration: 2, price: 1000, label: "Save 200/=" },
  { id: "PKG-T03", courtName: "Table Tennis Court", name: "3 Hours Package", duration: 3, price: 1400, label: "Save 400/=" },
  // Tennis — PKG-O
  { id: "PKG-O01", courtName: "Tennis Court", name: "1 Hour Package",  duration: 1, price: 900,  label: "" },
  { id: "PKG-O02", courtName: "Tennis Court", name: "2 Hours Package", duration: 2, price: 1600, label: "Save 200/=" },
  { id: "PKG-O03", courtName: "Tennis Court", name: "3 Hours Package", duration: 3, price: 2200, label: "Save 500/=" },
];

// ── Court availability: standard daily operating hours (6AM–10PM) ──────────
// Format: doc ID = {courtId}_{date}, slots = [{id, start, end, duration, status}]
function buildCourtAvailabilityDocs() {
  const docs = [];
  const dates = getNextDates(14); // next 14 days

  // Standard hourly time slots: 06:00 to 22:00
  const timeSlots = [
    { start: "06:00", end: "08:00", duration: "2 Hours" },
    { start: "08:00", end: "10:00", duration: "2 Hours" },
    { start: "10:00", end: "12:00", duration: "2 Hours" },
    { start: "12:00", end: "14:00", duration: "2 Hours" },
    { start: "14:00", end: "16:00", duration: "2 Hours" },
    { start: "16:00", end: "18:00", duration: "2 Hours" },
    { start: "18:00", end: "20:00", duration: "2 Hours" },
    { start: "20:00", end: "22:00", duration: "2 Hours" },
  ];

  for (const court of courts) {
    for (const date of dates) {
      const slots = timeSlots.map((s, i) => ({
        id: Date.now() + i + Math.random(),
        start: s.start,
        end: s.end,
        duration: s.duration,
        status: "Available",
      }));
      docs.push({
        id: `${court.id}_${date}`,
        data: { slots },
      });
    }
  }
  return docs;
}

// ── Coach availability: coaches available every day ────────────────────────
function buildCoachAvailabilityDocs() {
  const docs = [];
  const dates = getNextDates(14);

  const slots = [
    { start: "06:00", end: "22:00", duration: "Full Day", status: "Available" },
  ];

  for (const coach of coaches) {
    for (const date of dates) {
      docs.push({
        id: `${coach.id}_${date}`,
        data: {
          slots: slots.map((s, i) => ({ id: Date.now() + i + Math.random(), ...s })),
        },
      });
    }
  }
  return docs;
}

// ─── MAIN SEED ─────────────────────────────────────────────────────────────────
async function seedCollection(collectionName, items) {
  console.log(`\n📦 Seeding "${collectionName}" (${items.length} items)...`);
  let added = 0;

  for (const item of items) {
    const { id, data } = item.data ? item : { id: item.id, data: (() => { const { id: _id, ...rest } = item; return rest; })() };
    await db.collection(collectionName).doc(id).set(data);
    console.log(`  ✅ ${id}`);
    added++;
  }

  console.log(`  → Done: ${added} added.`);
}

async function main() {
  console.log("🚀 IndoorSport — Full Firestore Seed\n");
  console.log("Step 1: Clearing old incorrectly-seeded data...");

  // Clear only non-bookings / non-users collections (don't touch real data)
  await clearCollection("courts");
  await clearCollection("coaches");
  await clearCollection("equipments");
  await clearCollection("packages");
  await clearCollection("availability");
  await clearCollection("coachAvailability");

  console.log("\nStep 2: Seeding with correct data...");

  // Re-seed with correct IDs
  await seedCollection("courts",    courts.map(({ id, ...data }) => ({ id, data })));
  await seedCollection("coaches",   coaches.map(({ id, ...data }) => ({ id, data })));
  await seedCollection("equipments",equipments.map(({ id, ...data }) => ({ id, data })));
  await seedCollection("packages",  packages.map(({ id, ...data }) => ({ id, data })));

  console.log("\nStep 3: Seeding availability time slots (next 14 days)...");
  const availDocs = buildCourtAvailabilityDocs();
  console.log(`📦 Seeding "availability" (${availDocs.length} documents)...`);
  for (const doc of availDocs) {
    await db.collection("availability").doc(doc.id).set(doc.data);
    process.stdout.write(".");
  }
  console.log(`\n  → Done: ${availDocs.length} availability docs added.`);

  console.log("\nStep 4: Seeding coach availability (next 14 days)...");
  const coachAvailDocs = buildCoachAvailabilityDocs();
  console.log(`📦 Seeding "coachAvailability" (${coachAvailDocs.length} documents)...`);
  for (const doc of coachAvailDocs) {
    await db.collection("coachAvailability").doc(doc.id).set(doc.data);
    process.stdout.write(".");
  }
  console.log(`\n  → Done: ${coachAvailDocs.length} coachAvailability docs added.`);

  console.log("\n\n🎉 All done! Summary:");
  console.log(`   ✅ courts          → ${courts.length} documents`);
  console.log(`   ✅ coaches         → ${coaches.length} documents`);
  console.log(`   ✅ equipments      → ${equipments.length} documents`);
  console.log(`   ✅ packages        → ${packages.length} documents`);
  console.log(`   ✅ availability    → ${availDocs.length} documents (14 days × 4 courts × 8 slots)`);
  console.log(`   ✅ coachAvailability → ${coachAvailDocs.length} documents (14 days × 7 coaches)`);
  console.log("\n   ℹ️  bookings & users → NOT touched (real data preserved)");
  process.exit(0);
}

main().catch(err => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
