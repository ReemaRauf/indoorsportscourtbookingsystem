const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { db } = require("../firebase");

// GET /api/reports/monthly
// Returns booking and revenue statistics grouped by Year and Month
router.get("/monthly", auth, async (req, res) => {
  try {
    // Only admins can view reports
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const bookingsSnapshot = await db.collection("bookings").get();
    
    // Structure to hold our aggregated data:
    // {
    //   "2024": {
    //     "07": { totalRevenue: 1000, totalBookings: 10, cancelledBookings: 1, walletUsage: 200 },
    //     ...
    //   }
    // }
    const reportData = {};

    bookingsSnapshot.forEach((doc) => {
      const data = doc.data();
      const dateStr = data.date; // assuming format YYYY-MM-DD
      
      if (!dateStr || typeof dateStr !== 'string') return;
      
      const parts = dateStr.split("-");
      if (parts.length < 2) return;

      const year = parts[0];
      const month = parts[1];
      
      if (!reportData[year]) {
        reportData[year] = {};
      }
      if (!reportData[year][month]) {
        reportData[year][month] = {
          totalRevenue: 0,
          totalBookings: 0,
          cancelledBookings: 0,
          walletUsage: 0,
          advancePaid: 0
        };
      }

      const stats = reportData[year][month];
      stats.totalBookings += 1;

      if (data.status === "Cancelled" || data.status === "Rejected") {
        stats.cancelledBookings += 1;
      } else {
        // Only count revenue for Confirmed/Completed/Pending bookings
        stats.totalRevenue += Number(data.price) || 0;
        stats.advancePaid += Number(data.advancePaid) || 0;
        
        if (data.useWallet && data.walletAmountUsed) {
          stats.walletUsage += Number(data.walletAmountUsed) || 0;
        }
      }
    });

    // Format the response into an array for easier frontend rendering
    const formattedResult = [];
    
    Object.keys(reportData).sort((a, b) => b.localeCompare(a)).forEach(year => {
      Object.keys(reportData[year]).sort((a, b) => b.localeCompare(a)).forEach(month => {
        formattedResult.push({
          year,
          month,
          ...reportData[year][month]
        });
      });
    });

    res.json(formattedResult);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error generating report." });
  }
});

// GET /api/reports/detailed
// Returns booking and revenue statistics grouped by Sport for a specific Year and (optional) Month
router.get("/detailed", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { year, month } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Year query parameter is required." });
    }

    // 1. Fetch courts to build a map of Court Name -> Sport
    const courtsSnapshot = await db.collection("courts").get();
    const courtToSportMap = {};
    courtsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.name) {
        courtToSportMap[data.name] = data.sport || "Other";
      }
    });

    // 2. Fetch all bookings
    const bookingsSnapshot = await db.collection("bookings").get();
    
    // Aggregation Structure: { "Badminton": { totalRevenue: ..., totalBookings: ... }, "Cricket": {...} }
    const reportData = {};

    bookingsSnapshot.forEach((doc) => {
      const data = doc.data();
      const dateStr = data.date; // format YYYY-MM-DD
      
      if (!dateStr || typeof dateStr !== 'string') return;
      
      const parts = dateStr.split("-");
      if (parts.length < 2) return;

      const bYear = parts[0];
      const bMonth = parts[1];
      
      // Filter by requested year
      if (bYear !== year) return;
      
      // Filter by requested month if provided (and not 'all')
      if (month && month !== 'all' && bMonth !== month) return;

      // Map court to sport
      let sport = courtToSportMap[data.court];
      if (!sport) {
        // Fallback string matching if court not found in mapping
        const cLower = (data.court || "").toLowerCase();
        if (cLower.includes("badminton")) sport = "Badminton";
        else if (cLower.includes("cricket")) sport = "Cricket";
        else if (cLower.includes("futsal")) sport = "Futsal";
        else if (cLower.includes("table tennis")) sport = "Table Tennis";
        else sport = "Other";
      }

      if (!reportData[sport]) {
        reportData[sport] = {
          sport: sport,
          totalRevenue: 0,
          totalBookings: 0,
          cancelledBookings: 0,
          walletUsage: 0,
          advancePaid: 0
        };
      }

      const stats = reportData[sport];
      stats.totalBookings += 1;

      if (data.status === "Cancelled" || data.status === "Rejected") {
        stats.cancelledBookings += 1;
      } else {
        stats.totalRevenue += Number(data.price) || 0;
        stats.advancePaid += Number(data.advancePaid) || 0;
        
        if (data.useWallet && data.walletAmountUsed) {
          stats.walletUsage += Number(data.walletAmountUsed) || 0;
        }
      }
    });

    const formattedResult = Object.values(reportData).sort((a, b) => a.sport.localeCompare(b.sport));
    res.json(formattedResult);

  } catch (error) {
    console.error("Error generating detailed report:", error);
    res.status(500).json({ message: "Server error generating detailed report." });
  }
});

module.exports = router;
