import type { FilterOptions } from "../../types/bus.types";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleSeatTypeChange = (seatType: string) => {
    const updatedSeatTypes = filters.seatType.includes(seatType)
      ? filters.seatType.filter((s) => s !== seatType)
      : [...filters.seatType, seatType];

    onFiltersChange({
      ...filters,
      seatType: updatedSeatTypes,
    });
  };

  const handleACToggle = () => {
    onFiltersChange({
      ...filters,
      isAC: filters.isAC === null ? true : filters.isAC === true ? false : null,
    });
  };

  const handleDepartureSlotChange = (slot: string) => {
    const updatedSlots = filters.departureSlot.includes(slot)
      ? filters.departureSlot.filter((s) => s !== slot)
      : [...filters.departureSlot, slot];

    onFiltersChange({
      ...filters,
      departureSlot: updatedSlots,
    });
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      onFiltersChange({
        ...filters,
        priceRange: [value, filters.priceRange[1]],
      });
    } else {
      onFiltersChange({
        ...filters,
        priceRange: [filters.priceRange[0], value],
      });
    }
  };

  const resetFilters = () => {
    onFiltersChange({
      seatType: [],
      isAC: null,
      departureSlot: [],
      priceRange: [0, 5000],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset
        </button>
      </div>

      {/* Seat Type Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Seat Type</h3>
        <div className="space-y-2">
          {["Normal", "Semi-Sleeper", "Sleeper"].map((seatType) => (
            <label key={seatType} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.seatType.includes(seatType)}
                onChange={() => handleSeatTypeChange(seatType)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{seatType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AC / Non-AC Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Air Conditioning</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="ac"
              checked={filters.isAC === null}
              onChange={handleACToggle}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Any</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="ac"
              checked={filters.isAC === true}
              onChange={() => {
                if (filters.isAC !== true) {
                  onFiltersChange({ ...filters, isAC: true });
                }
              }}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">AC</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="ac"
              checked={filters.isAC === false}
              onChange={() => {
                if (filters.isAC !== false) {
                  onFiltersChange({ ...filters, isAC: false });
                }
              }}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Non-AC</span>
          </label>
        </div>
      </div>

      {/* Departure Slot Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Departure Slot</h3>
        <div className="space-y-2">
          {["Morning", "Afternoon", "Evening", "Night"].map((slot) => (
            <label key={slot} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.departureSlot.includes(slot)}
                onChange={() => handleDepartureSlotChange(slot)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{slot}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-2">Min: ₹{filters.priceRange[0]}</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange("min", Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-2">Max: ₹{filters.priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange("max", Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-900 mb-2">Active Filters:</p>
        <div className="flex flex-wrap gap-2">
          {filters.seatType.map((st) => (
            <span key={st} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
              {st}
            </span>
          ))}
          {filters.isAC !== null && (
            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
              {filters.isAC ? "AC" : "Non-AC"}
            </span>
          )}
          {filters.departureSlot.map((slot) => (
            <span key={slot} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
              {slot}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
