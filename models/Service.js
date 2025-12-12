// models/Service.js
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    key: String,
    label: String
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema({
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },   // price required
  documents: [DocumentSchema],
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", ServiceSchema);
