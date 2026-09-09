const Payment = require("../models/Payment");
const Application = require("../models/Application");
exports.create = async (req, res) => {
  try {
    const {
      applicationId,
      amount,
      type,
      method,
      receiverId,
      transactionReference,
      status = "pending",
    } = req.body;
    if (!amount || !type || !receiverId)
      return res
        .status(400)
        .json({ message: "amount, type and receiverId are required" });
    if (applicationId) {
      const a = await Application.findById(applicationId);
      if (!a) return res.status(404).json({ message: "Application not found" });
      if (
        req.user.role === "tenant" &&
        String(a.tenantId) !== String(req.user._id)
      )
        return res.status(403).json({ message: "Access denied" });
    }
    const p = await Payment.create({
      applicationId,
      payerId: req.user._id,
      receiverId,
      amount,
      type,
      method,
      transactionReference,
      status,
      paidAt: status === "success" ? new Date() : undefined,
    });
    res.status(201).json(p);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Could not create payment", error: e.message });
  }
};
exports.list = async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : { $or: [{ payerId: req.user._id }, { receiverId: req.user._id }] };
  res.json(
    await Payment.find(filter)
      .populate("payerId", "name email")
      .populate("receiverId", "name email")
      .populate("applicationId")
      .sort({ createdAt: -1 }),
  );
};
exports.update = async (req, res) => {
  try {
    const p = await Payment.findById(req.params.id);

    if (!p) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const isAdmin =
      req.user.role === "admin";

    const isReceiver =
      String(p.receiverId) ===
      String(req.user._id);

    const isPayer =
      String(p.payerId) ===
      String(req.user._id);

    // Anyone involved can update, but
    // only owner/receiver or admin can
    // confirm payment as success.
    if (!isAdmin && !isReceiver && !isPayer) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const allowed = [
      "pending",
      "success",
      "failed",
    ];

    if (
      req.body.status &&
      !allowed.includes(req.body.status)
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Tenant/payer cannot mark payment as success.
    if (
      req.body.status === "success" &&
      !isAdmin &&
      !isReceiver
    ) {
      return res.status(403).json({
        message:
          "Only the owner can confirm this payment",
      });
    }

    p.status =
      req.body.status || p.status;

    if (req.body.transactionReference) {
      p.transactionReference =
        req.body.transactionReference;
    }

    if (
      p.status === "success" &&
      !p.paidAt
    ) {
      p.paidAt = new Date();
    }

    await p.save();

    const result =
      await Payment.findById(p._id)
        .populate("payerId", "name email")
        .populate("receiverId", "name email")
        .populate("applicationId");

    res.json(result);
  } catch (e) {
    res.status(400).json({
      message: "Could not update payment",
      error: e.message,
    });
  }
};

// =========================
// OWNER - TOTAL EARNINGS
// =========================
// Aggregates every payment received by the logged-in owner
// (receiverId === owner) and returns a total, a pending amount,
// and a per-property breakdown of confirmed ("success") earnings.
exports.ownerEarnings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const [totals, byProperty] = await Promise.all([
      Payment.aggregate([
        { $match: { receiverId: ownerId } },
        {
          $group: {
            _id: "$status",
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        { $match: { receiverId: ownerId, status: "success" } },
        {
          $lookup: {
            from: "applications",
            localField: "applicationId",
            foreignField: "_id",
            as: "application",
          },
        },
        { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$application.propertyId",
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "properties",
            localField: "_id",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: { path: "$property", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            propertyId: "$_id",
            title: "$property.title",
            city: "$property.city",
            amount: 1,
            count: 1,
          },
        },
        { $sort: { amount: -1 } },
      ]),
    ]);

    const totalEarnings =
      totals.find((t) => t._id === "success")?.amount || 0;
    const pendingAmount =
      totals.find((t) => t._id === "pending")?.amount || 0;
    const successCount =
      totals.find((t) => t._id === "success")?.count || 0;
    const pendingCount =
      totals.find((t) => t._id === "pending")?.count || 0;

    res.json({
      totalEarnings,
      pendingAmount,
      successCount,
      pendingCount,
      byProperty,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Could not load earnings", error: e.message });
  }
};

exports.getOne = async (req, res) => {
  const p = await Payment.findById(req.params.id)
    .populate("payerId", "name email")
    .populate("receiverId", "name email")
    .populate("applicationId");
  if (!p) return res.status(404).json({ message: "Payment not found" });
  if (
    req.user.role !== "admin" &&
    String(p.payerId?._id || p.payerId) !== String(req.user._id) &&
    String(p.receiverId?._id || p.receiverId) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Access denied" });
  res.json(p);
};
