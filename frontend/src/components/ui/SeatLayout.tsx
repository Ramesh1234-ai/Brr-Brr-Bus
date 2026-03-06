import type { Seat } from "../../types/bus.types";

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatNumber: string) => void;
  busType: string;
}

export default function SeatLayout({
  seats,
  selectedSeats,
  onSeatSelect,
  busType,
}: SeatLayoutProps) {
  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);
    const isDisabled = !seat.isAvailable;

    let seatColor = "bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed";

    if (isDisabled) {
      seatColor = "bg-red-200 border-red-400 text-red-600 cursor-not-allowed";
    } else if (isSelected) {
      seatColor = "bg-green-500 border-green-600 text-white cursor-pointer hover:bg-green-600";
    } else {
      seatColor = "bg-blue-100 border-blue-400 text-blue-700 cursor-pointer hover:bg-blue-200";
    }

    return (
      <button
        key={seat.seatNumber}
        onClick={() => !isDisabled && onSeatSelect(seat.seatNumber)}
        disabled={isDisabled}
        className={`w-12 h-12 border-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${seatColor}`}
        title={`Seat ${seat.seatNumber} - ${seat.seatType} - ${isDisabled ? "Not Available" : isSelected ? "Selected" : "Available"}`}
      >
        {seat.seatNumber}
      </button>
    );
  };

  // Group seats by rows (arrange in grid)
  const rows: Seat[][] = [];
  let currentRow: Seat[] = [];

  seats.forEach((seat, index) => {
    currentRow.push(seat);
    if ((index + 1) % 4 === 0) {
      rows.push(currentRow);
      currentRow = [];
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Seats</h3>
        <p className="text-gray-600 text-sm">Bus Type: {busType}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
          <span className="text-sm text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-200 border-2 border-red-400 rounded"></div>
          <span className="text-sm text-gray-700">Unavailable</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="flex justify-center mb-8 overflow-x-auto">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="inline-block">
            {/* Screen indicator */}
            <div className="text-center mb-8">
              <div className="inline-block px-8 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold">
                ^ SCREEN ^
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-4">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 justify-center">
                  {row.map((seat) => renderSeat(seat))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Selected Seats</h4>
        {selectedSeats.length === 0 ? (
          <p className="text-gray-600 text-sm">No seats selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seatNumber) => (
              <span
                key={seatNumber}
                className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {seatNumber}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
