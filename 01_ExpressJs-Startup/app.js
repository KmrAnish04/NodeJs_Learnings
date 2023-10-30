const express = require('express')
const app = express()

// Configuring Template Engine
app.set('view engine', "ejs");

// Middleware
app.use(express.static('./public'),function(req, res, next){
    next();
})

app.get('/', function (req, res) {
    // console.log(req.params)
  res.render('index')
})

app.listen(3000)