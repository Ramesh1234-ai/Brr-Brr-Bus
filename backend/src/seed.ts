/**
 * Seed script to populate the database with sample buses
 * Run: npm run seed
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Bus from './models/Bus.js';
import { generateSeatLayout } from './utils/seatGenerator.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bus-booking';

// Generate dates dynamically
const generateFutureDates = () => {
  const today = new Date();
  const dates = [];
  
  // Generate 5 future dates starting from today
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
  }
  
  return dates;
};

const futureDates = generateFutureDates();

const sampleBuses = [
  {
    name: 'Express Travels',
    departureCity: 'Mumbai',
    arrivalCity: 'Delhi',
    departureTime: '22:00',
    arrivalTime: '07:00',
    price: 1200,
    totalSeats: 48,
    isAC: true,
    busType: 'Sleeper',
    departureSlot: 'Evening',
    date: futureDates[0],
    stops: [
      { stopName: 'Indore', arrivalTime: '02:30', departureTime: '02:45' },
      { stopName: 'Gwalior', arrivalTime: '05:00', departureTime: '05:15' },
    ],
  },
  {
    name: 'Golden Coach',
    departureCity: 'Mumbai',
    arrivalCity: 'Bangalore',
    departureTime: '18:00',
    arrivalTime: '08:00',
    price: 900,
    totalSeats: 48,
    isAC: true,
    busType: 'Sleeper',
    departureSlot: 'Evening',
    date: futureDates[1],
    stops: [
      { stopName: 'Aurangabad', arrivalTime: '22:00', departureTime: '22:15' },
      { stopName: 'Parbhani', arrivalTime: '00:30', departureTime: '00:45' },
    ],
  },
  {
    name: 'Shatabdi Express',
    departureCity: 'Delhi',
    arrivalCity: 'Agra',
    departureTime: '06:00',
    arrivalTime: '08:30',
    price: 400,
    totalSeats: 48,
    isAC: true,
    busType: 'Normal',
    departureSlot: 'Morning',
    date: futureDates[0],
    stops: [
      { stopName: 'Aligarh', arrivalTime: '07:15', departureTime: '07:30' },
    ],
  },
  {
    name: 'Sky Bus',
    departureCity: 'Bangalore',
    arrivalCity: 'Hyderabad',
    departureTime: '14:00',
    arrivalTime: '20:00',
    price: 600,
    totalSeats: 48,
    isAC: true,
    busType: 'Semi-Sleeper',
    departureSlot: 'Afternoon',
    date: futureDates[2],
    stops: [
      { stopName: 'Kurnool', arrivalTime: '17:30', departureTime: '17:45' },
    ],
  },
  {
    name: 'Comfort Journey',
    departureCity: 'Chennai',
    arrivalCity: 'Bangalore',
    departureTime: '22:00',
    arrivalTime: '06:00',
    price: 800,
    totalSeats: 48,
    isAC: true,
    busType: 'Sleeper',
    departureSlot: 'Evening',
    date: futureDates[3],
    stops: [
      { stopName: 'Krishnagiri', arrivalTime: '02:30', departureTime: '02:45' },
      { stopName: 'Vellore', arrivalTime: '04:00', departureTime: '04:15' },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing buses
    await Bus.deleteMany({});
    console.log('🗑️  Cleared existing buses');

    // Create sample buses with seat layout
    const busesWithSeats = sampleBuses.map((bus) => ({
      ...bus,
      availableSeats: bus.totalSeats,
      seatLayout: generateSeatLayout(bus.totalSeats, bus.busType as 'Normal' | 'Semi-Sleeper' | 'Sleeper', bus.price),
    }));

    const createdBuses = await Bus.insertMany(busesWithSeats);
    console.log(`✅ Created ${createdBuses.length} sample buses`);

    createdBuses.forEach((bus) => {
      console.log(`
  🚌 ${bus.name}
  📍 ${bus.departureCity} → ${bus.arrivalCity}
  ⏰ ${bus.departureTime} - ${bus.arrivalTime}
  💺 Seats: ${bus.availableSeats}/${bus.totalSeats}
  💰 Price: ₹${bus.price}
  🔗 ID: ${bus._id}
      `);
    });

    await mongoose.disconnect();
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
