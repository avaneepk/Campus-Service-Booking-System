// src/contexts/BookingContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, CreateBookingData } from '../types/booking.types';
import { useAuth } from '../hooks/useAuth';

interface BookingContextType {
  userBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

export const BookingContext = createContext<BookingContextType>({
  userBookings: [],
  isLoading: false,
  error: null,
  createBooking: async () => ({ id: '', spaceId: '', userId: '', timeSlot: { start: new Date(), end: new Date() }, purpose: '', attendees: 0, status: 'pending', createdAt: new Date(), updatedAt: new Date() }),
  cancelBooking: async () => {},
  refreshBookings: async () => {},
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchUserBookings = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const bookings = await bookingService.getUserBookings();
      setUserBookings(bookings);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [isAuthenticated]);

  const createBooking = async (data: CreateBookingData): Promise<Booking> => {
    try {
      setIsLoading(true);
      setError(null);
      const newBooking = await bookingService.createBooking(data);
      await fetchUserBookings();
      return newBooking;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await bookingService.cancelBooking(id);
      await fetchUserBookings();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to cancel booking';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        userBookings,
        isLoading,
        error,
        createBooking,
        cancelBooking,
        refreshBookings: fetchUserBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};