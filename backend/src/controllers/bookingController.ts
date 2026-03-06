import type { Request, Response } from 'express';
import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';
import { validateSeats, calculateTotalPrice } from '../utils/seatGenerator.js';
import type { IBookingRequest, IBookingResponse } from '../types/booking.types.js';

/**
 * Create a new booking
 * POST /api/bookings
 */
export const createBooking = async (
  req: Request<{}, {}, IBookingRequest>,
  res: Response
): Promise<void> => {
  try {
    const { busId, seats, passengerDetails } = req.body;

    // Validation
    if (!busId || !seats || seats.length === 0 || !passengerDetails || passengerDetails.length === 0) {
      res.status(400).json({
        message: 'Missing required fields: busId, seats, passengerDetails',
      });
      return;
    }

    // Validate busId format
    if (!busId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid bus ID format' });
      return;
    }

    // Check if seats and passengers count match
    if (seats.length !== passengerDetails.length) {
      res.status(400).json({
        message: 'Number of seats and passengers must match',
      });
      return;
    }

    // Fetch bus
    const bus = await Bus.findById(busId);

    if (!bus) {
      res.status(404).json({ message: 'Bus not found' });
      return;
    }

    // Validate seats
    const seatValidation = validateSeats(seats, bus.seatLayout || []);

    if (!seatValidation.isValid) {
      res.status(400).json({
        message: seatValidation.message,
        unavailableSeats: seatValidation.unavailableSeats,
      });
      return;
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(seats, bus.seatLayout || []);

    // Create booking
    const booking = new Booking({
      busId,
      seats,
      passengerDetails,
      totalPrice,
      status: 'Confirmed',
    });

    await booking.save();

    // Update bus seat layout and available seats
    if (bus.seatLayout) {
      bus.seatLayout.forEach((seat) => {
        if (seats.includes(seat.seatNumber)) {
          seat.isAvailable = false;
        }
      });
    }

    bus.availableSeats -= seats.length;
    await bus.save();

    const response: IBookingResponse = {
      message: 'Booking successful',
      bookingId: booking._id?.toString(),
      seatsBooked: seats,
      totalPrice,
      status: 'Confirmed',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      message: 'Error creating booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get booking by ID
 * GET /api/bookings/:bookingId
 */
export const getBookingById = async (
  req: Request<{ bookingId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid booking ID format' });
      return;
    }

    const booking = await Booking.findById(bookingId).populate('busId');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      message: 'Error fetching booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get all bookings for a bus
 * GET /api/bookings/bus/:busId
 */
export const getBookingsByBus = async (
  req: Request<{ busId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { busId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    if (!busId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid bus ID format' });
      return;
    }

    const skip = ((page as any as number) - 1) * (pageSize as any as number);
    const limit = pageSize as any as number;

    const totalBookings = await Booking.countDocuments({ busId });
    const bookings = await Booking.find({ busId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      page: page as any as number,
      pageSize: pageSize as any as number,
      totalBookings,
      totalPages: Math.ceil(totalBookings / limit),
      bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      message: 'Error fetching bookings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Cancel a booking
 * PUT /api/bookings/:bookingId/cancel
 */
export const cancelBooking = async (
  req: Request<{ bookingId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'Invalid booking ID format' });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status === 'Cancelled') {
      res.status(400).json({ message: 'Booking is already cancelled' });
      return;
    }

    // Update booking status
    booking.status = 'Cancelled';
    await booking.save();

    // Restore seats availability
    const bus = await Bus.findById(booking.busId);

    if (bus && bus.seatLayout) {
      bus.seatLayout.forEach((seat) => {
        if (booking.seats.includes(seat.seatNumber)) {
          seat.isAvailable = true;
        }
      });
      bus.availableSeats += booking.seats.length;
      await bus.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      message: 'Error cancelling booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
