// src/services/bookingService.ts
import api from './api';
import { Booking, CreateBookingData, BookingFilter } from '../types/booking.types';

export const bookingService = {
  async getBookings(filter?: BookingFilter): Promise<Booking[]> {
    const response = await api.get('/bookings', { params: filter });
    return response.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  async updateBooking(id: string, data: Partial<CreateBookingData>): Promise<Booking> {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  async getUserBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings/user');
    return response.data;
  },
};