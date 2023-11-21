const {devProfile} = require('../database/models/devProfile')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminPanel', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
  res.render('devProfile', { title: 'Express' });
});

router.post('/profile', async function(req, res, next){
    console.log("****", req.body.contactInfo);
    let newDevProfile = new devProfile({
        name: req.body.name,
        title: req.body.title,
        summary: req.body.summary,
        contactInfo: req.body.contactInfo
      });
      await newDevProfile.save();
      res.send("devProfile Registered!");
})


module.exports = router;
