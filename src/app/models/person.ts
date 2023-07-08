export class Person {
  bookingId: number;
  roomId: number;
  roomNumber: string;
  roomType: number;
  roomTypeName: string;
  roomState: string;
  startDate: Date;
  endDate: Date;
  stayDay: number;
  name: string;

  constructor() {
    this.bookingId = 0;
    this.roomId = 0;
    this.roomNumber = '';
    this.roomType = 0;
    this.roomTypeName = '';
    this.roomState = '';
    this.startDate = new Date();
    this.endDate = new Date();
    this.stayDay = 0;
    this.name = '';
  }
}
