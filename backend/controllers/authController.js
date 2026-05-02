const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || "secret";

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, otp, otpExpires });
    
    await sendEmail({
      email: user.email,
      subject: 'Verify Your DataForge Account',
      message: `Your verification code is ${otp}. It expires in 10 minutes.`
    });

    res.status(201).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or error occurred' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify your email before logging in." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified. You can now login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
