const Review = require("../models/Review");
const Application = require("../models/Application");
const Property = require("../models/Property");
exports.create = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    const eligible = await Application.findOne({
      propertyId,
      tenantId: req.user._id,
      status: "approved",
    });
    if (!eligible)
      return res
        .status(403)
        .json({ message: "You are not eligible to review this property" });
    const r = await Review.create({
      propertyId,
      reviewerId: req.user._id,
      revieweeId: property.ownerId,
      rating,
      comment,
    });
    res.status(201).json(r);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Could not create review", error: e.message });
  }
};
exports.list = async (req, res) =>
  res.json(
    await Review.find({ propertyId: req.params.propertyId })
      .populate("reviewerId", "name profileImage")
      .populate("revieweeId", "name")
      .sort({ createdAt: -1 }),
  );
exports.remove = async (req, res) => {
  const r = await Review.findById(req.params.id);
  if (!r) return res.status(404).json({ message: "Review not found" });
  if (
    req.user.role !== "admin" &&
    String(r.reviewerId) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Access denied" });
  await r.deleteOne();
  res.json({ message: "Review deleted" });
};
