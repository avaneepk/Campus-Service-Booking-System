import { SpaceType } from "./space.types";

// src/types/booking.types.ts
export interface TimeSlot {
    start: Date;
    end: Date;
  }
  
  export interface Booking {
    id: string;
    spaceId: string;
    userId: string;
    timeSlot: TimeSlot;
    purpose: string;
    attendees: number;
    status: 'pending' | 'confirmed' | 'canceled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateBookingData {
    spaceId: string;
    timeSlot: TimeSlot;
    purpose: string;
    attendees: number;
  }
  
  export interface BookingFilter {
    status?: Booking['status'];
    dateRange?: {
      start: Date;
      end: Date;
    };
    spaceType?: SpaceType;
  }