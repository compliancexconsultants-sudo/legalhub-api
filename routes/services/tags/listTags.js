const Tag = require("../../../models/Tag");

module.exports = async (req, res) => {
  const tags = await Tag.find().sort({ createdAt: -1 });
  res.json(tags);
};
