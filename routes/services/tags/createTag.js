const Tag = require("../../../models/Tag");

module.exports = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Tag.findOne({ name });
    if (exists) return res.status(400).json({ message: "Tag already exists" });

    const tag = await Tag.create({ name });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
