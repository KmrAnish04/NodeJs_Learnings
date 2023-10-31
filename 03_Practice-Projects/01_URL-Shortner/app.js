var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const urlRoute = require('./routes/url');
const URL = require('./database/models/urls');
const {connectToMongoDB} = require('./database/controllers/connectDB');


var app = express();
connectToMongoDB("mongodb://localhost:27017/url-shortner")
.then(()=>{console.log("MongoDB Connected!")});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/url', urlRoute);
app.use("/:shortId", async (req, res)=>{
  console.log("**** HELLO ****", req.params);
  const shortId = req.params.shortId;
  const origionalEntry = await URL.findOneAndUpdate(
    {shortId}, // Filter
    {$push: {visitHistory: {timestamp: Date.now()}}}, // Update
  );
  // console.log("url", origionalEntry)
  res.redirect(origionalEntry.redirectURL); 
})

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
