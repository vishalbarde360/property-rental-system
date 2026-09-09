const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["rent", "deposit"], required: true },
    method: { type: String, enum: ["cash", "upi", "card", "bank_transfer"], default: "upi" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    transactionReference: String,
    paidAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);