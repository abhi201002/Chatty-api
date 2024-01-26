const {
  login,
  register,
  setAvatar,
  logOut,
  search,
  getUser,
  updateUser,
  updatePassword,
  updateemail,
} = require("../controllers/userController.js");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getuser/:id", getUser);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.get("/search/:username/:cur_user", search)
router.put("/updateusername/:id", updateUser)
router.put("/updatepassword/:id", updatePassword)
router.put("/updateemail/:id", updateemail)


module.exports = router;
