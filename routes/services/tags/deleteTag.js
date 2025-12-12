const Tag = require("../../../models/Tag");
const Service = require("../../../models/Service");

module.exports = async (req, res) => {
  try {
    const tagId = req.params.id;

    await Tag.findByIdAndDelete(tagId);
    await Service.deleteMany({ tagId });

    res.json({ message: "Tag and related services deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
