const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ["apartment", "house", "room", "studio", "villa"], required: true },
    address: String,
    city: { type: String, required: true, index: true },
    rent: { type: Number, required: true, min: 0, index: true },
    deposit: { type: Number, default: 0, min: 0 },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    amenities: [String],
    images: [String],
    availability: { type: Boolean, default: true, index: true },
    status: { type: String, enum: ["draft", "published", "paused"], default: "draft", index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);