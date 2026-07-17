const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../firebase");

// Register
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const allUsersSnapshot = await db.collection("users").get();
    let maxId = 0;
    allUsersSnapshot.forEach(doc => {
      if (doc.id.startsWith("us")) {
        const num = parseInt(doc.id.replace("us", ""), 10);
        if (!isNaN(num) && num > maxId) {
          maxId = num;
        }
      }
    });
    const newIdString = `us${String(maxId + 1).padStart(2, "0")}`;
    const newUserRef = db.collection("users").doc(newIdString);
    await newUserRef.set({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      walletBalance: 0,
      createdAt: new Date().toISOString()
    });

    const payload = {
      user: {
        id: newUserRef.id,
        role: "user"
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: newUserRef.id, name, email, phone, role: "user", walletBalance: 0 } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: userDoc.id,
        role: user.role
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: userDoc.id, name: user.name, email: user.email, phone: user.phone, role: user.role, walletBalance: user.walletBalance || 0 } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin Login
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).where("role", "==", "admin").get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Invalid Admin Credentials" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Admin Credentials" });
    }

    const payload = {
      user: {
        id: userDoc.id,
        role: user.role
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: userDoc.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get current user details
router.get("/me", require("../middleware/auth"), async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userDoc.data();
    res.json({
      id: userDoc.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// User: Update own profile
router.put("/users/:id", require("../middleware/auth"), async (req, res) => {
  try {
    // Only allow users to update their own profile, or admins
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { name, phone } = req.body;
    
    // We update name and phone only. 
    await db.collection("users").doc(req.params.id).update({
      name,
      phone
    });
    
    res.json({ message: "Profile updated successfully", name, phone });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin: Update user role
router.put("/users/:id/role", require("../middleware/auth"), async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    const { role } = req.body;
    await db.collection("users").doc(req.params.id).update({ role });
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Admin: Update user wallet balance
router.put("/users/:id/wallet", require("../middleware/auth"), async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    const { amount, action } = req.body; // action: 'add' or 'deduct'
    const userRef = db.collection("users").doc(req.params.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
    
    let currentBalance = userDoc.data().walletBalance || 0;
    const value = parseFloat(amount);
    
    if (action === "add") currentBalance += value;
    else if (action === "deduct") currentBalance = Math.max(0, currentBalance - value);
    
    await userRef.update({ walletBalance: currentBalance });
    res.json({ message: "Wallet updated successfully", walletBalance: currentBalance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
