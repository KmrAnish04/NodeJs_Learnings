const express = require('express');
const router = express.Router();

const { loginWithSSO, logoutWithSSO, backChannelLogoutSSOServer } = require('../controllers/ssoAuth.controller.js');



router.get("/login-with-sso", loginWithSSO);

router.get("/logout-with-sso", logoutWithSSO)

router.post('/backchannel-logout', backChannelLogoutSSOServer)

router.get("/login-google-sso")

router.get("/register-user-sso")

router.get("/forgot-password-sso")

router.get("/update-accessToken-sso")



module.exports = router;