# Meeting Room Booking API - Implementation Plan

## Overview
Create a TypeScript/Node.js REST API for meeting room bookings as part of the [REDACTED] pre-assignment.

---

## Phase 1: AI-Generated Initial Implementation

### Code Characteristics (Realistic Junior Developer Style)
The initial code will contain typical issues that can be identified and fixed in Phase 2:
- Inconsistent error handling (some errors caught, others not)
- Basic but incomplete input validation
- Minor code duplication
- Some hardcoded values
- Missing edge case handling
- Inconsistent naming conventions in places
- Minimal comments/documentation

This approach gives meaningful material for the Phase 2 review and demonstrates critical thinking in the analysis.

### Technology Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Storage:** In-memory (JavaScript Map/Array)
- **Validation:** Manual validation logic

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| DELETE | `/api/bookings/:id` | Cancel a booking |
| GET | `/api/rooms/:roomId/bookings` | List bookings for a room |

### Data Models

```typescript
interface Booking {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;  // Assumption: track who made the booking
  createdAt: Date;
}
```

### Business Rules Implementation
1. **No overlapping bookings** - Check existing bookings for the room before creating
2. **No past bookings** - Validate startTime is in the future
3. **Start before end** - Validate startTime < endTime

### Project Structure
```
booking/
├── src/
│   ├── index.ts          # Entry point, Express server setup
│   ├── routes/
│   │   └── bookings.ts   # Booking route handlers
│   ├── services/
│   │   └── bookingService.ts  # Business logic
│   ├── models/
│   │   └── booking.ts    # Type definitions
│   └── store/
│       └── inMemoryStore.ts   # In-memory data storage
├── package.json
├── tsconfig.json
├── PROMPTIT.md           # AI conversation documentation
└── README.md             # Setup instructions
```

### Documented Assumptions
1. **Room identification:** Rooms are identified by string IDs (e.g., "room-1", "conference-a")
2. **User identification:** Simple string identifier for booker (no authentication)
3. **Time format:** ISO 8601 strings in API requests/responses
4. **Booking duration:** No minimum/maximum duration limits
5. **Room list:** No endpoint to list available rooms (only bookings)

---

## Phase 2: Human Refinement (Post AI-Generation)

Areas to review and potentially improve:
- Error handling consistency
- Input validation robustness
- Edge cases in overlap detection
- HTTP status codes correctness
- Code organization and separation of concerns
- Type safety improvements

---

## Files to Create

### Phase 1 (Initial AI Commit)
1. **package.json** - Dependencies and scripts
2. **tsconfig.json** - TypeScript configuration
3. **src/index.ts** - Express server setup
4. **src/routes/bookings.ts** - Route definitions
5. **src/services/bookingService.ts** - Business logic
6. **src/models/booking.ts** - TypeScript interfaces
7. **src/store/inMemoryStore.ts** - Data storage
8. **PROMPTIT.md** - This AI conversation (prompts + responses)
9. **README.md** - Setup and usage instructions

### Phase 3 (After Refinement)
10. **ANALYYSI.md** - Analysis document in Finnish

---

## Verification

### Manual Testing
```bash
# Start the server
npm run dev

# Create a booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-27T10:00:00Z", "endTime": "2026-01-27T11:00:00Z", "bookedBy": "user1"}'

# List bookings for a room
curl http://localhost:3000/api/rooms/room-1/bookings

# Cancel a booking
curl -X DELETE http://localhost:3000/api/bookings/{id}
```

### Test Scenarios
1. Create valid booking - should succeed
2. Create overlapping booking - should fail
3. Create booking in the past - should fail
4. Create booking with end before start - should fail
5. Cancel existing booking - should succeed
6. Cancel non-existent booking - should return 404
7. List bookings for room with bookings - should return list
8. List bookings for room without bookings - should return empty array

---

## Git Workflow

### Commit 1 (Phase 1)
```
Alkuperäinen AI-generoitu commit
```

### Subsequent Commits (Phase 2)
Each fix/improvement gets its own commit with descriptive Finnish message.
Examples:
- "refaktorointi: Virheenkäsittely yhtenäistetty"
- "korjaus: Lisätty puuttuva syötteiden validointi"

---

## Phase 3: Analysis (ANALYYSI.md)

After Phase 2 is complete, create `ANALYYSI.md` answering these questions **in Finnish**:

1. **Mitä tekoäly teki hyvin?** (What did the AI do well?)
2. **Mitä tekoäly teki huonosti?** (What did the AI do poorly?)
3. **Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?** (What were the most important improvements you made and why?)

---

## Important Notes

- **Repository naming:** Do NOT use "[REDACTED]" in the repository name or content
- **Commit history:** Never squash commits - full history is required for evaluation
- **PROMPTIT.md content:** Must contain this entire AI conversation (prompts and responses)
