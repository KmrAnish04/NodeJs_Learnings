var express = require('express');
var router = express.Router();
const {handleGenerateNewShortURL} = require('../database/controllers/url');

/* GET users listing. */
router.post('/', handleGenerateNewShortURL);

module.exports = router;
