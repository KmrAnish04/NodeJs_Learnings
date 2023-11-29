var express = require('express');
var router = express.Router();
const Project = require('../database/models/project');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/projects', async function (req, res, next) {
  // Fetch all the data of projects and then show it in ejs
  try {
    const recentProjects = await Project.find();
    res.json(recentProjects);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  // res.render('projects', {})
})


module.exports = router;
