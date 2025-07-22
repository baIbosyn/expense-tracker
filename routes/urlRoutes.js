const express = require('express');
const router = express.Router();
const controller = require('../controllers/urlShortenerController');

router.post('/shorten', controller.createShortUrl);
router.get('/s/:shortId', controller.redirectToOriginal);

module.exports = router;
