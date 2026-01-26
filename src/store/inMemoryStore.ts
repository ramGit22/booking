import { Booking } from '../models/booking';

// In-memory storage for bookings
const bookings: Map<string, Booking> = new Map();

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values());
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.get(id);
}

export function getBookingsByRoomId(roomId: string): Booking[] {
  const allBookings = getAllBookings();
  return allBookings.filter(b => b.roomId === roomId);
}

export function saveBooking(booking: Booking): void {
  bookings.set(booking.id, booking);
}

export function deleteBooking(id: string): boolean {
  return bookings.delete(id);
}
