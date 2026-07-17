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
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop&crop=face&auto=format"
  },
  {
    id: "COH-T02",
    name: "Kamal Gunawardena",
    avatar: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=400&h=400&fit=crop&crop=face&auto=format"
  },
  {
    id: "COH-T03",
    name: "Nalaka Silva",
    avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop&crop=face&auto=format"
  }
];

async function fixAvatars() {
  console.log("🔄 Updating coaches to Sri Lankan appearance...\n");
  for (const { id, name, avatar } of updates) {
    try {
      await db.collection("coaches").doc(id).update({ avatar });
      console.log(`  ✅ Updated ${name} (${id})`);
    } catch (err) {
      console.error(`  ❌ Failed to update ${name} (${id}):`, err.message);
    }
  }
  console.log("\n✅ Done! Coaches updated to Sri Lankan appearance.");
  process.exit(0);
}

fixAvatars();
