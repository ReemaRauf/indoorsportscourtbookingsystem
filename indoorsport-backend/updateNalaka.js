const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function fixAvatar() {
  const id = "COH-T03";
  const avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format";
  
  console.log("🔄 Updating Nalaka Silva to a more Sri Lankan appearance...\n");
  try {
    await db.collection("coaches").doc(id).update({ avatar });
    console.log(`  ✅ Updated Nalaka Silva (${id})`);
  } catch (err) {
    console.error(`  ❌ Failed to update Nalaka Silva (${id}):`, err.message);
  }
  console.log("\n✅ Done!");
  process.exit(0);
}

fixAvatar();
