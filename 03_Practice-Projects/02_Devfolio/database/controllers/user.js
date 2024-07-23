const { userModel} = require("../models/user");
const passport = require('passport');


// Create New User
async function registerUser(req, res) {

    let newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    // Authaurize User
    userModel.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.error("Error Occured While Registering User: ",err);
            // Check if the error is due to an existing user
            if (err.name === 'UserExistsError') {
                return res.render('signup', {
                    title: "SignUp",
                    message: req.flash('UserAlreadyExists')
                });
            }
            // Handle other registration failures
            return res.render('signup', {
                title: "SignUp",
                message: req.flash('SignUpFailure')
            });
            // return res.json(err);
        } else {
            //A new user saved
            passport.authenticate("local")(req, res, function () {
                console.log("user Created!");
                res.render('/', {
                    title: "SignUp",
                    message: req.flash('SignUpSuccess')
                });
            })
        }
    });
}

module.exports = {
    registerUser
}