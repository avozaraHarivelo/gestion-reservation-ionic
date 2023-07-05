import { Booking } from './booking';
import { Room } from './room';

export class Reservation {
  rooms: Room[];
  bookings: Booking[];

  constructor() {
    this.rooms = [];
    this.bookings = [];
  }
}
