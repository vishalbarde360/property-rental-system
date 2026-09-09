const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
   passwordHash: { type: String, required: false },
   googleId: {
  type: String,
  unique: true,
  sparse: true,
},

authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},
    role: {
      type: String,
      enum: ["tenant", "owner", "admin"],
      default: "tenant",
    },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    profileImage: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    savedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
