const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Haversine formula — calculates distance in km
// between two lat/lon points on Earth
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// POST /addSchool
app.post("/addSchool", (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Basic validation
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: "All fields are required: name, address, latitude, longitude" });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({ success: false, message: "latitude must be a number between -90 and 90" });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ success: false, message: "longitude must be a number between -180 and 180" });
  }

  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, address, lat, lon], (err, result) => {
    if (err) {
      console.error("DB error:", err.message);
      return res.status(500).json({ success: false, message: "Failed to add school" });
    }

    res.status(201).json({
      success: true,
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
});

// GET /listSchools?latitude=xx&longitude=yy
app.get("/listSchools", (req, res) => {
  const lat = parseFloat(req.query.latitude);
  const lon = parseFloat(req.query.longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ success: false, message: "latitude and longitude are required as query params" });
  }

  db.query("SELECT * FROM schools", (err, schools) => {
    if (err) {
      console.error("DB error:", err.message);
      return res.status(500).json({ success: false, message: "Failed to fetch schools" });
    }

    // Attach distance to each school, then sort by closest
    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(getDistance(lat, lon, school.latitude, school.longitude).toFixed(2)),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
