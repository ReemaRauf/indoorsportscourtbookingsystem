const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// Get all courts
router.get("/", async (req, res) => {
  try {
    const courtsSnapshot = await db.collection("courts").get();
    const courts = [];
    courtsSnapshot.forEach(doc => {
      courts.push({ id: doc.id, ...doc.data() });
    });
    res.json(courts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a court (Admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  
  try {
    const { name, sport, image } = req.body;

    let prefix = "CRT-O";
    const sportLower = (sport || "").toLowerCase();
    if (sportLower.includes("badminton")) {
      prefix = "CRT-B";
    } else if (sportLower.includes("cricket")) {
      prefix = "CRT-C";
    } else if (sportLower.includes("table tennis") || sportLower.includes("table tennies")) {
      prefix = "CRT-T";
    }

    const allCourtsSnapshot = await db.collection("courts").get();
    let maxId = 0;
    allCourtsSnapshot.forEach(doc => {
      if (doc.id.startsWith(prefix)) {
        const num = parseInt(doc.id.replace(prefix, ""), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });
    const newIdString = `${prefix}${String(maxId + 1).padStart(2, "0")}`;
    const newCourtRef = db.collection("courts").doc(newIdString);
    await newCourtRef.set({ name, sport, image });
    res.json({ id: newCourtRef.id, name, sport, image });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit a court (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const { name, sport, image } = req.body;
    await db.collection("courts").doc(req.params.id).update({ name, sport, image });
    res.json({ id: req.params.id, name, sport, image });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a court (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    await db.collection("courts").doc(req.params.id).delete();
    res.json({ message: "Court deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
