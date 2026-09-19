require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const path = require("path");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/courts", require("./routes/courts"));
app.use("/api/packages", require("./routes/packages"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/availability", require("./routes/availability"));
app.use("/api/users", require("./routes/users"));
app.use("/api/coaches", require("./routes/coaches"));
app.use("/api/coach-availability", require("./routes/coachAvailability"));
app.use("/api/equipments", require("./routes/equipments"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/reports", require("./routes/reports"));

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
