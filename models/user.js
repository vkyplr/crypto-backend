const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  password: String,
  walletAddress: String,
  walletPrivateKey: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", userSchema);
