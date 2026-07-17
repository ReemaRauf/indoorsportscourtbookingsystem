/**
 * Fix Cartoon Coach Avatars
 * Replaces DiceBear cartoon avatars with real photographic portrait URLs.
 * Run: node fixCartoonCoaches.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// Real portrait photo URLs (Unsplash) for the 3 coaches that currently have cartoon avatars
const updates = [
  {
    id: "COH-B03",
    name: "Sahan Jayasooriya",
    // Sri Lankan male fitness coach look — athletic build, polo shirt
    avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face&auto=format"
  },
  {
    id: "COH-T02",
    name: "Amara Gunawardena",
    // South Asian female sports coach look
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face&auto=format"
  },
  {
    id: "COH-T03",
    name: "Nethmi Silva",
    // South Asian female coach — professional look
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face&auto=format"
  },
];

async function fixAvatars() {
  console.log("🔄 Updating cartoon coach avatars to real photos...\n");
  for (const { id, name, avatar } of updates) {
    try {
      await db.collection("coaches").doc(id).update({ avatar });
      console.log(`  ✅ Updated ${name} (${id})`);
    } catch (err) {
      console.error(`  ❌ Failed to update ${name} (${id}):`, err.message);
    }
  }
  console.log("\n✅ Done! All cartoon avatars replaced with real photos.");
  process.exit(0);
}

fixAvatars();
