import express from 'express';
import {
  createBooking,
  getBookingById,
  getBookingsByBus,
  cancelBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

// POST create a new booking
router.post('/', createBooking);

// GET booking by ID
router.get('/:bookingId', getBookingById);

// GET all bookings for a specific bus
router.get('/bus/:busId', getBookingsByBus);

// PUT cancel a booking
router.put('/:bookingId/cancel', cancelBooking);

export default router;
