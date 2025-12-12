const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  key: String,
  value: String,
  isFile: { type: Boolean, default: false }
});

const DocumentSchema = new mongoose.Schema({
  key: { type: String, required: true },
  file: { type: String, required: true }  // IMGBB URL
});

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },

  serviceName: String,
  serviceSlug: String,

  userId: String,
  user: {
    name: String,
    email: String,
    phone: String
  },

  fields: [FieldSchema],
  documents: [DocumentSchema],

  // ⭐ CA ASSIGNMENT INFO ⭐
  assignedCA: {
    type: String,   // CA _id
    default: null
  },

  assignedCAName: {
    type: String,
    default: null
  },

  assignedAt: {
    type: Date,
    default: null
  },

  // ⭐ CASE STATUS ⭐
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "assigned", "in-progress", "completed", "rejected"]
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Case", CaseSchema);
