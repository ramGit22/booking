import { v4 as uuidv4 } from 'uuid';
import { Booking, CreateBookingRequest } from '../models/booking';
import * as store from '../store/inMemoryStore';

export function createBooking(request: CreateBookingRequest): Booking {
  const startTime = new Date(request.startTime);
  const endTime = new Date(request.endTime);

  // Validate that start time is before end time
  if (startTime >= endTime) {
    throw new Error('Start time must be before end time');
  }

  // Validate that booking is not in the past
  if (startTime < new Date()) {
    throw new Error('Cannot create booking in the past');
  }

  // Check for overlapping bookings
  const existingBookings = store.getBookingsByRoomId(request.roomId);
  for (let i = 0; i < existingBookings.length; i++) {
    const existing = existingBookings[i];
    if (startTime < existing.endTime && endTime > existing.startTime) {
      throw new Error('Booking overlaps with existing booking');
    }
  }

  const booking: Booking = {
    id: uuidv4(),
    roomId: request.roomId,
    startTime: startTime,
    endTime: endTime,
    bookedBy: request.bookedBy,
    createdAt: new Date()
  };

  store.saveBooking(booking);
  return booking;
}

export function cancelBooking(id: string): void {
  const booking = store.getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }
  store.deleteBooking(id);
}

export function getBookingsForRoom(roomId: string): Booking[] {
  return store.getBookingsByRoomId(roomId);
}
