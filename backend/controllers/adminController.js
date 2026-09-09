const User = require("../models/User");
const Property = require("../models/Property");
const Application = require("../models/Application");
const Report = require("../models/Report");
const Payment = require("../models/Payment");
exports.users = async (req, res) =>
  res.json(await User.find().select("-passwordHash").sort({ createdAt: -1 }));
exports.updateUser = async (req, res) => {
  const u = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, role: req.body.role },
    { new: true, runValidators: true },
  ).select("-passwordHash");
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
};
exports.properties = async (req, res) =>
  res.json(
    await Property.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 }),
  );
exports.updateProperty = async (req, res) => {
  const p = await Property.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, availability: req.body.availability },
    { new: true, runValidators: true },
  );
  if (!p) return res.status(404).json({ message: "Property not found" });
  res.json(p);
};
exports.reports = async (req, res) =>
  res.json(
    await Report.find()
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 }),
  );
exports.analytics = async (req, res) => {
  const [users, properties, applications, payments, reports] =
    await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Application.countDocuments(),
      Payment.countDocuments(),
      Report.countDocuments({ status: "open" }),
    ]);
  res.json({ users, properties, applications, payments, openReports: reports });
};
