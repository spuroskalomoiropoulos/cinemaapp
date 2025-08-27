require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db');

const authRoutes = require('./routes/authRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ping
app.get('/', (req, res) => res.send('Server is running!'));

//  check health
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  ta api
app.use('/api', authRoutes);
app.use('/api', cinemaRoutes);
app.use('/api', movieRoutes);
app.use('/api', reservationRoutes);

// start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
