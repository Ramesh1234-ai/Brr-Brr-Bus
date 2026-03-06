import axios, { AxiosError } from 'axios';
import type { Bus, Booking, SearchParams } from '../types/bus.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 400) {
      const errorData = error.response.data as any;
      console.error('Validation Error (400):', errorData.message || errorData);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Bus related APIs
export const busAPI = {
  // Get all buses with optional filters
  getBuses: async (params?: SearchParams) => {
    try {
      const response = await apiClient.get<{ buses: Bus[] }>('/buses', { params });
      return response.data.buses || [];
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Get a specific bus by ID
  getBusById: async (busId: string) => {
    try {
      const response = await apiClient.get<Bus>(`/buses/${busId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bus with ID ${busId}:`, error);
      throw error;
    }
  },

  // Get seat layout for a specific bus
  getBusSeatLayout: async (busId: string) => {
    try {
      const response = await apiClient.get(`/buses/${busId}/seats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seat layout for bus ${busId}:`, error);
      throw error;
    }
  },
};

// Booking related APIs
export const bookingAPI = {
  // Create a new booking
  createBooking: async (booking: any) => {
    try {
      const response = await apiClient.post<any>('/bookings', booking);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId: string) => {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string) => {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      throw error;
    }
  },
};

export default apiClient;
