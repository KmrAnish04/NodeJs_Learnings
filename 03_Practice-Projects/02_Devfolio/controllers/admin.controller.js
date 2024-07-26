const {defalut: mongoose} = require('mongoose');
const {devProfile} = require('../database/models/devProfile.js');
const Project = require('../database/models/project.js');


////////////////////////////////////////////////////////////////////////////
//                           Get Admin Dashboard --> Get
////////////////////////////////////////////////////////////////////////////
const adminDashBoardOfThemSelf = (req, res, next) => {
    res.render('adminPanel', { title: 'Express' });
}


////////////////////////////////////////////////////////////////////////////
//                           Admin Profile --> Get
////////////////////////////////////////////////////////////////////////////
const adminDevProfileOfThemSelf = (req, res, next) => {
    res.render('devProfile', { title: 'Express' });
}


////////////////////////////////////////////////////////////////////////////
//                           Crate Profile --> Post
////////////////////////////////////////////////////////////////////////////
const createAdminfProfileForThemSelf = async (req, res, next) => {
    console.log("****", req.body.contactInfo);
    let newDevProfile = new devProfile({
        name: req.body.name,
        title: req.body.title,
        summary: req.body.summary,
        contactInfo: req.body.contactInfo
      });
      await newDevProfile.save();
      res.send("devProfile Registered!");
}


////////////////////////////////////////////////////////////////////////////
//                           Create Projects --> Get
////////////////////////////////////////////////////////////////////////////
const adminAccessToCreateProjectForThemSelf = async (req, res, next) => {
    const newProject = new Project({
      title: 'Sample Project 9',
      description: 'This is the description for Sample Project 9.',
      images: ['https://example.com/image9.jpg', 'https://example.com/image9.jpg'],
      projectLink: 'https://example.com/project9',
      githubLink: 'https://github.com/user/project9',
      likes: [
        {
          user: new mongoose.Types.ObjectId('60b9a9d46be59f001c3c2df1'), // Convert the string to ObjectId
          date: Date.now()
        },
        {
          user: new mongoose.Types.ObjectId('60b9a9d46be59f001c3c2df2'),
          date: Date.now()
        }
      ],
      comments: [
        {
          user: new mongoose.Types.ObjectId('60b9a9d46be59f001c3c2df1'),
          text: 'Nice project!',
          date: Date.now()
        },
        {
          user: new mongoose.Types.ObjectId('60b9a9d46be59f001c3c2df2'),
          text: 'Great work!',
          date: Date.now()
        }
      ],
      dateCreated: Date.now()
    });
      
    let savedData = await newProject.save();
    res.json({message: "Success, Project Saved! ✅", SavedData:savedData});
    // .catch((err)=>{
    //    // Handle the error if the data couldn't be saved
    //    res.status(500).json(err);
    // })
  
}




//////////////////////////////////////////////////////////
//             Export Controller Functions
//////////////////////////////////////////////////////////
module.exports = {
    adminDashBoardOfThemSelf,
    adminDevProfileOfThemSelf,
    createAdminfProfileForThemSelf,
    adminAccessToCreateProjectForThemSelf
}