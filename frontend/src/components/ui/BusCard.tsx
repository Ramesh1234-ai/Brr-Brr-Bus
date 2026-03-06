import type { Bus } from "../../types/bus.types";
import { useNavigate } from "react-router-dom";

interface BusCardProps {
  bus: Bus;
}

export default function BusCard({ bus }: BusCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/seats/${bus._id}`);
  };

  // Format time to HH:MM
  const formatTime = (time: string) => {
    if (!time) return "N/A";
    return time.slice(0, 5);
  };

  // Calculate journey duration
  const calculateDuration = (departure: string, arrival: string) => {
    if (!departure || !arrival) return "N/A";
    const [depHour, depMin] = departure.split(":").map(Number);
    const [arrHour, arrMin] = arrival.split(":").map(Number);
    let durationMin = arrHour * 60 + arrMin - (depHour * 60 + depMin);
    if (durationMin < 0) durationMin += 24 * 60;
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <h3 className="text-lg font-bold">{bus.name}</h3>
        <p className="text-sm text-blue-100">{bus.busType} • {bus.isAC ? "AC" : "Non-AC"}</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Journey Timeline */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{formatTime(bus.departureTime)}</p>
            <p className="text-sm text-gray-600">{bus.departureCity}</p>
          </div>

          <div className="flex-1 text-center px-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              {calculateDuration(bus.departureTime, bus.arrivalTime)}
            </p>
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gray-300"></div>
              <svg
                className="w-5 h-5 text-gray-400 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </div>

          <div className="flex-1 text-right">
            <p className="text-2xl font-bold text-gray-900">{formatTime(bus.arrivalTime)}</p>
            <p className="text-sm text-gray-600">{bus.arrivalCity}</p>
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Available Seats</p>
            <p className="text-lg font-bold text-green-600">
              {bus.availableSeats}/{bus.totalSeats}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Departure Slot</p>
            <p className="text-lg font-bold text-blue-600">{bus.departureSlot}</p>
          </div>
        </div>

        {/* Price and Button Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price per Seat</p>
            <p className="text-3xl font-bold text-gray-900">₹{bus.price}</p>
          </div>

          <button
            onClick={handleBookNow}
            disabled={bus.availableSeats === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              bus.availableSeats === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {bus.availableSeats === 0 ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
