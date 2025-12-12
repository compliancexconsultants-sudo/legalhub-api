// utils/caHelpers.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// generate a readable random password
function generatePassword(length = 10) {
  // create strong password: mix of letters/numbers/symbols
  return crypto.randomBytes(Math.ceil(length * 0.6)).toString("base64").slice(0, length)
    .replace(/\+/g, "A").replace(/\//g, "9");
}

// hash password
async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

// compare
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { generatePassword, hashPassword, comparePassword };
