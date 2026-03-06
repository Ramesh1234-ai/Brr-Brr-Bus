import mongoose, { Schema, Document } from 'mongoose';
import type { IBus, ISeat, IStop } from '../types/bus.types.js';

type IBusDocument = Document & Omit<IBus, '_id' | 'createdAt' | 'updatedAt'>;

const SeatSchema = new Schema<ISeat>({
  seatNumber: { type: String, required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  seatType: { 
    type: String, 
    enum: ['Normal', 'Upper', 'Lower'], 
    required: true 
  },
  sleeperLevel: { 
    type: String, 
    enum: ['Upper', 'Lower'],
    sparse: true
  },
  isAvailable: { type: Boolean, default: true },
  price: { type: Number, required: true },
});

const StopSchema = new Schema<IStop>({
  stopName: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: true },
});

const BusSchema = new Schema<IBusDocument>(
  {
    name: { 
      type: String, 
      required: [true, 'Bus name is required'],
      trim: true 
    },
    departureCity: { 
      type: String, 
      required: [true, 'Departure city is required'],
      trim: true,
      index: true
    },
    arrivalCity: { 
      type: String, 
      required: [true, 'Arrival city is required'],
      trim: true,
      index: true
    },
    departureTime: { 
      type: String, 
      required: [true, 'Departure time is required'] 
    },
    arrivalTime: { 
      type: String, 
      required: [true, 'Arrival time is required'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    totalSeats: { 
      type: Number, 
      required: [true, 'Total seats is required'],
      min: [1, 'Bus must have at least 1 seat']
    },
    availableSeats: { 
      type: Number, 
      required: [true, 'Available seats is required']
    },
    isAC: { 
      type: Boolean, 
      default: false 
    },
    busType: { 
      type: String, 
      enum: ['Normal', 'Semi-Sleeper', 'Sleeper'],
      default: 'Normal'
    },
    departureSlot: { 
      type: String, 
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
      required: [true, 'Departure slot is required']
    },
    date: { 
      type: String, 
      required: [true, 'Date is required'],
      index: true
    },
    stops: { 
      type: [StopSchema], 
      required: true,
      validate: {
        validator: (v: IStop[]) => v.length > 0,
        message: 'Bus must have at least one stop'
      }
    },
    seatLayout: { 
      type: [SeatSchema], 
      required: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Compound index for searching buses
BusSchema.index({ departureCity: 1, arrivalCity: 1, date: 1 });

export const Bus = mongoose.model<IBusDocument>('Bus', BusSchema);
export default Bus;
