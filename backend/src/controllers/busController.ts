import type { Request, Response } from 'express';
import Bus from '../models/Bus.js';
import type { IBus, IBusQuery, IBusPaginatedResponse } from '../types/bus.types.js';
import { generateSeatLayout } from '../utils/seatGenerator.js';

/**
 * Get all buses with filtering and pagination
 * GET /api/buses
 */
export const getAllBuses = async (req: Request<{}, {}, {}, IBusQuery>, res: Response): Promise<void> => {
  try {
    const {
      departureCity,
      arrivalCity,
      date,
      seatType,
      isAC,
      departureSlot,
      page = 1,
      pageSize = 10,
    } = req.query;

    // Build filter object
    const filter: Record<string, any> = {};

    if (departureCity) {
      filter.departureCity = { $regex: departureCity, $options: 'i' };
    }
    if (arrivalCity) {
      filter.arrivalCity = { $regex: arrivalCity, $options: 'i' };
    }
    if (date) {
      filter.date = date;
    }
    if (seatType) {
      filter.busType = seatType;
    }
    if (isAC !== undefined) {
      filter.isAC = isAC === true;
    }
    if (departureSlot) {
      filter.departureSlot = departureSlot;
    }
    if (typeof departureCity === 'string' && typeof arrivalCity === 'string') {
      filter.availableSeats = { $gt: 0 };
    }

    // Calculate pagination
    const skip = ((page as number) - 1) * (pageSize as number);
    const limit = pageSize as number;

    // Get total count
    const totalBuses = await Bus.countDocuments(filter);
    const totalPages = Math.ceil(totalBuses / limit);

    // Get buses
    const buses = await Bus.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const response: IBusPaginatedResponse = {
      page: page as number,
      pageSize: pageSize as number,
      totalPages,
      totalBuses,
      buses: buses as any[] as IBus[],
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({
      message: 'Error fetching buses',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get a single bus by ID with seat layout
 * GET /api/buses/:busId
 */
export const getBusById = async (req: Request<{ busId: string }>, res: Response): Promise<void> => {
  try {
    const { busId } = req.params;

    // Validate MongoDB ObjectId
    if (!busId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid bus ID format' });
      return;
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      res.status(404).json({ message: 'Bus not found' });
      return;
    }

    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({
      message: 'Error fetching bus',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Create a new bus
 * POST /api/buses
 */
export const createBus = async (req: Request<{}, {}, IBus>, res: Response): Promise<void> => {
  try {
    const {
      name,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      totalSeats,
      isAC,
      busType,
      departureSlot,
      date,
      stops,
    } = req.body;

    // Validation
    if (
      !name ||
      !departureCity ||
      !arrivalCity ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !totalSeats ||
      !busType ||
      !departureSlot ||
      !date ||
      !stops
    ) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Generate seat layout
    const seatLayout = generateSeatLayout(totalSeats, busType, price);

    const bus = new Bus({
      name,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      totalSeats,
      availableSeats: totalSeats,
      isAC: isAC || false,
      busType,
      departureSlot,
      date,
      stops,
      seatLayout,
    });

    await bus.save();

    res.status(201).json({
      message: 'Bus created successfully',
      bus,
    });
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({
      message: 'Error creating bus',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Update bus available seats after booking
 * PATCH /api/buses/:busId/update-seats
 */
export const updateAvailableSeats = async (
  req: Request<{ busId: string }, {}, { seatsToBook: string[] }>,
  res: Response
): Promise<void> => {
  try {
    const { busId } = req.params;
    const { seatsToBook } = req.body;

    if (!busId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid bus ID format' });
      return;
    }

    if (!seatsToBook || seatsToBook.length === 0) {
      res.status(400).json({ message: 'No seats provided' });
      return;
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      res.status(404).json({ message: 'Bus not found' });
      return;
    }

    // Mark seats as unavailable
    bus.seatLayout?.forEach((seat) => {
      if (seatsToBook.includes(seat.seatNumber)) {
        seat.isAvailable = false;
      }
    });

    // Update available seats count
    bus.availableSeats -= seatsToBook.length;
    await bus.save();

    res.json({
      message: 'Seats updated successfully',
      availableSeats: bus.availableSeats,
    });
  } catch (error) {
    console.error('Error updating seats:', error);
    res.status(500).json({
      message: 'Error updating seats',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
