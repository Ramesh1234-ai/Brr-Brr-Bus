# Bus Booking Management System - Full Stack Setup Guide

## 📦 Project Structure
```
BBS/
├── backend/          → Node.js/Express/MongoDB API
├── frontend/         → React/TypeScript/TailwindCSS SPA
└── README.md         → This file
```

---

## 🗄️ DATABASE INFORMATION

### **Where is the Database?**

MongoDB is configured in **`backend/.env`**:
```env
MONGO_URI=mongodb://localhost:27017/bus-booking
```

**Database Name**: `bus-booking`  
**Default Host**: `localhost:27017`  
**Collections**:
- `buses` - Bus information with seat layouts
- `bookings` - Customer bookings

### **Option 1: Local MongoDB (Recommended for Development)**

#### Install MongoDB Community Edition
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

#### Start MongoDB Service
```bash
# Windows (Command Prompt as Admin)
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Verify Connection
```bash
mongosh
# You should see: Current Mongosh Log ID: ...
```

---

### **Option 2: Docker (Alternative)**

MongoDB is already containerized in `docker-compose.yml`:

```bash
cd backend

# Start MongoDB + Mongo Express UI
docker-compose up -d

# MongoDB: localhost:27017
# Mongo Express UI: http://localhost:8081
# Login: admin / pass
```

---

### **Option 3: MongoDB Atlas (Cloud)**

For production or cloud hosting, update `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-booking?retryWrites=true&w=majority
```

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Replace username/password with your credentials
4. Add your IP to network access whitelist

---

## 🚀 Quick Start (5 Minutes)

### **Backend Setup**

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Ensure MongoDB is running (see above)
# For Windows: net start MongoDB
# For Mac: brew services start mongodb-community

# 3. Seed sample data
npx tsx src/seed.ts

# You should see:
# ✅ MongoDB connected
# ✅ Created 5 sample buses
# 🚌 Express Travels...
# 🚌 Golden Coach...

# 4. Start server
npm run dev

# Server running at http://localhost:5000
```

### **Frontend Setup** (In separate terminal)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# Vite dev server at http://localhost:5173
# Browser will auto-open
```

---

## 📡 API Connection Status

✅ **Frontend → Backend**: Automatically configured in `src/services/api.ts`
- Base URL: `http://localhost:5000/api`
- All API calls will connect to backend

✅ **Backend → Database**: Configured in `backend/.env`
- MongoDB URI: `mongodb://localhost:27017/bus-booking`
- Connection via Mongoose ORM

---

## 📊 Test the Connection

### **From Backend Terminal**
```bash
curl http://localhost:5000/health
# Response: {"status":"OK","message":"Bus Booking API is running",...}
```

### **From Frontend (Browser Console)**
```javascript
const buses = await fetch('http://localhost:5000/api/buses?page=1').then(r => r.json());
console.log(buses);
// Should see array of 5 sample buses
```

---

## 🔍 Database Inspection

### **MongoDB Shell Commands**

```bash
# Connect to MongoDB
mongosh

# Inside MongoDB shell:
use bus-booking

# View all buses
db.buses.find().pretty()

# View all bookings
db.bookings.find().pretty()

# Count documents
db.buses.countDocuments()   # Should be 5
db.bookings.countDocuments()

# Search by city
db.buses.find({ departureCity: "Mumbai" })

# Exit
exit
```

### **Using Mongo Express UI (if Docker)**
- Open browser: http://localhost:8081
- Login: admin / pass
- Browse `bus-booking` database in left panel

---

## 📝 Available API Endpoints

### **Buses**
- `GET /api/buses` - List all buses (with filters)
- `GET /api/buses/:id` - Get specific bus
- `POST /api/buses` - Create new bus
- `PATCH /api/buses/:id/update-seats` - Update seat availability

### **Bookings**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/bus/:busId` - Get bookings for bus
- `PUT /api/bookings/:id/cancel` - Cancel booking

👉 Full API documentation: See [backend/README.md](backend/README.md)

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create `backend/.env` (or edit existing):

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/bus-booking

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

Already configured in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🛠️ Useful Commands

### Backend

```bash
cd backend

# Development
npm run dev          # Start with hot reload

# Production
npm run build        # Compile TypeScript
npm start            # Run compiled code

# Database
npm run seed         # Populate sample data
npx tsx src/seed.ts  # Alternative seed command

# Utility
npm install          # Install dependencies
npm update           # Update packages
```

### Frontend

```bash
cd frontend

# Development
npm run dev          # Start Vite dev server

# Production
npm run build        # Build for production
npm run preview      # Preview build

# Utility
npm install          # Install dependencies
```

---

## 🆘 Troubleshooting

### **MongoDB Connection Failed**

**Error**: `connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
1. Check MongoDB is installed: `mongosh --version`
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac: `brew services start mongodb-community`
3. Verify: `mongosh` should connect without error

### **Port 5000 Already in Use**

**Solution**:
```bash
# Change PORT in backend/.env to 5000-5999
# Or kill existing process:
lsof -ti:5000 | xargs kill -9  # Mac/Linux
# Windows: netstat -ano | findstr :5000
```

### **Frontend Can't Connect to Backend**

**Check**:
1. Backend running? `curl http://localhost:5000/health`
2. Correct API URL? Check `frontend/src/services/api.ts`
3. CORS enabled? Backend has CORS middleware enabled

### **Seed Script Fails**

**Solution**:
```bash
cd backend/src
npx tsx seed.ts

# Common error: "Cannot find module"
# Fix: npm install
```

---

## 📚 File Locations Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| **Database** | MongoDB at `localhost:27017` | Stores all bus & booking data |
| **Backend API** | `backend/src/` | Express server with routes |
| **Frontend App** | `frontend/src/` | React application |
| **Database Config** | `backend/.env` | MongoDB connection string |
| **API Config** | `frontend/src/services/api.ts` | Backend URL |
| **Sample Data** | `backend/src/seed.ts` | 5 sample buses |

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running (`mongosh` connects)
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Sample data seeded (5 buses visible in `db.buses.find()`)
- [ ] Backend server running (`npm run dev` shows startup banner)
- [ ] Backend health check passes (`curl http://localhost:5000/health`)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Frontend connecting to backend (no CORS errors)
- [ ] Can see buses on home page
- [ ] Can book a bus end-to-end

---

## 📖 Additional Documentation

- **Backend API Details**: [backend/README.md](backend/README.md)
- **Quick Start Guide**: [backend/QUICKSTART.md](backend/QUICKSTART.md)
- **TypeScript Types**: Backend: `backend/src/types/` | Frontend: `frontend/src/types/`
- **Database Models**: `backend/src/models/`

---

## 🎉 You're Ready!

1. Start MongoDB service
2. Run `npm run dev` in backend/
3. Run `npm run dev` in frontend/
4. Open http://localhost:5173 in browser
5. Search for buses, book seats, and confirm booking!

**Questions?** Check the troubleshooting section above.
# Brr-Brr-Bus
