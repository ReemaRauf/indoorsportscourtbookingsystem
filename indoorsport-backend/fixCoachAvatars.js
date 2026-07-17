/**
 * Fix Coach Avatars Script
 * Updates the avatar field for each coach in Firestore to use unique, 
 * sport-appropriate photos stored in the public folder.
 * 
 * Run: node fixCoachAvatars.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// Map each coach ID to their unique avatar path
// Using DiceBear avataaars API for coaches that don't have a sport-specific photo
const COACH_AVATARS = {
  // Cricket coaches — all have proper sport photos
  "COH-C01": "/coach_ashan.png",    // Ashan Perera — Head Coach
  "COH-C02": "/coach_nuwan.png",    // Nuwan Silva — Bowling Coach
  "COH-C03": "/coach_dilan.png",    // Dilan Fernando — Fielding Coach

  // Badminton coaches
  "COH-B01": "/coach_kasun.png",    // Kasun Rajapaksa — Head Coach
  "COH-B02": "/coach_hiruni.png",   // Hiruni Mendis — Smash Specialist
  // Sahan Jayasooriya — Fitness Coach (use DiceBear since existing photo is wrong stock image)
  "COH-B03": "https://api.dicebear.com/7.x/personas/svg?seed=SahanJayasooriya&backgroundColor=b6e3f4&radius=50&size=128",

  // Table Tennis coaches
  "COH-T01": "/coach_ruwan.png",    // Ruwan Wickrama — Head Coach
  // Amara Gunawardena — Attack Coach (no dedicated photo exists)
  "COH-T02": "https://api.dicebear.com/7.x/personas/svg?seed=AmaraGunawardena&backgroundColor=ffd5dc&radius=50&size=128",
  // Nethmi Silva — Defensive Coach (existing photo is wrong stock image)
  "COH-T03": "https://api.dicebear.com/7.x/personas/svg?seed=NethmiSilva&backgroundColor=c0aede&radius=50&size=128",
};

async function fixAvatars() {
  console.log("🔧 Fixing coach avatars in Firestore...\n");

  const coachesSnapshot = await db.collection("coaches").get();
  
  if (coachesSnapshot.empty) {
    console.log("No coaches found in Firestore.");
    process.exit(0);
  }

  let updated = 0;
  let skipped = 0;

  for (const doc of coachesSnapshot.docs) {
    const coachId = doc.id;
    const coachData = doc.data();
    const newAvatar = COACH_AVATARS[coachId];

    if (!newAvatar) {
      console.log(`  ⏭️  ${coachId} (${coachData.name}) — No avatar mapping defined, skipping`);
      skipped++;
      continue;
    }

    if (coachData.avatar === newAvatar) {
      console.log(`  ✅ ${coachId} (${coachData.name}) — Already correct`);
      skipped++;
      continue;
    }

    await db.collection("coaches").doc(coachId).update({ avatar: newAvatar });
    console.log(`  🔄 ${coachId} (${coachData.name})`);
    console.log(`     Old: ${coachData.avatar}`);
    console.log(`     New: ${newAvatar}`);
    updated++;
  }

  console.log(`\n✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

fixAvatars().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
