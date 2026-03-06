import express from 'express';
import {
  getAllBuses,
  getBusById,
  createBus,
  updateAvailableSeats,
} from '../controllers/busController.js';

const router = express.Router();

// GET all buses with filtering and pagination
router.get('/', getAllBuses);

// POST create a new bus
router.post('/', createBus);

// GET a single bus by ID
router.get('/:busId', getBusById);

// PATCH update available seats after booking
router.patch('/:busId/update-seats', updateAvailableSeats);

export default router;
