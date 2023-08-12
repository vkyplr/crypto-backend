const Tx = require("ethereumjs-tx").Transaction;

const User = require("../models/user");

const {
  getAccountFromPrivateKey,
  getNonce,
  getGasPrice,
  toHex,
  contractAddress,
  getTxData,
  sendSignedTransaction,
  signTransaction,
} = require("../config/helper");

exports.sendMoney = async (req, res) => {
  /*
    #swagger.tags = ["Transaction"],
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        description: 'Send Money to Address',
        schema:  { $ref: "#/definitions/Transaction" }
    }
*/

  try {
    const { amount, address } = req.body;

    const fromUser = req.user;
    const toUser = await User.findOne({ walletAddress: address });

    if (!fromUser || !toUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const gasPrice = await getGasPrice();

    const transaction = {
      from: fromUser.address,
      to: contractAddress,
      gasPrice: toHex(gasPrice),
      gasLimit: toHex(21572),
      data: getTxData(toUser.walletAddress, amount),
    };
    const signedTx = await signTransaction(
      transaction,
      fromUser.walletPrivateKey
    );
    console.log("REACHED HERE ------", transaction);

    const result = await sendSignedTransaction(signedTx.rawTransaction);

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

exports.requestMoney = async (req, res) => {
  /*
    #swagger.tags = ["Transaction"],
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        description: 'Request Money from Address',
        schema:  { $ref: "#/definitions/Transaction" }
    }
*/
};
