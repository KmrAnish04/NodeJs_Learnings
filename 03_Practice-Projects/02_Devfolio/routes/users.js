const { userModel} = require("../database/models/user");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const { route } = require(".");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET users listing. */
router.get("/", isLoggedIn,function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", function(req, res){
  req.flash('UserAlreadyExists', 'Username/Email is already taken. Please choose another.'); // Add an error flash message
  req.flash('SignUpSuccess', 'SignUp Successful!'); // Add a success flash message
  req.flash('SignUpFailure', 'Registration failed. Please try again.'); // Add a general failure
  res.render('signup', { title: 'SignUp', message: '' })
}).post("/register", async function (req, res, next) {
  
  // Check if this user already exists or not
  // let user = await userModel.findOne(
  //   {$or: [
  //     { username: req.body.username }, 
  //     { email: req.body.email } 
  //   ]});

  // if (user) {
  //   console.log("user found: ", user);
  //   // return res.status(400).send("User Already Exists!");
  //   // return done(null, false, { message: "invalid password." });
  // } else {
    // Create new user
    newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    userModel.register(newUser, req.body.password , function(err,user){  


      if (err) {
        console.error(err);
        // Check if the error is due to an existing user
        if (err.name === 'UserExistsError') {
            return res.render('signup', {title: "SignUp", message:  req.flash('UserAlreadyExists')});
        }
        // Handle other registration failures
        return res.render('signup', {title: "SignUp", message: req.flash('SignUpFailure')});
    }
      else{
        //A new user was saved
        passport.authenticate("local")(req,res,function(){
          console.log("user Created!");
          res.render('/', {title: "SignUp", message: req.flash('SignUpSuccess')});
        })
      }
    });

  // }
});


// .post("/login", passport.authenticate("local", {
//   successRedirect: "/", // redirect to homepage
//   failureRedirect: "/user/login", // force user to login again
//   failureFlash : true,
//   failureMessage: "Woops! Something Went Wrong!"
// }), function(req, res){
//   console.log("I am here at login route!");
// })
router.get("/login", function(req, res){
  req.flash('error', 'Woops! Something Went Wrong!'); // Add an error flash message
  req.flash('success', 'Login successful!'); // Add a success flash message
  res.render('login', { title: 'Login' , message: ''})
})
router.post("/login", function(req, res, next){
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      console.log("error on login");
      return next(err); 
    }
    if (!user) {
      // Authentication failed
      return res.render('login', {title: "Failure", message: req.flash('error')});
    }
    // Authentication successful, log the user in
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // Successful login
      console.log("user: ", user);
      req.user = user;
      res.cookie('user', user.username, { maxAge: 9000000 });
      res.cookie('isLoggedIn', true, { maxAge: 9000000 });
      return res.render('index', {title: "Success", message: req.flash('success')});
    });
  })(req, res, next);
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/"); // redirect to login page
}

/* Handle Logout */
// router.get("logout", function(req, res, next){
//   req.logout(function(err){
//     if(err) return next(err);
//     res.redirect("/");
//   })
// })
 router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
