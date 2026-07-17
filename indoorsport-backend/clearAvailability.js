/**
 * Clear all availability and coach availability data from Firestore
 * Run: node clearAvailability.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.docs.length === 0) {
    console.log(`  ✅ "${name}" is already empty.`);
    return;
  }

  // Firestore batch limit is 500
  const batchSize = 500;
  for (let i = 0; i < snap.docs.length; i += batchSize) {
    const batch = db.batch();
    const chunk = snap.docs.slice(i, i + batchSize);
    chunk.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
  console.log(`  🗑️  Deleted ${snap.docs.length} documents from "${name}"`);
}

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧹 Clearing availability data from Firestore...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await clearCollection("availability");       // Court slots (Badminton Court, etc.)
  await clearCollection("coachAvailability");   // Coach leave slots (Kasun Rajapaksa, etc.)

  console.log("\n✅ All availability data has been removed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
