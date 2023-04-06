const router = require("express").Router();

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

module.exports = router;
