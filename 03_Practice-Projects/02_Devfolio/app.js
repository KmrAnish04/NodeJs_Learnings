var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {connectToMongoDB} = require('./database/controllers/connectDB')
const expressSession = require('express-session')
const passport = require('passport');
const flash = require("connect-flash");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRoute = require('./routes/admin');
const { userModel } = require('./database/models/user');

// Connecting Database
connectToMongoDB('mongodb://localhost:27017/Devfolio-Anish')
.then(()=>{console.log("MongoDB Connected!")})
.catch(err => console.error('MongoDB: Something went wrong', err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "this is devfolio's token!"
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {done(null, user.id); });
// used to deserialize the user
passport.deserializeUser(async function(id, done) {
  try{
    const user = await userModel.findById(id);
    done(null, user);
  }catch(error){
    done(error, false);
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
