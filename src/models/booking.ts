export interface Booking {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  bookedBy: string;
  createdAt: Date;
}

export interface CreateBookingRequest {
  roomId: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
}
