// routes/services/services/getService.js
const mongoose = require("mongoose");
const Service = require("../../../models/Service");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId early
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    // Find and populate tag name
    const service = await Service.findById(id).populate("tagId", "name");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Return the service
    return res.json(service);
  } catch (err) {
    console.error("GET SERVICE ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
