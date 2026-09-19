const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

// Ensure uploads directory exists
// On Vercel, /var/task is read-only so we use /tmp instead
const uploadDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload an image
// @access  Admin only (using auth middleware)
router.post("/", auth, upload.single("image"), (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct the URL to access the uploaded file
  // Assumes the server will serve the 'uploads' directory statically at '/uploads'
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

module.exports = router;
