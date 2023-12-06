var express = require('express');
var router = express.Router();
const Project = require('../database/models/project');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("cookies: ", req.cookies);
  console.log("user: ", req.user);
  if(!req.user){
    console.log("*** User Not LoggedIn! ***");
    res.clearCookie('user');
    res.clearCookie('isLoggedIn');
  }
  res.render('index', { title: 'Express' });
});

router.get('/projects', async function (req, res, next) {
  // Fetch all the data of projects and then show it in ejs
  try {
    const recentProjects = await Project.find();
    console.log('***Projects***', recentProjects);
    res.render('projects', {projects: recentProjects});
    // res.json(recentProjects);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  // res.render('projects', {})
})

router.put('/like', isLoggedIn, function(req, res){
  console.log("logged In user ********: ", req.user);
  Project.findByIdAndUpdate(req.body.projectId, {
    // $push:{likes: req.user},
    $addToSet: { likes: req.user }, // Add user to likes if not already present
    // $pull: { likes: req.user }     // Remove user from likes if already present
    
  }, {
    new: true // It Will return a new updated object of project
  })
  .exec()
  .then((result)=>{
    res.json({msg: "Success ✅", data: result});
  })
  .catch(err=>{
    return res.status(422).json({error: err});
  })
});

router.put('/unlike', isLoggedIn, function(req, res){
  Project.findByIdAndUpdate(req.body.projectId, {
    $pull:{likes: req.user._id},
    
  }, {
    new: true // It Will return a new updated object of project
  }).exec((err, result)=>{
    if(err){
      return res.status(422).json({error: err});
    }
    else{
      res.json(result);
    }
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/"); // redirect to login page
}

module.exports = router;
