import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {
  const navigate = useNavigate();
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!departureCity.trim()) {
      newErrors.departureCity = "Departure city is required";
    }
    if (!arrivalCity.trim()) {
      newErrors.arrivalCity = "Arrival city is required";
    }
    if (!date) {
      newErrors.date = "Date is required";
    }
    if (departureCity.trim() === arrivalCity.trim()) {
      newErrors.cities = "Departure and arrival cities must be different";
    }

    // Check if date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = "Please select a future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const searchParams = new URLSearchParams({
      departureCity: departureCity.trim(),
      arrivalCity: arrivalCity.trim(),
      date,
    });

    navigate(`/buses?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Find Your Bus
            </h1>
            <p className="text-xl text-gray-600">
              Easy, affordable, and reliable bus travel across the nation
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Departure City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Departure City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.departureCity
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={departureCity}
                  onChange={(e) => {
                    setDepartureCity(e.target.value);
                    if (errors.departureCity) {
                      setErrors((prev) => ({
                        ...prev,
                        departureCity: "",
                      }));
                    }
                  }}
                />
                {errors.departureCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.departureCity}</p>
                )}
              </div>

              {/* Arrival City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Arrival City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chennai, Hyderabad, Pune"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.arrivalCity
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={arrivalCity}
                  onChange={(e) => {
                    setArrivalCity(e.target.value);
                    if (errors.arrivalCity) {
                      setErrors((prev) => ({
                        ...prev,
                        arrivalCity: "",
                      }));
                    }
                  }}
                />
                {errors.arrivalCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.arrivalCity}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Travel
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.date
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) {
                    setErrors((prev) => ({
                      ...prev,
                      date: "",
                    }));
                  }
                }}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* General Error */}
            {errors.cities && (
              <p className="text-red-500 text-sm mb-4 text-center">{errors.cities}</p>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Search Buses
            </button>
          </form>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Guaranteed lowest fares on all routes</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">100% secure booking with verified operators</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600 text-sm">Get your ticket in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}