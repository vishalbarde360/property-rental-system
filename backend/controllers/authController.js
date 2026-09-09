const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
exports.googleCallback = async (req, res) => {
  try {
    const token = makeToken(req.user._id);

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(
      `${frontendUrl}/google-success?token=${encodeURIComponent(
        token
      )}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  } catch (e) {
    res.status(500).json({
      message: "Google authentication failed",
      error: e.message,
    });
  }
};
const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone || !role)
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const safeRole = ["tenant", "owner"].includes(role) ? role : "tenant";
    const u = await User.create({
      name,
      email,
      phone,
      role: safeRole,
      password:passwordHash,
    });
    res
      .status(201)
      .json({
        message: "Registration successful",
        token: makeToken(u._id),
        user: { id: u._id, name: u.name, email: u.email, role: u.role },
      });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !(await bcrypt.compare(password, u.passwordHash)))
      return res.status(401).json({ message: "Invalid email or password" });
    if (u.status === "disabled")
      return res.status(403).json({ message: "Account disabled" });
    res.json({
      message: "Login successful",
      token: makeToken(u._id),
      user: { id: u._id, name: u.name, email: u.email, role: u.role },
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
exports.me = async (req, res) => res.json({ user: req.user });
exports.forgotPassword = async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (!u)
    return res.json({
      message: "If the email exists, a reset token has been generated",
    });
  const token = crypto.randomBytes(24).toString("hex");
  u.resetPasswordToken = token;
  u.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await u.save();
  res.json({ message: "Reset token generated", resetToken: token });
};
exports.resetPassword = async (req, res) => {
  const u = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!u)
    return res.status(400).json({ message: "Invalid or expired reset token" });
  u.passwordHash = await bcrypt.hash(req.body.password, 10);
  u.resetPasswordToken = undefined;
  u.resetPasswordExpires = undefined;
  await u.save();
  res.json({ message: "Password reset successful" });
};
