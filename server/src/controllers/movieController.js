const { pool } = require('../db');

async function listMoviesByCinema(req, res) {
  try {
    const { cinema_id } = req.query;
    if (!cinema_id) return res.status(400).json({ error: 'cinema_id required' });

    const [rows] = await pool.query(
      'SELECT * FROM movies WHERE cinema_id = ? ORDER BY title',
      [cinema_id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { listMoviesByCinema };
