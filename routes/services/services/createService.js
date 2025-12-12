const Service = require("../../../models/Service");

module.exports = async (req, res) => {
  try {
    const { tagId, name, price, documents, content } = req.body;

    const service = await Service.create({
      tagId,
      name,
      price,
      documents,
      content
    });

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
