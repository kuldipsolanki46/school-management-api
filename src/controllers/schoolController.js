const db = require("../config/db");
const haversineDistance = require("../utils/haversine");

/**
 * POST /addSchool
 * Validates input (done by middleware) and inserts a new school into the DB.
 */
const addSchool = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  const sql =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)],
    (err, result) => {
      if (err) {
        console.error("DB insert error:", err.message);
        return next(new Error("Failed to add school to the database"));
      }

      res.status(201).json({
        success: true,
        message: "School added successfully",
        data: {
          schoolId: result.insertId,
          name: name.trim(),
          address: address.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });
    }
  );
};

/**
 * GET /listSchools
 * Fetches all schools and returns them sorted by distance (closest first)
 * from the user's provided latitude/longitude.
 */
const listSchools = (req, res, next) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  db.query("SELECT * FROM schools", (err, schools) => {
    if (err) {
      console.error("DB fetch error:", err.message);
      return next(new Error("Failed to fetch schools from the database"));
    }

    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          haversineDistance(
            userLat,
            userLon,
            school.latitude,
            school.longitude
          ).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  });
};

module.exports = { addSchool, listSchools };
