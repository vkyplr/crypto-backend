const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/user");

dotenv.config();

const { TOKEN_SECRET } = process.env;

exports.verifyToken = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] == "Bearer"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      TOKEN_SECRET,
      (err, data) => {
        if (err) return res.sendStatus(401);
        else {
          User.findOne({ _id: data.id })
            .select(
              "first_name last_name email phone walletAddress walletPrivateKey created"
            )
            .then((user) => {
              req.user = user;
              next();
            })
            .catch((err) => res.status(500).send(err));
        }
      }
    );
  } else {
    return res.sendStatus(401);
  }
};
