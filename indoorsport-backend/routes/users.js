const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// Get all users (Admin only)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        walletBalance: data.walletBalance || 0,
        createdAt: data.createdAt
      });
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a user (Admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const userDoc = await db.collection("users").doc(req.params.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userDoc.data().role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }
    await db.collection("users").doc(req.params.id).delete();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
