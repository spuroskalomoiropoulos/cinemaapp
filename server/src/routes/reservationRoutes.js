const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createReservation,
  listUserReservations,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservationController');

const router = express.Router();

// Προστατευμένα με JWT
router.get('/user/reservations', auth, listUserReservations);
router.post('/reservations', auth, createReservation);
router.patch('/reservations/:reservation_id', auth, updateReservation);
router.delete('/reservations/:reservation_id', auth, deleteReservation);

module.exports = router;
