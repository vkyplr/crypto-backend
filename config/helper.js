const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN_SECRET } = process.env;

exports.generateHash = async (password) => await bcrypt.hash(password, 2);

exports.compareHashWithPassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

exports.generateResponse = ({ data = {}, errors = [], message = "" } = {}) => {
  return { message, data, errors };
};

exports.generateToken = ({ data = {}, time = 86400 } = {}) => {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: time });
};
