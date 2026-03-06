import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/navbar";
import Home from "./components/common/home";
import BusList from "./components/pages/BusList";
import Seat from "./components/pages/Seat";
import Book from "./components/pages/Booking";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/seats/:busId" element={<Seat />} />
          <Route path="/confirmation" element={<Book />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;