export class Room {
  roomId: number;
  roomNumber: string;
  roomType: number;
  roomTypeName: string;
  roomState:string;

  constructor() {
    this.roomId = 0;
    this.roomNumber = '';
    this.roomType = 0;
    this.roomTypeName = '';
    this.roomState = '';
  }
}
