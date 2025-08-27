const { pool } = require('../db');

async function listCinemas(req, res) {
  try {
    const { search } = req.query;
    if (search) {
      const like = `%${search}%`;
      const [rows] = await pool.query(
        'SELECT * FROM cinemas WHERE name LIKE ? OR location LIKE ? ORDER BY name',
        [like, like]
      );
      return res.json(rows);
    }
    const [rows] = await pool.query('SELECT * FROM cinemas ORDER BY name');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { listCinemas };
