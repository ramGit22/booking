import { Router, Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

const router = Router();

function isValidDateString(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// Create a new booking
router.post('/bookings', (req: Request, res: Response) => {
  try {
    const { roomId, startTime, endTime, bookedBy } = req.body;

    // Validate required fields are non-empty strings
    if (!isNonEmptyString(roomId) || !isNonEmptyString(startTime) ||
        !isNonEmptyString(endTime) || !isNonEmptyString(bookedBy)) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate date formats
    if (!isValidDateString(startTime) || !isValidDateString(endTime)) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const booking = bookingService.createBooking({
      roomId,
      startTime,
      endTime,
      bookedBy
    });

    res.status(201).json(booking);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// Cancel a booking
router.delete('/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    bookingService.cancelBooking(id);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Booking not found') {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
});

// Get bookings for a room
router.get('/rooms/:roomId/bookings', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const bookings = bookingService.getBookingsForRoom(roomId);
  res.json(bookings);
});

export default router;
