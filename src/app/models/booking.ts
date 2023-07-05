export class Booking {
  bookingId: number;
  roomId: number;
  roomType: number;
  startDate: Date;
  endDate: Date;
  stayDay: number;
  name: string;

  constructor() {
    this.bookingId = 0;
    this.roomId = 0;
    this.roomType = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.stayDay = 0;
    this.name = '';
  }
}
