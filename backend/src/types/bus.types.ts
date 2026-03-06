// Bus related types
export interface IBus {
  _id?: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isAC: boolean;
  busType: 'Normal' | 'Semi-Sleeper' | 'Sleeper';
  departureSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  date: string;
  stops: IStop[];
  seatLayout?: ISeat[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStop {
  stopName: string;
  arrivalTime: string;
  departureTime: string;
}

export interface ISeat {
  seatNumber: string;
  row: number;
  column: number;
  seatType: 'Normal' | 'Upper' | 'Lower';
  sleeperLevel?: 'Upper' | 'Lower';
  isAvailable: boolean;
  price: number;
}

export interface IBusQuery {
  departureCity?: string;
  arrivalCity?: string;
  date?: string;
  seatType?: string;
  isAC?: boolean;
  departureSlot?: string;
  page?: number;
  pageSize?: number;
}

export interface IBusPaginatedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalBuses: number;
  buses: IBus[];
}
