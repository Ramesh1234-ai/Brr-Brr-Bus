#!/bin/bash

# Bus Booking Backend - Useful Commands

# ============================================
# 🚀 DEVELOPMENT
# ============================================

# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# ============================================
# 📊 DATABASE
# ============================================

# Seed database with sample buses
npx tsx seed.ts

# Connect to MongoDB (if local)
mongosh

# ============================================
# 🧪 API TESTING - cURL Commands
# ============================================

# --- BUS ENDPOINTS ---

# Get all buses (paginated)
curl -X GET "http://localhost:5000/api/buses?page=1&pageSize=10"

# Get buses with filters
curl -X GET "http://localhost:5000/api/buses?departureCity=Mumbai&arrivalCity=Delhi&date=2024-03-15&page=1&pageSize=10"

# Get specific bus with seat layout
curl -X GET "http://localhost:5000/api/buses/607f1f77bcf86cd799439011"

# Create a new bus
curl -X POST "http://localhost:5000/api/buses" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

# --- BOOKING ENDPOINTS ---

# Create a booking
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "607f1f77bcf86cd799439011",
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

# Get booking details
curl -X GET "http://localhost:5000/api/bookings/607f1f77bcf86cd799439012"

# Get all bookings for a bus
curl -X GET "http://localhost:5000/api/bookings/bus/607f1f77bcf86cd799439011?page=1&pageSize=10"

# Cancel a booking
curl -X PUT "http://localhost:5000/api/bookings/607f1f77bcf86cd799439012/cancel"

# ============================================
# 📦 PACKAGE MANAGEMENT
# ============================================

# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated

# ============================================
# 🔍 DEBUGGING
# ============================================

# View server logs
tail -f logs/server.log

# Check if port 5000 is in use
lsof -i :5000

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# ============================================
# 📝 ENVIRONMENT SETUP
# ============================================

# Create .env file from example
cp .env.example .env

# Show current environment
cat .env

# ============================================
# 🏗️  BUILD & DEPLOYMENT
# ============================================

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# ============================================
# 📊 DATABASE QUERIES (mongosh)
# ============================================

# Connect to MongoDB
mongosh

# Inside MongoDB shell:
# Show all databases
show dbs

# Use a database
use bus-booking

# Show collections
show collections

# Query buses
db.buses.find()

# Query bookings
db.bookings.find()

# Count buses
db.buses.countDocuments()

# Find bus by ID (replace ID with actual)
db.buses.findOne({ _id: ObjectId("607f1f77bcf86cd799439011") })

# Update bus availability
db.buses.updateOne(
  { _id: ObjectId("607f1f77bcf86cd799439011") },
  { $set: { availableSeats: 10 } }
)

# Delete a bus (careful!)
db.buses.deleteOne({ _id: ObjectId("607f1f77bcf86cd799439011") })

# ============================================
# 📚 USEFUL LINKS
# ============================================

# API Documentation: http://localhost:5000/api/buses
# MongoDB Docs: https://docs.mongodb.com/
# Express Docs: https://expressjs.com/
# Mongoose Docs: https://mongoosejs.com/
# TypeScript Docs: https://www.typescriptlang.org/

# ============================================
# 🆘 TROUBLESHOOTING
# ============================================

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear MongoDB data
mongosh
use bus-booking
db.dropDatabase()

# Check TypeScript compilation
npm run build

# Test API connectivity
curl http://localhost:5000/health

# ============================================
# ✅ DEFAULT CREDENTIALS
# ============================================

# Default PORT: 5000
# Default MONGO_URI: mongodb://localhost:27017/bus-booking
# Default NODE_ENV: development
