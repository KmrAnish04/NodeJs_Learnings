var express = require('express');
var router = express.Router();
const Project = require('../database/models/project');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user){
    res.clearCookie('user');
    res.clearCookie('isLoggedIn');
  }
  res.render('index', { title: 'Express' });
});


router.get('/projects', async function (req, res, next) {
  // Fetch all the data of projects and then show it in ejs
  try {
    const recentProjects = await Project.find();
    res.render('projects', {projects: recentProjects});
  } 
  catch (error) { res.status(500).json({ error: 'Internal Server Error' });}
})


router.put('/like', isLoggedIn, async function(req, res){
  console.log("logged In user ********: ", req.user);

  const { projectId } = req.body;
  const user = req.user; // user will exist only if user is logged in.

  try{
    const project = await Project.findById(projectId);
    
    if (!project) { return res.status(404).json({ error: 'Project not found' });}

    // Check if the user has already liked the project
    const likedIndex = project.likes.findIndex((like) => like.user.toString() === user._id.toString());
    
    if (likedIndex === -1) { // User has not liked the project, so add to the likes array
      project.likes.push({user});
    } 
    else { // User has already liked the project, so remove from the likes array
      project.likes.splice(likedIndex, 1);
    }

    // Save the updated project
    await project.save();
    res.json({msg: "Success ✅", operation: 'Add', data: project});
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /unlike route is not added anywhere yet
router.put('/unlike', isLoggedIn, function(req, res){
  Project.findByIdAndUpdate(req.body.projectId, {
    $pull:{likes: req.user._id},
  }, { new: true }) // 'new: true' returns a new updated object of project
  .exec((err, result)=>{
    if(err){ return res.status(422).json({error: err}); }
    else{ res.json(result); }
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/"); // redirect to login page
}

module.exports = router;
