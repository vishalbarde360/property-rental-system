const Report = require("../models/Report");
exports.create = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!targetType || !targetId || !reason)
      return res
        .status(400)
        .json({ message: "targetType, targetId and reason are required" });
    res
      .status(201)
      .json(
        await Report.create({
          reporterId: req.user._id,
          targetType,
          targetId,
          reason,
        }),
      );
  } catch (e) {
    res
      .status(400)
      .json({ message: "Could not create report", error: e.message });
  }
};
exports.list = async (req, res) =>
  res.json(
    await Report.find(
      req.user.role === "admin" ? {} : { reporterId: req.user._id },
    )
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 }),
  );
exports.update = async (req, res) => {
  const r = await Report.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, resolution: req.body.resolution },
    { new: true, runValidators: true },
  );
  if (!r) return res.status(404).json({ message: "Report not found" });
  res.json(r);
};
