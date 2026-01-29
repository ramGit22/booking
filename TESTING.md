# Manual Testing Guide

This document provides comprehensive testing instructions for the Meeting Room Booking API.

## Prerequisites

1. **Start the server:**
```bash
npm install
npm run dev
```

Server will start on `http://localhost:3000`

2. **Verify server is running:**
```bash
curl http://localhost:3000/api/rooms/test/bookings
```
Expected: `[]` (empty array)

---

## Core Test Scenarios

### ✅ Test 1: Create Valid Booking

**Purpose:** Verify successful booking creation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user1"}'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "roomId": "room-1",
  "startTime": "2026-01-30T10:00:00.000Z",
  "endTime": "2026-01-30T11:00:00.000Z",
  "bookedBy": "user1",
  "createdAt": "2026-01-29T..."
}
```
**Expected Status:** `201 Created`

**Note:** Save the `id` value for later tests!

---

### ✅ Test 2: Overlapping Booking (Should Fail)

**Purpose:** Verify overlap validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:30:00Z", "endTime": "2026-01-30T11:30:00Z", "bookedBy": "user2"}'
```

**Expected Response:**
```json
{
  "error": "Booking overlaps with existing booking"
}
```
**Expected Status:** `400 Bad Request`

---

### ✅ Test 3: Past Booking (Should Fail)

**Purpose:** Verify past date validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-2", "startTime": "2024-01-01T10:00:00Z", "endTime": "2024-01-01T11:00:00Z", "bookedBy": "user3"}'
```

**Expected Response:**
```json
{
  "error": "Cannot create booking in the past"
}
```
**Expected Status:** `400 Bad Request`

---

### ✅ Test 4: End Before Start (Should Fail)

**Purpose:** Verify time logic validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-3", "startTime": "2026-01-30T15:00:00Z", "endTime": "2026-01-30T14:00:00Z", "bookedBy": "user4"}'
```

**Expected Response:**
```json
{
  "error": "Start time must be before end time"
}
```
**Expected Status:** `400 Bad Request`

---

### ✅ Test 5: Cancel Existing Booking

**Purpose:** Verify successful cancellation

**Replace `BOOKING_ID` with the ID from Test 1:**

```bash
curl -X DELETE http://localhost:3000/api/bookings/BOOKING_ID
```

**Expected Response:** No body (empty)
**Expected Status:** `204 No Content`

---

### ✅ Test 6: Cancel Non-Existent Booking (Should Fail)

**Purpose:** Verify 404 handling

```bash
curl -X DELETE http://localhost:3000/api/bookings/non-existent-id-12345
```

**Expected Response:**
```json
{
  "error": "Booking not found"
}
```
**Expected Status:** `404 Not Found`

---

### ✅ Test 7: List Bookings for Room

**Purpose:** Verify listing functionality

**First, create two bookings:**

```bash
# Booking 1
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "conference-a", "startTime": "2026-01-30T09:00:00Z", "endTime": "2026-01-30T10:00:00Z", "bookedBy": "alice"}'

# Booking 2
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "conference-a", "startTime": "2026-01-30T14:00:00Z", "endTime": "2026-01-30T15:00:00Z", "bookedBy": "bob"}'
```

**Then list them:**

```bash
curl http://localhost:3000/api/rooms/conference-a/bookings
```

**Expected Response:** Array with 2 bookings
```json
[
  {
    "id": "...",
    "roomId": "conference-a",
    "startTime": "2026-01-30T09:00:00.000Z",
    "endTime": "2026-01-30T10:00:00.000Z",
    "bookedBy": "alice",
    "createdAt": "..."
  },
  {
    "id": "...",
    "roomId": "conference-a",
    "startTime": "2026-01-30T14:00:00.000Z",
    "endTime": "2026-01-30T15:00:00.000Z",
    "bookedBy": "bob",
    "createdAt": "..."
  }
]
```
**Expected Status:** `200 OK`

---

### ✅ Test 8: List Empty Room

**Purpose:** Verify empty result handling

```bash
curl http://localhost:3000/api/rooms/empty-room/bookings
```

**Expected Response:**
```json
[]
```
**Expected Status:** `200 OK`

---

## Edge Case Tests

### Test 9: Invalid JSON

**Purpose:** Verify JSON parsing error handling

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{invalid json'
```

**Expected Response:**
```json
{
  "error": "Invalid JSON"
}
```
**Expected Status:** `400 Bad Request`

---

### Test 10: Empty String Validation

**Purpose:** Verify empty field rejection

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user"}'
```

**Expected Response:**
```json
{
  "error": "Missing required fields"
}
```
**Expected Status:** `400 Bad Request`

---

### Test 11: Whitespace-Only String

**Purpose:** Verify trimmed validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "   "}'
```

**Expected Response:**
```json
{
  "error": "Missing required fields"
}
```
**Expected Status:** `400 Bad Request`

---

### Test 12: Invalid Date Format

**Purpose:** Verify date format validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-5", "startTime": "not-a-date", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user"}'
```

**Expected Response:**
```json
{
  "error": "Invalid date format"
}
```
**Expected Status:** `400 Bad Request`

---

### Test 13: Missing Required Fields

**Purpose:** Verify required field validation

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1"}'
```

**Expected Response:**
```json
{
  "error": "Missing required fields"
}
```
**Expected Status:** `400 Bad Request`

---

## Automated Test Script

Save this as `test.sh` for quick testing:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "========================================="
echo "Meeting Room Booking API - Test Suite"
echo "========================================="
echo ""

echo "Test 1: Create valid booking"
curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user1"}' | jq .
echo -e "\n"

echo "Test 2: Overlapping booking (should fail)"
curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:30:00Z", "endTime": "2026-01-30T11:30:00Z", "bookedBy": "user2"}' | jq .
echo -e "\n"

echo "Test 3: Past booking (should fail)"
curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-2", "startTime": "2024-01-01T10:00:00Z", "endTime": "2024-01-01T11:00:00Z", "bookedBy": "user3"}' | jq .
echo -e "\n"

echo "Test 4: End before start (should fail)"
curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-3", "startTime": "2026-01-30T15:00:00Z", "endTime": "2026-01-30T14:00:00Z", "bookedBy": "user4"}' | jq .
echo -e "\n"

echo "Test 5: List bookings for room-1"
curl -s $BASE_URL/api/rooms/room-1/bookings | jq .
echo -e "\n"

echo "Test 6: Invalid date format (should fail)"
curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-5", "startTime": "not-a-date", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user"}' | jq .
echo -e "\n"

echo "========================================="
echo "Test Suite Complete"
echo "========================================="
```

Run with: `bash test.sh`

**Note:** Requires `jq` for JSON formatting. Install with:
- macOS: `brew install jq`
- Linux: `apt-get install jq`
- Windows: Download from https://stedolan.github.io/jq/

---

## Windows PowerShell Version

```powershell
$BASE_URL = "http://localhost:3000"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Meeting Room Booking API - Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`nTest 1: Create valid booking" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/api/bookings" -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"roomId": "room-1", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user1"}' | ConvertTo-Json

Write-Host "`nTest 2: Overlapping booking (should fail)" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "$BASE_URL/api/bookings" -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"roomId": "room-1", "startTime": "2026-01-30T10:30:00Z", "endTime": "2026-01-30T11:30:00Z", "bookedBy": "user2"}'
} catch {
  Write-Host $_.ErrorDetails.Message
}

Write-Host "`nTest 3: List bookings" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/api/rooms/room-1/bookings" -Method Get | ConvertTo-Json

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
```

Run with: `.\test.ps1`

---

## Test Summary Checklist

- [ ] Server starts without errors
- [ ] Create valid booking returns 201
- [ ] Overlapping booking fails with 400
- [ ] Past booking fails with 400
- [ ] End before start fails with 400
- [ ] Cancel existing booking returns 204
- [ ] Cancel non-existent booking returns 404
- [ ] List bookings returns array
- [ ] List empty room returns empty array
- [ ] Invalid JSON fails with 400
- [ ] Empty string validation works
- [ ] Invalid date format fails with 400
- [ ] Missing fields fails with 400

---

## Notes

- **Dates:** Use future dates (2026 or later) for valid bookings
- **UUIDs:** Booking IDs are randomly generated UUIDs
- **In-memory:** All data is lost when server restarts
- **Port:** Default is 3000, configurable via `PORT` environment variable
