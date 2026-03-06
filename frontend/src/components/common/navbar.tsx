import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold">🚌</div>
            <div className="text-xl font-bold">BusBook</div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-8 items-center">
            <Link 
              to="/" 
              className="hover:text-blue-100 transition-colors font-medium text-sm sm:text-base"
            >
              Home
            </Link>
            <Link 
              to="/buses" 
              className="hover:text-blue-100 transition-colors font-medium text-sm sm:text-base"
            >
              Find Buses
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}