const router = require("express").Router();

const {
  sendMoney,
  requestMoney,
} = require("../controllers/transaction.controller");
const {
  register,
  login,
  logout,
  getUserData,
  updateUser,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.get("/logout", verifyToken, logout);

router
  .route("/user")
  .post(register)
  .get(verifyToken, getUserData)
  .put(verifyToken, updateUser);

router.post("/send-money", verifyToken, sendMoney);
// router.post("/request-money", verifyToken, requestMoney);

module.exports = router;
