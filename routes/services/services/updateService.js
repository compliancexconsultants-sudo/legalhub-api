const Service = require("../../../models/Service");

module.exports = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        tagId: req.body.tagId,
        name: req.body.name,
        price: req.body.price,
        documents: req.body.documents,
        content: req.body.content
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
