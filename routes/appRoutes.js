const router = require("express").Router();

const {
  register,
  login,
  logout,
  getUserData,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/user", register);
router.get("/user", verifyToken, getUserData);

router.post("/login", login);
router.get("/logout", verifyToken, logout);

module.exports = router;
