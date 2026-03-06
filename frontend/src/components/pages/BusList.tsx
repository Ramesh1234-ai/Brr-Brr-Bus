import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Bus, FilterOptions } from "../../types/bus.types";
import { busAPI } from "../../services/api";
import BusCard from "../ui/BusCard";
import FilterSidebar from "../ui/FilterSidebar";
import Footer from "../common/Footer";

export default function BusList() {
  const [searchParams] = useSearchParams();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<FilterOptions>({
    seatType: [],
    isAC: null,
    departureSlot: [],
    priceRange: [0, 5000],
  });

  const departureCity = searchParams.get("departureCity") || "";
  const arrivalCity = searchParams.get("arrivalCity") || "";
  const date = searchParams.get("date") || "";

  // Fetch buses on component mount or when search params change
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await busAPI.getBuses({
          departureCity,
          arrivalCity,
          date,
        });

        setBuses(data || []);
        setFilteredBuses(data || []);
      } catch {
        setError("Failed to fetch buses. Please try again later.");
        console.error("Error fetching buses");
      } finally {
        setLoading(false);
      }
    };

    if (departureCity && arrivalCity && date) {
      fetchBuses();
    }
  }, [departureCity, arrivalCity, date]);

  // Apply filters to buses
  useEffect(() => {
    let filtered = buses;

    // Filter by seat type
    if (filters.seatType.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.seatType.includes(bus.busType)
      );
    }

    // Filter by AC/Non-AC
    if (filters.isAC !== null) {
      filtered = filtered.filter((bus) => bus.isAC === filters.isAC);
    }

    // Filter by departure slot
    if (filters.departureSlot.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.departureSlot.includes(bus.departureSlot)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (bus) => bus.price >= filters.priceRange[0] && bus.price <= filters.priceRange[1]
    );

    // Sort by price (ascending)
    filtered.sort((a, b) => a.price - b.price);

    setFilteredBuses(filtered);
  }, [buses, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Buses</h1>
          <p className="text-gray-600">
            {departureCity} → {arrivalCity} • {date}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredBuses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 font-medium">
                  Showing {filteredBuses.length} bus{filteredBuses.length !== 1 ? "es" : ""}
                </p>
                {filteredBuses.map((bus) => (
                  <BusCard key={bus._id} bus={bus} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}