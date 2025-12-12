const Service = require("../../../models/Service");

module.exports = async (req, res) => {
  const services = await Service.find().populate("tagId", "name");
  res.json(services);
};
