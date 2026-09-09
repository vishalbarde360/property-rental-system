const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["user", "property", "application", "review"],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "resolved", "rejected"],
      default: "open",
    },
    resolution: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("Report", reportSchema);
