const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session')
const passport = require('passport');
const flash = require("connect-flash");
require("dotenv").config();


// Custom Imports
const { connectToMongoDB } = require('./database/DB_Connection.js');
const { userModel } = require('./database/models/user.js');
const checkSSORedirect = require('./middlewares/checkSSORedirect.js');
const ErrorHandler = require("./middlewares/ErrorHandler.js");


// Routes
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');
const ssoAuthRouter = require('./routes/ssoAuth.route.js');
const adminRoute = require('./routes/admin.route.js');


// DataBase Connection
connectToMongoDB(process.env.DB_URL)
  .then(() => { 
    console.log("DataBase Setup Done! ☑️") 
  })
  .catch(err => console.error('MongoDB: Something went wrong', err));


var app = express();



app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "this is devfolio's token!"
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// used to serialize the user for the session
passport.serializeUser(function (user, done) { done(null, user.id); });

// used to deserialize the user
passport.deserializeUser(async function (id, done) {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } 
  catch (error) { done(error, false); }
});



// log only 4xx and 5xx responses to console
app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))
 
// log all requests to access.log
app.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(checkSSORedirect());


// Routes
app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/sso-auth', ssoAuthRouter);
app.use('/admin', adminRoute)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(ErrorHandler());




module.exports = app;