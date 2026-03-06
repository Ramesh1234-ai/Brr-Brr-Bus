# Quick Start Guide - Bus Booking Backend

## 📋 Prerequisites

- Node.js v16 or higher
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

---

## 🚀 Setup & Installation

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```bash
# Create from example
cp .env.example .env

# Update the values (optional, defaults work for local MongoDB)
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update MONGO_URI in .env
```

### 5. Run the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

---

## 📊 Seed Sample Data

To populate the database with sample buses:

```bash
npx tsx seed.ts
```

This will create 5 sample buses with complete seat layouts.

---

## 🧪 Testing API Endpoints

### Using cURL

#### 1. Get All Buses
```bash
curl -X GET "http://localhost:5000/api/buses?page=1&pageSize=10"
```

#### 2. Get Buses with Filters
```bash
curl -X GET "http://localhost:5000/api/buses?departureCity=Mumbai&arrivalCity=Delhi&date=2024-03-15"
```

#### 3. Get Specific Bus
```bash
curl -X GET "http://localhost:5000/api/buses/507f1f77bcf86cd799439011"
```

#### 4. Create a Bus
```bash
curl -X POST "http://localhost:5000/api/buses" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Night Express",
    "departureCity": "Mumbai",
    "arrivalCity": "Delhi",
    "departureTime": "22:00",
    "arrivalTime": "07:00",
    "price": 1200,
    "totalSeats": 48,
    "isAC": true,
    "busType": "Sleeper",
    "departureSlot": "Evening",
    "date": "2024-03-15",
    "stops": [
      {
        "stopName": "Indore",
        "arrivalTime": "02:30",
        "departureTime": "02:45"
      }
    ]
  }'
```

#### 5. Create a Booking
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "507f1f77bcf86cd799439011",
    "seats": ["A1", "A2"],
    "passengerDetails": [
      {
        "name": "John Doe",
        "age": 28,
        "gender": "Male"
      },
      {
        "name": "Jane Smith",
        "age": 26,
        "gender": "Female"
      }
    ]
  }'
```

#### 6. Get Booking
```bash
curl -X GET "http://localhost:5000/api/bookings/507f1f77bcf86cd799439012"
```

#### 7. Cancel Booking
```bash
curl -X PUT "http://localhost:5000/api/bookings/507f1f77bcf86cd799439012/cancel"
```

---

### Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)

2. Create a new Collection

3. Add requests with these URLs:
   - **GET** `http://localhost:5000/api/buses`
   - **POST** `http://localhost:5000/api/buses`
   - **GET** `http://localhost:5000/api/buses/:busId`
   - **POST** `http://localhost:5000/api/bookings`
   - **GET** `http://localhost:5000/api/bookings/:bookingId`
   - **PUT** `http://localhost:5000/api/bookings/:bookingId/cancel`

4. Set request headers:
   ```
   Content-Type: application/json
   ```

5. Add JSON body for POST/PUT requests

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── controllers/
│   │   ├── busController.ts      # Bus business logic
│   │   └── bookingController.ts  # Booking business logic
│   ├── models/
│   │   ├── Bus.ts                # Bus schema
│   │   └── Booking.ts            # Booking schema
│   ├── routes/
│   │   ├── busRoutes.ts          # Bus endpoints
│   │   └── bookingRoutes.ts      # Booking endpoints
│   ├── types/
│   │   ├── bus.types.ts          # Bus TypeScript types
│   │   └── booking.types.ts      # Booking TypeScript types
│   ├── utils/
│   │   └── seatGenerator.ts      # Seat utilities
│   ├── middleware/
│   │   └── errorHandler.ts       # Error handling
│   ├── app.ts                    # Express configuration
│   └── server.ts                 # Server entry point
├── dist/                         # Compiled TypeScript (after build)
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── README.md                     # Full documentation
├── seed.ts                       # Database seeder
└── QUICKSTART.md                 # This file
```

---

## 🔑 Key Files Explained

### `src/app.ts`
- Express application setup
- Middleware configuration (CORS, JSON parsing)
- Route mounting
- Error handling

### `src/server.ts`
- Server startup logic
- Database connection
- Port listening

### `src/models/Bus.ts`
- MongoDB schema for buses
- Validates bus data
- Indexes for performance

### `src/models/Booking.ts`
- MongoDB schema for bookings
- References Bus model
- Validates passenger data

### `src/controllers/busController.ts`
- `getAllBuses()` - Fetch with filters
- `getBusById()` - Get single bus
- `createBus()` - Create new bus
- `updateAvailableSeats()` - Update after booking

### `src/controllers/bookingController.ts`
- `createBooking()` - Create new booking
- `getBookingById()` - Get booking details
- `getBookingsByBus()` - Get all bookings for a bus
- `cancelBooking()` - Cancel booking

### `src/utils/seatGenerator.ts`
- `generateSeatLayout()` - Create seats for a bus
- `validateSeats()` - Check seat availability
- `calculateTotalPrice()` - Compute booking price

---

## 🐛 Common Issues & Solutions

### Issue: `Cannot find module 'dotenv'`
**Solution:** Run `npm install`

### Issue: `MongoDB connection error`
**Solution:** 
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas, enable IP whitelist

### Issue: `Port 5000 already in use`
**Solution:** 
- Change PORT in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### Issue: TypeScript compilation errors
**Solution:** 
- Run `npm run build` to check errors
- Ensure all types are properly imported

---

## 📈 Next Steps

1. **Connect Frontend**: Update API URL in frontend `.env`
2. **Add Authentication**: Implement JWT tokens
3. **Add Search**: Create advanced search filters
4. **Add Reviews**: Add passenger feedback system
5. **Payment Integration**: Add Stripe/Razorpay
6. **Email Notifications**: Send booking confirmations

---

## 📚 API Response Examples

### Success Response (200)
```json
{
  "page": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalBuses": 45,
  "buses": [...]
}
```

### Error Response (400)
```json
{
  "message": "Seats A1, A3 are already booked",
  "unavailableSeats": ["A1", "A3"]
}
```

### Error Response (404)
```json
{
  "message": "Bus not found"
}
```

### Error Response (500)
```json
{
  "message": "Internal server error",
  "error": "Error details here"
}
```

---

## 🌟 Features Implemented

✅ Complete CRUD operations for buses and bookings
✅ Advanced filtering and pagination
✅ Automatic seat layout generation
✅ Real-time seat availability tracking
✅ Booking cancellation with seat restoration
✅ Comprehensive error handling
✅ TypeScript for type safety
✅ MongoDB with Mongoose
✅ RESTful API design
✅ Production-ready structure

---

## 📞 Support

For issues or questions:
1. Check the main [README.md](./README.md)
2. Review the code comments
3. Check error messages in console
4. Verify environment variables

---

**Happy Coding! 🚀**
