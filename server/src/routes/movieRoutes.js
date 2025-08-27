const express = require('express');
const { listMoviesByCinema } = require('../controllers/movieController');
const router = express.Router();

router.get('/movies', listMoviesByCinema); // /movies?cinema_id=1

module.exports = router;
