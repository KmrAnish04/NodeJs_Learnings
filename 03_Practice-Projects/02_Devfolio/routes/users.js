const { userModel} = require("../database/models/user");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const { route } = require(".");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", function(req, res){
  res.render('signup', { title: 'SignUp' })
}).post("/register", async function (req, res, next) {
  
  // Check if this user already exists or not
  let user = await userModel.findOne(
    {$or: [
      { username: req.body.username }, 
      { email: req.body.email } 
    ]});

  if (user) {
    console.log("user found: ", user);
    return res.status(400).send("User Already Exists!");
  } else {
    // Create new user
    newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    userModel.register(newUser, req.body.password , function(err,user){
      if(err){console.log(err); res.redirect("/register")}
      else{
        //A new user was saved
        passport.authenticate("local")(req,res,function(){
          console.log("user Created!");
          res.redirect("/")
        })
      }
    });

  }
});


router.get("/login", function(req, res){
  res.render('login', { title: 'Login' })
}).post("/login", passport.authenticate("local", {
  successRedirect: "/", // redirect to homepage
  failureRedirect: "/user/login" // force user to login again
}), function(req, res){
  console.log("I am here at login route!");
})

router.get("logout", function(req, res, next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect("/");
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;
