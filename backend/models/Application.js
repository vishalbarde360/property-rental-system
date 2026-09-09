const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: String,
    documents: [String],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft"
    },
    submittedAt: Date,
    reviewedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);