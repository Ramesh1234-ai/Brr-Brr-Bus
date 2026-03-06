import 'dotenv/config';
import app from '../src/app';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Bus Booking Management System API     ║
║                                        ║
║  🚀Server is on ${PORT}                ║
║  📝 API Documentation:                 ║
║     GET  /api/buses                    ║
║     POST /api/buses                    ║
║     GET  /api/buses/:busId             ║
║     POST /api/bookings                 ║
║     GET  /api/bookings/:bookingId      ║
║     PUT  /api/bookings/:bookingId/cancel
║                                        ║
║  💾 MongoDB: Connected                 ║
║  ✅ Ready for requests                 ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
