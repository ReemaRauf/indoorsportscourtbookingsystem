const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// Get all equipments
router.get("/", async (req, res) => {
  try {
    const equipmentsSnapshot = await db.collection("equipments").get();
    const equipments = [];
    equipmentsSnapshot.forEach(doc => {
      equipments.push({ id: doc.id, ...doc.data() });
    });
    res.json(equipments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add an equipment (Admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  
  try {
    const { name, sport, price, unit, icon, image, desc } = req.body;

    let prefix = "EQP-O";
    const sportLower = (sport || "").toLowerCase();
    if (sportLower.includes("badminton")) {
      prefix = "EQP-B";
    } else if (sportLower.includes("cricket")) {
      prefix = "EQP-C";
    } else if (sportLower.includes("table tennis") || sportLower.includes("table tennies")) {
      prefix = "EQP-T";
    }

    const allEqSnapshot = await db.collection("equipments").get();
    let maxId = 0;
    allEqSnapshot.forEach(doc => {
      if (doc.id.startsWith(prefix)) {
        const num = parseInt(doc.id.replace(prefix, ""), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });
    const newIdString = `${prefix}${String(maxId + 1).padStart(2, "0")}`;
    const newEqRef = db.collection("equipments").doc(newIdString);
    const data = { name, sport, price: Number(price) || 0, unit, icon: icon || "🏅", image: image || "", desc: desc || "" };
    await newEqRef.set(data);
    res.json({ id: newEqRef.id, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit an equipment (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const { name, sport, price, unit, icon, image, desc } = req.body;
    const data = { name, sport, price: Number(price) || 0, unit, icon: icon || "🏅", image: image || "", desc: desc || "" };
    await db.collection("equipments").doc(req.params.id).update(data);
    res.json({ id: req.params.id, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete an equipment (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    await db.collection("equipments").doc(req.params.id).delete();
    res.json({ message: "Equipment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
