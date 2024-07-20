const express = require('express');
const router = express.Router();


router.route('/sign-in').get((req, res, next) => {
    console.log(req.body)
    return res
        .status(200)
        .json({
            message: "This is user signin/register route!",
            status: 200,
            page: "Sign-In"
        });
});

router.route('/login').get((req, res, next) => {
    return res
        .status(200)
        .json({
            message: "This is user login route!",
            status: 200,
            page: "Login"
        })
});


module.exports = router;