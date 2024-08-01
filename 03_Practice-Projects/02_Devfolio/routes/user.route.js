const express = require('express');
const router = express.Router();
const {verifyJwt} = require('../middlewares/index.js');

const { 
  homePage, 
  getProjects, 
  doLikeProject,
  doUnLikeProject, 
  isLoggedIn, 
  getResume 
} = require("../controllers/user.controller.js");


router.get('/', homePage);

router.get('/projects', verifyJwt, getProjects)

router.put('/like', isLoggedIn, doLikeProject);

router.put('/unlike', isLoggedIn, doUnLikeProject) // unlike route is not added anywhere yet

router.get('/resume', getResume);



module.exports = router;
