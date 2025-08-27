const express = require('express');
const { listMoviesByCinema } = require('../controllers/movieController');
const router = express.Router();

router.get('/movies', listMoviesByCinema); //

module.exports = router;
