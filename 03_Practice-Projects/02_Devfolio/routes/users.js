const { userModel} = require("../database/models/user");
const {registerUser} = require("../database/controllers/user")
var express = require("express");
var router = express.Router();
const passport = require('passport');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET users listing. */
// router.get("/:id", isLoggedIn,function (req, res, next) {
//   res.send("respond with a resource");
// });

router.get("/register", function(req, res){
  req.flash('UserAlreadyExists', 'Username/Email is already taken. Please choose another.'); // Add an error flash message
  req.flash('SignUpSuccess', 'SignUp Successful!'); // Add a success flash message
  req.flash('SignUpFailure', 'Registration failed. Please try again.'); // Add a general failure
  res.render('signup', { title: 'SignUp', message: '' })
}).post("/register", registerUser);


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


// SSO Login
router.get("/loginwithsso", function(req, res){
  
  const authProviderUrl = 'http://localhost:3000/api/v1/auth/login'; // Replace with your authentication provider's URL
  // const redirectUrl = `${req.protocol}://${req.headers.host}${req.path}`; // Your callback URL after authentication
  const redirectUrl = `${req.protocol}://${req.headers.host}`; // Your callback URL after authentication

  // Redirect URL: After the successfull authentication, the auth service provider will redirct us on the Redirect URL.
  // const ssoRedirectUrl = `${authProviderUrl}?next=${redirectUrl}`;
  const ssoRedirectUrl = `${authProviderUrl}?redirectURL=${redirectUrl}`;
  console.log("redi: ", redirectUrl);

  // res.json(`Yaha se tumhe auth microservices pe redirect kiya jaega, jiska url hai ${ssoRedirectUrl}`)
  res.redirect(ssoRedirectUrl);
})


module.exports = router;
