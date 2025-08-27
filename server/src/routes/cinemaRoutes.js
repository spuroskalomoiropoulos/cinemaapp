const express = require('express');
const { listCinemas } = require('../controllers/cinemaController');
const router = express.Router();

router.get('/cinemas', listCinemas);

module.exports = router;
