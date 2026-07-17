const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// Get all packages
router.get("/", async (req, res) => {
  try {
    const pkgsSnapshot = await db.collection("packages").get();
    const pkgs = [];
    pkgsSnapshot.forEach(doc => {
      pkgs.push({ id: doc.id, ...doc.data() });
    });
    res.json(pkgs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a package (Admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  
  try {
    const { name, duration, price, label, courtName } = req.body;
    
    let prefix = "PKG-O";
    const courtLower = (courtName || "").toLowerCase();
    if (courtLower.includes("badminton")) {
      prefix = "PKG-B";
    } else if (courtLower.includes("cricket")) {
      prefix = "PKG-C";
    } else if (courtLower.includes("table tennis") || courtLower.includes("table tennies")) {
      prefix = "PKG-T";
    }

    const allPkgsSnapshot = await db.collection("packages").get();
    let maxId = 0;
    allPkgsSnapshot.forEach(doc => {
      if (doc.id.startsWith(prefix)) {
        const num = parseInt(doc.id.replace(prefix, ""), 10);
        if (!isNaN(num) && num > maxId) {
          maxId = num;
        }
      }
    });
    const newIdString = `${prefix}${String(maxId + 1).padStart(2, "0")}`;
    const newPkgRef = db.collection("packages").doc(newIdString);
    
    await newPkgRef.set({ name, duration: Number(duration), price: Number(price), label, courtName: courtName || "" });
    res.json({ id: newPkgRef.id, name, duration: Number(duration), price: Number(price), label, courtName: courtName || "" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit a package (Admin only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const { name, duration, price, label, courtName } = req.body;
    await db.collection("packages").doc(req.params.id).update({ name, duration: Number(duration), price: Number(price), label, courtName: courtName || "" });
    res.json({ id: req.params.id, name, duration: Number(duration), price: Number(price), label, courtName: courtName || "" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a package (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    await db.collection("packages").doc(req.params.id).delete();
    res.json({ message: "Package deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
