const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * SYNC USER USING FIREBASE DATA
 * Called after frontend Firebase login
 */
router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "firebaseUid and email are required" });
    }

    let user = await User.findOne({ firebaseUid });

    if (user) {
      // update user
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      // new user
      user = await User.create({
        firebaseUid,
        name,
        email,
        phone,
        photoURL
      });
    }

    res.json({ message: "User synced successfully", user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
