const Web3 = require("web3");

const User = require("../models/user");
const { userValidator, loginValidator } = require("../config/validators");
const {
  generateHash,
  generateResponse,
  compareHashWithPassword,
  generateToken,
} = require("../config/helper");

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

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

    const account = web3.eth.accounts.create();
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
        schema:  { $email: "vikas@gmail.com", $password: "Strong@Password1" }
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

exports.getUserData = (req, res) => {
  /*
    #swagger.tags = ["User"],
*/
  return res.send(generateResponse({ data: req.user }));
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
