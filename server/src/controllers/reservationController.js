const { pool } = require('../db');

/** POST /api/reservations */
async function createReservation(req, res) {
  try {
    const { movie_id, cinema_id, date, time, seat_numbers } = req.body;
    if (!movie_id || !cinema_id || !date || !time || !seat_numbers) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // (προαιρετικό) έλεγχος ότι υπάρχουν cinema/movie
    const [[movie]] = await pool.query('SELECT movie_id FROM movies WHERE movie_id = ? AND cinema_id = ?', [movie_id, cinema_id]);
    if (!movie) return res.status(400).json({ error: 'Invalid movie/cinema' });

    const [r] = await pool.query(
      'INSERT INTO reservations (user_id, movie_id, cinema_id, date, time, seat_numbers) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.user_id, movie_id, cinema_id, date, time, seat_numbers]
    );
    res.status(201).json({ reservation_id: r.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** GET /api/user/reservations */
async function listUserReservations(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT r.reservation_id, r.date, r.time, r.seat_numbers,
              m.title, c.name AS cinema_name
       FROM reservations r
       JOIN movies m ON r.movie_id = m.movie_id
       JOIN cinemas c ON r.cinema_id = c.cinema_id
       WHERE r.user_id = ?
       ORDER BY r.date, r.time`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** PATCH /api/reservations/:reservation_id */
async function updateReservation(req, res) {
  try {
    const { reservation_id } = req.params;
    const { date, time, seat_numbers } = req.body;

    const [[row]] = await pool.query(
      'SELECT user_id FROM reservations WHERE reservation_id = ?',
      [reservation_id]
    );
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (row.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });

    await pool.query(
      'UPDATE reservations SET date = ?, time = ?, seat_numbers = ? WHERE reservation_id = ?',
      [date, time, seat_numbers, reservation_id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** DELETE /api/reservations/:reservation_id */
async function deleteReservation(req, res) {
  try {
    const { reservation_id } = req.params;

    const [[row]] = await pool.query(
      'SELECT user_id FROM reservations WHERE reservation_id = ?',
      [reservation_id]
    );
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (row.user_id !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('DELETE FROM reservations WHERE reservation_id = ?', [reservation_id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createReservation,
  listUserReservations,
  updateReservation,
  deleteReservation,
};
