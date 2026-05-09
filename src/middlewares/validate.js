const { body, query, validationResult } = require("express-validator");

/**
 * Validation rules for POST /addSchool
 */
const addSchoolRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("School name is required")
    .isString()
    .withMessage("School name must be a string"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];

/**
 * Validation rules for GET /listSchools
 */
const listSchoolsRules = [
  query("latitude")
    .notEmpty()
    .withMessage("Query param 'latitude' is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  query("longitude")
    .notEmpty()
    .withMessage("Query param 'longitude' is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];

/**
 * Middleware to check validation results and return errors if any
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { addSchoolRules, listSchoolsRules, handleValidationErrors };
