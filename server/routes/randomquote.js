const router = require('express').Router();
const RandomQuoteController = require('../controllers/RandomQuoteController.js');

router.get('/', RandomQuoteController.getQuote);

module.exports = router;
