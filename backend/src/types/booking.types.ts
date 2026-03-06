// Booking related types
export interface IPassenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface IBooking {
  _id?: string;
  busId: string | any; // ObjectId from MongoDB
  seats: string[];
  passengerDetails: IPassenger[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookingRequest {
  busId: string;
  seats: string[];
  passengerDetails: IPassenger[];
}

export interface IBookingResponse {
  message: string;
  bookingId?: string;
  seatsBooked: string[];
  totalPrice: number;
  status: string;
}
