const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const updates = [
  {
    id: "COH-B03",
    name: "Sahan Jayasooriya",
    avatar: "/coach_sahan_new.png"
  },
  {
    id: "COH-T02",
    name: "Kamal Gunawardena",
    avatar: "/coach_kamal.png"
  },
  {
    id: "COH-T03",
    name: "Nalaka Silva",
    avatar: "/coach_nalaka.png"
  }
];

async function fixAvatars() {
  console.log("🔄 Updating coaches to AI generated Sri Lankan appearance...\n");
  for (const { id, name, avatar } of updates) {
    try {
      await db.collection("coaches").doc(id).update({ avatar });
      console.log(`  ✅ Updated ${name} (${id})`);
    } catch (err) {
      console.error(`  ❌ Failed to update ${name} (${id}):`, err.message);
    }
  }
  console.log("\n✅ Done! Coaches updated.");
  process.exit(0);
}

fixAvatars();
