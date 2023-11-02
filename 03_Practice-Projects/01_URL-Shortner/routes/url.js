var express = require('express');
var router = express.Router();
const {handleGenerateNewShortURL, handleGetAnalytics} = require('../database/controllers/url');

/* GET users listing. */
router.post('/', handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);
module.exports = router;
