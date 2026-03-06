import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Bus, Seat } from "../../types/bus.types";
import { busAPI } from "../../services/api";
import SeatLayout from "../ui/SeatLayout";
import Footer from "../common/Footer";

export default function SeatSelection() {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();

  const [bus, setBus] = useState<Bus | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bus details and seat layout
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        setError("");

        if (!busId) {
          setError("Bus ID not found");
          return;
        }

        const busData = await busAPI.getBusById(busId);
        setBus(busData);

        // Create sample seat layout if not provided by API
        if (busData.seatLayout) {
          setSeats(busData.seatLayout);
        } else {
          // Generate sample seats for demo
          const generateSeats = () => {
            const seatList: Seat[] = [];
            const rows = ["A", "B", "C", "D", "E", "F"];
            const cols = 4;
            const seatTypes = ["Normal", "Upper", "Lower"];

            rows.forEach((row) => {
              for (let col = 1; col <= cols; col++) {
                const seatNumber = `${row}${col}`;
                seatList.push({
                  seatNumber,
                  isAvailable: Math.random() > 0.3, // 70% available
                  seatType: (
                    seatTypes[Math.floor(Math.random() * seatTypes.length)]
                  ) as 'Normal' | 'Upper' | 'Lower',
                  price: busData.price,
                });
              }
            });

            return seatList;
          };

          setSeats(generateSeats());
        }
      } catch {
        setError("Failed to fetch bus details. Please try again.");
        console.error("Error fetching bus details");
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const calculateTotalPrice = () => {
    return selectedSeats.length * (bus?.price || 0);
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // Store selected data in session storage for next page
    sessionStorage.setItem("selectedBusId", busId || "");
    sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    sessionStorage.setItem("totalPrice", calculateTotalPrice().toString());

    navigate("/confirmation");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading seat layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header */}
        {bus && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Seat Selection</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Bus Name</p>
                  <p className="text-lg font-semibold text-gray-900">{bus.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Route</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bus.departureCity} → {bus.arrivalCity}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Travel Date</p>
                  <p className="text-lg font-semibold text-gray-900">{bus.date}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Price per Seat</p>
                  <p className="text-lg font-semibold text-blue-600">₹{bus.price}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <SeatLayout
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              busType={bus?.busType || "N/A"}
            />
          </div>

          {/* Booking Summary */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {/* Bus Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Bus Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-900">{bus?.name}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">
                      {bus?.departureTime} - {bus?.arrivalTime}
                    </span>
                  </p>
                  <p>{bus?.busType}</p>
                </div>
              </div>

              {/* Selected Seats */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Selected Seats</h4>
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-gray-500">No seats selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats: {selectedSeats.length}</span>
                    <span className="text-gray-900 font-medium">
                      ₹{bus ? selectedSeats.length * bus.price : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Fee</span>
                    <span className="text-gray-900 font-medium">₹0</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{calculateTotalPrice()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleProceedToBooking}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 mb-3 ${
                  selectedSeats.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105"
                }`}
              >
                Proceed to Booking
              </button>
              <button
                onClick={() => navigate("/buses")}
                className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Back to Buses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}