const Application = require("../models/Application");
const Property = require("../models/Property");

exports.create = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (
      !property ||
      property.status !== "published" ||
      !property.availability
    ) {
      return res.status(404).json({ message: "Property is not available" });
    }

    const existing = await Application.findOne({
      propertyId: property._id,
      tenantId: req.user._id,
      status: { $ne: "rejected" },
    });
    if (existing)
      return res.status(409).json({ message: "Application already exists" });

    const application = await Application.create({
      propertyId: property._id,
      tenantId: req.user._id,
      ownerId: property.ownerId,
      message: req.body.message,
      documents: req.body.documents || [],
      status: "submitted",
      submittedAt: new Date(),
    });

    res.status(201).json(application);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Could not create application", error: error.message });
  }
};

exports.list = async (req, res) => {
  const filter =
    req.user.role === "tenant"
      ? { tenantId: req.user._id }
      : req.user.role === "owner"
        ? { ownerId: req.user._id }
        : {};

  const applications = await Application.find(filter)
    .populate("propertyId", "title city rent")
    .populate("tenantId", "name email phone")
    .populate("ownerId", "name email phone")
    .sort({ createdAt: -1 });

  res.json(applications);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!["under_review", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { status, reviewedAt: new Date() },
    { new: true, runValidators: true },
  );

  if (!application)
    return res.status(404).json({ message: "Application not found" });
  res.json(application);
};
exports.getOne = async (req, res) => {
  const a = await Application.findById(req.params.id)
    .populate("propertyId")
    .populate("tenantId", "name email phone")
    .populate("ownerId", "name email phone");
  if (!a) return res.status(404).json({ message: "Application not found" });
  const allowed =
    req.user.role === "admin" ||
    String(a.tenantId?._id || a.tenantId) === String(req.user._id) ||
    String(a.ownerId?._id || a.ownerId) === String(req.user._id);
  if (!allowed) return res.status(403).json({ message: "Access denied" });
  res.json(a);
};
