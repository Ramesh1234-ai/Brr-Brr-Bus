import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Passenger, Booking } from "../../types/bus.types";
import { bookingAPI } from "../../services/api";
import Footer from "../common/Footer";

export default function BookingConfirmation() {
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [busId, setBusId] = useState("");

  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", age: 0, gender: "Male" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Load data from session storage
  useEffect(() => {
    const savedBusId = sessionStorage.getItem("selectedBusId");
    const savedSeats = sessionStorage.getItem("selectedSeats");
    const savedPrice = sessionStorage.getItem("totalPrice");

    if (!savedSeats || !savedBusId) {
      navigate("/buses");
      return;
    }

    setBusId(savedBusId);
    setSelectedSeats(JSON.parse(savedSeats));
    setTotalPrice(parseInt(savedPrice || "0"));

    // Initialize passengers array based on number of seats
    const seats = JSON.parse(savedSeats);
    setPassengers(
      seats.map(() => ({
        name: "",
        age: 0,
        gender: "Male" as const,
      }))
    );
  }, [navigate]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const updatedPassengers = [...passengers];
    if (field === "age") {
      updatedPassengers[index][field] = Number(value);
    } else if (field === "gender") {
      updatedPassengers[index][field] = value as 'Male' | 'Female' | 'Other';
    } else {
      updatedPassengers[index][field] = value as never;
    }
    setPassengers(updatedPassengers);
  };

  const validatePassengers = () => {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name.trim()) {
        setError(`Please enter name for passenger ${i + 1}`);
        return false;
      }
      if (passenger.age < 1 || passenger.age > 120) {
        setError(`Please enter valid age (1-120) for passenger ${i + 1}`);
        return false;
      }
      if (!passenger.gender) {
        setError(`Please select gender for passenger ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassengers()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        busId,
        seats: selectedSeats,
        passengerDetails: passengers,
      };

      const response = await bookingAPI.createBooking(bookingData as any);

      setBookingId(response.bookingId || "");
      setSuccess(true);

      // Clear session storage
      sessionStorage.removeItem("selectedBusId");
      sessionStorage.removeItem("selectedSeats");
      sessionStorage.removeItem("totalPrice");
    } catch {
      setError("Failed to confirm booking. Please try again.");
      console.error("Error confirming booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your bus ticket has been successfully booked.
              </p>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="text-lg font-semibold text-gray-900">{bookingId}</p>
                </div>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seats Booked</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Check your email for booking confirmation</li>
                  <li>✓ Download your e-ticket</li>
                  <li>✓ Reach the boarding point 30 minutes early</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 mb-3"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/buses")}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Details</h1>
          <p className="text-gray-600">
            Enter passenger details to confirm your booking
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <form onSubmit={handleConfirmBooking} className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Passenger Information
              </h2>

              <div className="space-y-8">
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="pb-8 border-b border-gray-200 last:pb-0 last:border-b-0"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Passenger {index + 1} (Seat: {selectedSeats[index]})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) =>
                            handlePassengerChange(index, "name", e.target.value)
                          }
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      {/* Age */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={passenger.age || ""}
                          onChange={(e) =>
                            handlePassengerChange(index, "age", e.target.value)
                          }
                          placeholder="Enter age"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender *
                        </label>
                        <div className="flex gap-6">
                          {["Male", "Female", "Other"].map((gender) => (
                            <label
                              key={gender}
                              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                              <input
                                type="radio"
                                name={`gender-${index}`}
                                value={gender}
                                checked={passenger.gender === gender}
                                onChange={(e) =>
                                  handlePassengerChange(index, "gender", e.target.value)
                                }
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-gray-700">{gender}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>

          {/* Booking Summary Sidebar */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Summary</h3>

              {/* Seats */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Seats</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Passengers Count */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-600 text-sm">Total Passengers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {passengers.length}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">₹{totalPrice}</p>
              </div>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  ℹ️ You will receive a confirmation email with your e-ticket and booking details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}