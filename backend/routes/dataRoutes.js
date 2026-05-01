const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  uploadCSV,
  getValidData,
  getStats,
  getAverageSalary,
  getGroupedStats,
  deleteUserData,
  exportCSV
} = require("../controllers/dataController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// All data routes are protected by auth middleware
router.use(auth);

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/data", getValidData);
router.get("/export", exportCSV);
router.get("/valid", getValidData);
router.get("/stats", getStats);
router.get("/avg-salary", getAverageSalary);
router.get("/city-stats", getGroupedStats); // Maintained city-stats for backward compatibility
router.get("/grouped-stats", getGroupedStats);
router.delete("/data", deleteUserData);

module.exports = router;
