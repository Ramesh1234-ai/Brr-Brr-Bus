import mongoose, { Schema, Document } from 'mongoose';
import type { IBooking, IPassenger } from '../types/booking.types.js';

type IBookingDocument = Document & Omit<IBooking, '_id' | 'createdAt' | 'updatedAt'>;

const PassengerSchema = new Schema<IPassenger>({
  name: { 
    type: String, 
    required: [true, 'Passenger name is required'],
    trim: true 
  },
  age: { 
    type: Number, 
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
});

const BookingSchema = new Schema<IBookingDocument>(
  {
    busId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Bus',
      required: [true, 'Bus ID is required'],
      index: true
    },
    seats: { 
      type: [String], 
      required: [true, 'Seats are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one seat must be selected'
      }
    },
    passengerDetails: { 
      type: [PassengerSchema], 
      required: [true, 'Passenger details are required'],
      validate: {
        validator: (v: IPassenger[]) => v.length > 0,
        message: 'At least one passenger is required'
      }
    },
    totalPrice: { 
      type: Number, 
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative']
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Confirmed'
    },
  },
  { 
    timestamps: true 
  }
);

// Index for searching bookings by busId
BookingSchema.index({ busId: 1, createdAt: -1 });

export const Booking = mongoose.model<IBookingDocument>('Booking', BookingSchema);
export default Booking;
