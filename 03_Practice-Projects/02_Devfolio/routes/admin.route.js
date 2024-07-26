var express = require('express');
var router = express.Router();

const {
  adminDashBoardOfThemSelf,
  adminDevProfileOfThemSelf,
  createAdminfProfileForThemSelf,
  adminAccessToCreateProjectForThemSelf
} = require('../controllers/admin.controller.js');



router.get('/', adminDashBoardOfThemSelf);

router.get('/profile', adminDevProfileOfThemSelf);

router.post('/profile', createAdminfProfileForThemSelf)

router.get('/createProject', adminAccessToCreateProjectForThemSelf);



module.exports = router;
