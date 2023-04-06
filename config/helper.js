const Web3 = require("web3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ABI = require("./abi");

dotenv.config();

const {
  TOKEN_SECRET,
  CONTRACT_ADDRESS,
  BLOCKCHAIN_URL,
  TOKEN_EXPIRATION_TIME,
} = process.env;
const web3 = new Web3(BLOCKCHAIN_URL);
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

exports.generateHash = async (password) => await bcrypt.hash(password, 2);

exports.generateBlockchainAccount = () => web3.eth.accounts.create();

exports.compareHashWithPassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

exports.generateResponse = ({ data = {}, errors = [], message = "" } = {}) => {
  return { message, data, errors };
};

exports.generateToken = ({ data = {}, time = TOKEN_EXPIRATION_TIME } = {}) => {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: time });
};

exports.getWalletBalanceFromBlockchain = async (walletAddress) => {
  return web3.utils.fromWei(
    await contract.methods.balanceOf(walletAddress).call()
  );
};
