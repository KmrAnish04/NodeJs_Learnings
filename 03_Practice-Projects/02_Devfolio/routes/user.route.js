var express = require('express');
var router = express.Router();

const { 
  homePage, 
  getProjects, 
  doLikeProject,
  doUnLikeProject, 
  isLoggedIn, 
  getResume 
} = require("../controllers/user.controller.js");


router.get('/', homePage);

router.get('/projects', getProjects)

router.put('/like', isLoggedIn, doLikeProject);

router.put('/unlike', isLoggedIn, doUnLikeProject) // unlike route is not added anywhere yet

router.get('/resume', getResume);



module.exports = router;
