# Meeting Room Booking API

REST API for managing meeting room bookings.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Or build and run:
```bash
npm run build
npm start
```

The server runs on port 3000.

## API Endpoints

### Create a booking
```
POST /api/bookings
```

Request body:
```json
{
  "roomId": "room-1",
  "startTime": "2026-01-27T10:00:00Z",
  "endTime": "2026-01-27T11:00:00Z",
  "bookedBy": "user1"
}
```

### Cancel a booking
```
DELETE /api/bookings/:id
```

### List bookings for a room
```
GET /api/rooms/:roomId/bookings
```

## Business Rules

- Bookings cannot overlap for the same room
- Bookings cannot be made in the past
- Start time must be before end time

## Assumptions

- Room IDs are simple strings (e.g., "room-1", "conference-a")
- User identification is a simple string (no authentication)
- Time format uses ISO 8601 strings
- No minimum or maximum booking duration limits
- Data is stored in memory (resets on server restart)
