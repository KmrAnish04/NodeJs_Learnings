const express = require('express');
const router = express.Router();

const { loginWithSSO } = require('../controllers/ssoAuth.controller.js');



router.get("/login-with-sso", loginWithSSO);

router.get("/login-google-sso")

router.get("/register-user-sso")

router.get("/logout-user-sso")

router.get("/forgot-password-sso")

router.get("/update-accessToken-sso")



module.exports = router;