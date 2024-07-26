const passport = require('passport');
const { userModel} = require("../database/models/user.js");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));



////////////////////////////////////////////////////////////////////////////
//                           Register User --> Get
////////////////////////////////////////////////////////////////////////////
const letRegisterUser = (req, res) => {
    req.flash('UserAlreadyExists', 'Username/Email is already taken. Please choose another.'); // Add an error flash message
    req.flash('SignUpSuccess', 'SignUp Successful!'); // Add a success flash message
    req.flash('SignUpFailure', 'Registration failed. Please try again.'); // Add a general failure
    res.render('signup', {
        title: 'SignUp',
        message: ''
    });
}


////////////////////////////////////////////////////////////////////////////
//                           Register User --> Post 
////////////////////////////////////////////////////////////////////////////
const doRegisterUser = async (req, res) => {

    let newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    // Authaurize User
    userModel.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.error("Error Occured While Registering User: ", err);
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


////////////////////////////////////////////////////////////////////////////
//                           Login User --> Get
////////////////////////////////////////////////////////////////////////////
const letLoginUser = (req, res) => {
    req.flash('error', 'Woops! Something Went Wrong!'); // Add an error flash message
    req.flash('success', 'Login successful!'); // Add a success flash message
    res.render('login', {
        title: 'Login',
        message: ''
    })
}


////////////////////////////////////////////////////////////////////////////
//                           Login User --> Post 
////////////////////////////////////////////////////////////////////////////
const doLoginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            console.log("error on login");
            return next(err);
        }
        if (!user) { // Authentication failed
            return res.render('login', {
                title: "Failure",
                message: req.flash('error')
            });
        }

        req.logIn(user, (err) => { // Authentication successful, login user
            if (err) { return next(err); }

            console.log("Successful login")
            console.log("user: ", user);
            req.user = user;

            res.cookie('user', user.username, {
                maxAge: 9000000
            });
            res.cookie('isLoggedIn', true, {
                maxAge: 9000000
            });
            
            return res.render('index', {
                title: "Success",
                message: req.flash('success')
            });
        });
    })(req, res, next);
}


////////////////////////////////////////////////////////////////////////////
//                           Logout User --> Get
////////////////////////////////////////////////////////////////////////////
/* Handle Logout */
// router.get("logout", function(req, res, next){
//   req.logout(function(err){
//     if(err) return next(err);
//     res.redirect("/");
//   })
// })
const logoutUser = (req, res) => {
    req.logout();
    res.redirect('/');
}



//////////////////////////////////////////////////////////
//             Export Controller Functions
//////////////////////////////////////////////////////////
module.exports = {
    letRegisterUser,
    doRegisterUser,
    letLoginUser,
    doLoginUser,
    logoutUser
}