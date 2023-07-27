export class Booking {
  bookingId: number;
  roomId: number;
  startDate: Date;
  endDate: Date;
  name: string;

  constructor() {
    this.bookingId = 0;
    this.roomId = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.name = '';
  }
}
