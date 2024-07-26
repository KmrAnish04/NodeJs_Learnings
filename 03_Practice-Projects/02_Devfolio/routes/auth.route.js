var express = require("express");
var router = express.Router();

const {
  letRegisterUser, 
  doRegisterUser, 
  letLoginUser, 
  doLoginUser, 
  logoutUser
} = require("../controllers/auth.controller.js");



router.route("/register")
  .get(letRegisterUser)
  .post(doRegisterUser)


router.route("/login")
  .get(letLoginUser)
  .post(doLoginUser);


router.route('/logout')
  .get(logoutUser);



module.exports = router;
