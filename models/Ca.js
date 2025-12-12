// models/Ca.js
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  name: String,      // e.g. "PAN"
  url: String        // imgbb or file URL
});

const CaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: "" },
  photoURL: { type: String, default: "" },

  experienceYears: { type: Number, default: 0 },
  specialization: { type: String, default: "" }, // e.g. "ITR, GST, Company Registration"

  documents: [DocumentSchema], // uploaded KYC docs (PAN, Aadhaar links etc.)

  password: { type: String, required: true }, // hashed
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },

  // optional: list of assigned case ObjectIds
  assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CaSchema.pre("save", async function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model("Ca", CaSchema);
