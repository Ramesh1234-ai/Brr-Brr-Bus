// Bus and Booking related types
export interface Bus {
  _id: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  busType: 'Normal' | 'Semi-Sleeper' | 'Sleeper';
  isAC: boolean;
  departureSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  date: string;
  seatLayout?: Seat[];
}

export interface Seat {
  seatNumber: string;
  isAvailable: boolean;
  seatType: 'Normal' | 'Upper' | 'Lower';
  price: number;
}

export interface SearchParams {
  departureCity: string;
  arrivalCity: string;
  date: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Booking {
  _id?: string;
  busId: string;
  passengers: Passenger[];
  selectedSeats: string[];
  totalPrice: number;
  bookingDate: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface FilterOptions {
  seatType: string[];
  isAC: boolean | null;
  departureSlot: string[];
  priceRange: [number, number];
}
