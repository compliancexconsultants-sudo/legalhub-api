const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgBB(fileBuffer) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new FormData();
      form.append("image", fileBuffer.toString("base64"));

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        form,
        { headers: form.getHeaders() }
      );

      resolve(res.data.data.display_url);
    } catch (err) {
      console.log("IMGBB ERROR:", err?.response?.data);
      reject("Upload failed");
    }
  });
}

module.exports = uploadToImgBB;
