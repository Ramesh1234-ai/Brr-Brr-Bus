# Bus Booking Management System - Backend API

A production-ready REST API for a Bus Booking Management System built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- ✅ Bus listing with advanced filtering and pagination
- ✅ Seat layout generation and management
- ✅ Booking creation and management
- ✅ Real-time seat availability tracking
- ✅ Comprehensive error handling
- ✅ Type-safe with TypeScript
- ✅ Scalable MongoDB integration

## 📦 Installation

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your settings**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bus-booking
   NODE_ENV=development
   ```

## 🏃 Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📋 Project Structure

```
src/
├── config/
│   └── db.ts                 # MongoDB connection
├── controllers/
│   ├── busController.ts      # Bus operations
│   └── bookingController.ts  # Booking operations
├── models/
│   ├── Bus.ts                # Bus Mongoose schema
│   └── Booking.ts            # Booking Mongoose schema
├── routes/
│   ├── busRoutes.ts          # Bus endpoints
│   └── bookingRoutes.ts      # Booking endpoints
├── types/
│   ├── bus.types.ts          # Bus interfaces
│   └── booking.types.ts      # Booking interfaces
├── utils/
│   └── seatGenerator.ts      # Seat utility functions
├── middleware/
│   └── errorHandler.ts       # Error handling
├── app.ts                    # Express app setup
└── server.ts                 # Server entry point
```

## 🔌 API Endpoints

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "message": "Bus Booking Management System API is running",
  "timestamp": "2024-03-06T10:30:00.000Z"
}
```

---

## 🚌 Bus Endpoints

### 1. Get All Buses (with Filtering & Pagination)

```bash
GET /api/buses?departureCity=Mumbai&arrivalCity=Delhi&date=2024-03-15&page=1&pageSize=10
```

**Query Parameters:**
- `departureCity` (optional): Filter by departure city
- `arrivalCity` (optional): Filter by arrival city
- `date` (optional): Filter by date (YYYY-MM-DD)
- `seatType` (optional): Filter by seat type (Normal, Semi-Sleeper, Sleeper)
- `isAC` (optional): Filter by AC (true/false)
- `departureSlot` (optional): Filter by slot (Morning, Afternoon, Evening, Night)
- `page` (default: 1): Page number
- `pageSize` (default: 10): Results per page

**Response:**
```json
{
  "page": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalBuses": 45,
  "buses": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Express Travels",
      "departureCity": "Mumbai",
      "arrivalCity": "Delhi",
      "departureTime": "22:00",
      "arrivalTime": "07:00",
      "price": 1200,
      "totalSeats": 48,
      "availableSeats": 10,
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
      ],
      "seatLayout": [...],
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create a New Bus

```bash
POST /api/buses
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Express Travels",
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
}
```

**Response (201 Created):**
```json
{
  "message": "Bus created successfully",
  "bus": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Express Travels",
    "departureCity": "Mumbai",
    "arrivalCity": "Delhi",
    "departureTime": "22:00",
    "arrivalTime": "07:00",
    "price": 1200,
    "totalSeats": 48,
    "availableSeats": 48,
    "isAC": true,
    "busType": "Sleeper",
    "departureSlot": "Evening",
    "date": "2024-03-15",
    "stops": [...],
    "seatLayout": [
      {
        "seatNumber": "A1",
        "row": 0,
        "column": 0,
        "seatType": "Upper",
        "sleeperLevel": "Upper",
        "isAvailable": true,
        "price": 1080
      }
    ],
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-01T10:00:00.000Z"
  }
}
```

---

### 3. Get Bus by ID (with Seat Layout)

```bash
GET /api/buses/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Express Travels",
  "departureCity": "Mumbai",
  "arrivalCity": "Delhi",
  "departureTime": "22:00",
  "arrivalTime": "07:00",
  "price": 1200,
  "totalSeats": 48,
  "availableSeats": 10,
  "isAC": true,
  "busType": "Sleeper",
  "departureSlot": "Evening",
  "date": "2024-03-15",
  "stops": [...],
  "seatLayout": [
    {
      "seatNumber": "A1",
      "row": 0,
      "column": 0,
      "seatType": "Upper",
      "sleeperLevel": "Upper",
      "isAvailable": false,
      "price": 1080
    },
    {
      "seatNumber": "A2",
      "row": 0,
      "column": 1,
      "seatType": "Lower",
      "sleeperLevel": "Lower",
      "isAvailable": true,
      "price": 1200
    }
  ]
}
```

---

## 💳 Booking Endpoints

### 1. Create a Booking

```bash
POST /api/bookings
Content-Type: application/json
```

**Request Body:**
```json
{
  "busId": "507f1f77bcf86cd799439011",
  "seats": ["A1", "A2", "B1"],
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
    },
    {
      "name": "Bob Wilson",
      "age": 35,
      "gender": "Male"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Booking successful",
  "bookingId": "507f1f77bcf86cd799439012",
  "seatsBooked": ["A1", "A2", "B1"],
  "totalPrice": 3480,
  "status": "Confirmed"
}
```

**Error Response (400):**
```json
{
  "message": "Seats A1, A3 are already booked",
  "unavailableSeats": ["A1", "A3"]
}
```

---

### 2. Get Booking by ID

```bash
GET /api/bookings/507f1f77bcf86cd799439012
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "busId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Express Travels",
    "departureCity": "Mumbai",
    "arrivalCity": "Delhi"
  },
  "seats": ["A1", "A2", "B1"],
  "passengerDetails": [
    {
      "name": "John Doe",
      "age": 28,
      "gender": "Male"
    }
  ],
  "totalPrice": 3480,
  "status": "Confirmed",
  "createdAt": "2024-03-06T10:30:00.000Z",
  "updatedAt": "2024-03-06T10:30:00.000Z"
}
```

---

### 3. Get All Bookings for a Bus

```bash
GET /api/bookings/bus/507f1f77bcf86cd799439011?page=1&pageSize=10
```

**Response:**
```json
{
  "page": 1,
  "pageSize": 10,
  "totalBookings": 15,
  "totalPages": 2,
  "bookings": [...]
}
```

---

### 4. Cancel a Booking

```bash
PUT /api/bookings/507f1f77bcf86cd799439012/cancel
```

**Response:**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "busId": "507f1f77bcf86cd799439011",
    "seats": ["A1", "A2", "B1"],
    "passengerDetails": [...],
    "totalPrice": 3480,
    "status": "Cancelled",
    "createdAt": "2024-03-06T10:30:00.000Z",
    "updatedAt": "2024-03-06T10:45:00.000Z"
  }
}
```

---

## 🔒 Error Handling

The API returns appropriate HTTP status codes and error messages:

### Common Errors

**400 - Bad Request**
```json
{
  "message": "Missing required fields: busId, seats, passengerDetails"
}
```

**404 - Not Found**
```json
{
  "message": "Bus not found"
}
```

**500 - Server Error**
```json
{
  "message": "Error creating booking",
  "error": "Internal server error details"
}
```

---

## 📊 Database Models

### Bus Model
- `name`: String (required)
- `departureCity`: String (required, indexed)
- `arrivalCity`: String (required, indexed)
- `departureTime`: String (required)
- `arrivalTime`: String (required)
- `price`: Number (required)
- `totalSeats`: Number (required)
- `availableSeats`: Number (required)
- `isAC`: Boolean (default: false)
- `busType`: Enum (Normal, Semi-Sleeper, Sleeper)
- `departureSlot`: Enum (Morning, Afternoon, Evening, Night)
- `date`: String (required, indexed)
- `stops`: Array of stops
- `seatLayout`: Array of seats
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Booking Model
- `busId`: ObjectId (reference to Bus)
- `seats`: Array of seat numbers
- `passengerDetails`: Array of passenger objects
- `totalPrice`: Number
- `status`: Enum (Pending, Confirmed, Cancelled)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

## 🛠️ Development

### Adding New Fields

1. Update TypeScript interfaces in `src/types/`
2. Update MongoDB schema in `src/models/`
3. Update controller logic in `src/controllers/`

### Testing Endpoints

Use tools like:
- **Postman** - API testing GUI
- **cURL** - Command line
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

---

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/bus-booking
```

---

## 📄 License

ISC

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and add TypeScript types for all new features.

---

## 📞 Support

For issues or questions, please create an issue in the repository.
