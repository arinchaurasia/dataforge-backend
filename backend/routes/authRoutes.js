const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", require("../controllers/authController").verifyOTP);
router.post("/resend-otp", require("../controllers/authController").resendOTP);

module.exports = router;
