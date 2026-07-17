const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// Get all coaches
router.get("/", async (req, res) => {
  try {
    const coachesSnapshot = await db.collection("coaches").get();
    const coaches = [];
    coachesSnapshot.forEach(doc => {
      coaches.push({ id: doc.id, ...doc.data() });
    });
    res.json(coaches);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a coach (Admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  
  try {
    const { name, sport, role, desc, avatar, price } = req.body;

    let prefix = "COH-O";
    const sportLower = (sport || "").toLowerCase();
    if (sportLower.includes("badminton")) {
      prefix = "COH-B";
    } else if (sportLower.includes("cricket")) {
      prefix = "COH-C";
    } else if (sportLower.includes("table tennis") || sportLower.includes("table tennies")) {
      prefix = "COH-T";
    }

    const allCoachesSnapshot = await db.collection("coaches").get();
    let maxId = 0;
    allCoachesSnapshot.forEach(doc => {
      if (doc.id.startsWith(prefix)) {
        const num = parseInt(doc.id.replace(prefix, ""), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });
    const newIdString = `${prefix}${String(maxId + 1).padStart(2, "0")}`;
    const newCoachRef = db.collection("coaches").doc(newIdString);
    await newCoachRef.set({ name, sport, role, desc, avatar, price: Number(price) || 500 });
    res.json({ id: newCoachRef.id, name, sport, role, desc, avatar, price: Number(price) || 500 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit a coach (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const { name, sport, role, desc, avatar, price } = req.body;
    await db.collection("coaches").doc(req.params.id).update({ name, sport, role, desc, avatar, price: Number(price) || 500 });
    res.json({ id: req.params.id, name, sport, role, desc, avatar, price: Number(price) || 500 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a coach (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    await db.collection("coaches").doc(req.params.id).delete();
    res.json({ message: "Coach deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
