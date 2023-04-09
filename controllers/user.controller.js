const User = require("../models/user");
const {
  userValidator,
  loginValidator,
  updateUserValidator,
} = require("../config/validators");
const {
  generateHash,
  generateResponse,
  compareHashWithPassword,
  generateToken,
  generateBlockchainAccount,
  getWalletBalanceFromBlockchain,
} = require("../config/helper");

exports.register = async (req, res) => {
  /*
    #swagger.tags = ["User"],
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        description: 'Register User',
        schema:  { $ref: "#/definitions/User" }
    }
*/
  try {
    userValidator.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser != null) {
      return res.status(409).json(
        generateResponse({
          errors: ["User with given email already exists"],
        })
      );
    }

    const account = generateBlockchainAccount();
    const { address, privateKey } = account;

    let userData = { ...req.body };

    userData["password"] = await generateHash(userData["password"]);

    const user = new User({
      ...userData,
      walletAddress: address,
      walletPrivateKey: privateKey,
    });

    let savedUser = await user.save();
    let newUser = { ...savedUser._doc };

    delete newUser.password;
    delete newUser.walletPrivateKey;

    return res.json(
      generateResponse({
        data: newUser,
        message: "Account Created Successfully",
        errors: [],
      })
    );
  } catch (e) {
    return res
      .status(400)
      .json(generateResponse({ message: "Error", errors: e.errors }));
  }
};

exports.login = async (req, res) => {
  /*
    #swagger.tags = ["Authentication"],
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        description: 'User Login Credentials',
        schema:  { $email: "vkyplr@gmail.com", $password: "Password@1" }
    }
*/
  try {
    loginValidator.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    let user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res
        .status(400)
        .json(generateResponse({ errors: ["Invalid Email or Password"] }));
    }

    if (await compareHashWithPassword(req.body.password, user.password)) {
      const token = generateToken({ data: { id: user._id } });
      let newUser = { ...user._doc };
      delete newUser.password;
      delete newUser.walletPrivateKey;
      return res.json(
        generateResponse({
          message: "Login Successful",
          data: { token, user: newUser },
        })
      );
    } else {
      return res
        .status(400)
        .json(generateResponse({ errors: ["Invalid Email or Password"] }));
    }
  } catch (e) {
    return res
      .status(400)
      .json(generateResponse({ message: "Error", errors: e.errors }));
  }
};

exports.updateUser = async (req, res) => {
/*
    #swagger.tags = ["User"],
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        description: 'Update User Data',
        schema:  { $ref: "#/definitions/Update User" }
    }
*/
  try {
    updateUserValidator.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
        },
      },
      {
        fields: {
          first_name: 1,
          last_name: 1,
          email: 1,
          phone: 1,
          walletAddress: 1,
        },
        new: true,
      }
    );
    return res.json(generateResponse({ data: updatedUser }));
  } catch (e) {
    return res
      .status(400)
      .json(generateResponse({ message: "Error", errors: e.errors }));
  }
};

exports.getUserData = async (req, res) => {
  /*
    #swagger.tags = ["User"],
*/

  const balance = await getWalletBalanceFromBlockchain(req.user.walletAddress);
  return res.send(
    generateResponse({ data: { ...req.user._doc, walletBalance: balance } })
  );
};

exports.logout = (req, res) => {
  /*
    #swagger.tags = ["Authentication"],
*/
  const token = generateToken({ time: 1 });
  return res.json(
    generateResponse({
      message: "Logout Successful",
      data: { token },
    })
  );
};
