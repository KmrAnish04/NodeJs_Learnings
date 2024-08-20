const {generateDriveLinks} = require('./controllerUtils/utils.controller.js');
const {G_DRIVE_LINK_TYPES} = require('../src/constants.js');
const Project = require('../database/models/project.js');




////////////////////////////////////////////////////////////////////////////
//                           Home/Landing Page --> Get
////////////////////////////////////////////////////////////////////////////
const homePage = (req, res, next )=> {
    console.log("\n********************************");
    console.log("Inside HomePage >> Get");
    console.log("req.session.user :>>" , req.session.user);
    console.log("******************************** \n");
    
    if(!req.session.user){
      res.clearCookie('user');
      res.clearCookie('isLoggedIn');
    }
    res.render('index', { title: 'Express' });
}


////////////////////////////////////////////////////////////////////////////
//                           Get Projects --> Get
////////////////////////////////////////////////////////////////////////////
const getProjects = async (req, res, next) => {
    // Fetch all the data of projects and then show it in ejs
    try {
      const recentProjects = await Project.find();
      res.render('projects', {projects: recentProjects});
    } 
    catch (error) { res.status(500).json({ error: 'Internal Server Error' });}
}


////////////////////////////////////////////////////////////////////////////
//                           Like Project --> Put
////////////////////////////////////////////////////////////////////////////
const doLikeProject = async (req, res) => {
    const { projectId } = req.body;
    const user = req.user; // user will exist only if user is logged in.
  
    try{
      const project = await Project.findById(projectId);
      if (!project) { return res.status(404).json({ error: 'Project not found' });}
  
      // Check if the user has already liked the project
      const likedIndex = project.likes.findIndex((like) => like.user.toString() === user._id.toString());
      
      // User has not liked the project, so add to the likes array
      if (likedIndex === -1) { project.likes.push({user}); } 
      // User has already liked the project, so remove from the likes array
      else { project.likes.splice(likedIndex, 1); }
  
      
      await project.save(); // Save the updated project
      res.json({msg: "Success ✅", operation: 'Add', data: project});
    }
    catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


////////////////////////////////////////////////////////////////////////////
//                           UnLike Project --> Put
//                 unlike route is not added anywhere yet
////////////////////////////////////////////////////////////////////////////
const doUnLikeProject = (req, res) => {
    Project.findByIdAndUpdate(req.body.projectId, {
      $pull:{likes: req.user._id},
    }, { new: true }) // 'new: true' returns a new updated object of project
    .exec((err, result)=>{
      if(err){ return res.status(422).json({error: err}); }
      else{ res.json(result); }
    })
}


////////////////////////////////////////////////////////////////////////////
//                      is user Loggged In Middleware (can be shifted in middlewares directory)
////////////////////////////////////////////////////////////////////////////
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/");
}


////////////////////////////////////////////////////////////////////////////
//                           Get Resume --> Get
////////////////////////////////////////////////////////////////////////////
const getResume = (req, res) => {

    const fileId = process.env.G_DRIVE_RESUME_FILE_ID; // Google Drive Resume PDF File ID
    const resumeDriveLinks = generateDriveLinks(fileId);
  
    res.render('resume', {
        title: 'Resume',
        previewLink: resumeDriveLinks[G_DRIVE_LINK_TYPES.PREVIEW],
        sharingLink: resumeDriveLinks[G_DRIVE_LINK_TYPES.SHARING],
        downloadLink: resumeDriveLinks[G_DRIVE_LINK_TYPES.DOWNLOAD]
    });
}





//////////////////////////////////////////////////////////
//             Export Controller Functions
//////////////////////////////////////////////////////////
module.exports = {
    homePage,
    getProjects,
    doLikeProject,
    doLikeProject,
    doUnLikeProject,
    isLoggedIn,
    getResume
}