const express = require("express");
const router = express.Router();

const { addSchool, listSchools } = require("../controllers/schoolController");
const {
  addSchoolRules,
  listSchoolsRules,
  handleValidationErrors,
} = require("../middlewares/validate");

/**
 * @route   POST /addSchool
 * @desc    Add a new school to the database
 * @access  Public
 */
router.post("/addSchool", addSchoolRules, handleValidationErrors, addSchool);

/**
 * @route   GET /listSchools
 * @desc    Get all schools sorted by proximity to given coordinates
 * @access  Public
 */
router.get(
  "/listSchools",
  listSchoolsRules,
  handleValidationErrors,
  listSchools
);

module.exports = router;
