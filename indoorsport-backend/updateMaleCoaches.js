const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const updates = [
  {
    id: "COH-T02",
    name: "Kamal Gunawardena",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face&auto=format"
  },
  {
    id: "COH-T03",
    name: "Nalaka Silva",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format"
  }
];

async function fixAvatars() {
  console.log("🔄 Updating female coaches to male coaches...\n");
  for (const { id, name, avatar } of updates) {
    try {
      await db.collection("coaches").doc(id).update({ name, avatar });
      console.log(`  ✅ Updated ${name} (${id})`);
    } catch (err) {
      console.error(`  ❌ Failed to update ${name} (${id}):`, err.message);
    }
  }
  console.log("\n✅ Done! Female coaches updated to male coaches.");
  process.exit(0);
}

fixAvatars();
