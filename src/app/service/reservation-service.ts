import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { Booking } from "../models/booking";
import { Room } from "../models/room";
import { ChangeReservationArg } from "../calendrier/change-reservation-arg";
import { Reservation } from "../models/reservation";
import { Person } from "../models/person";
import { SearchReservationArg } from "../calendrier/search-reservation-arg";


@Injectable()
export class ReservationService {
  bookings: Booking[]= [];

  constructor(private http: HttpClient) {}

  getRooms(): Observable<object> {
    let rooms: Room[];

    rooms = this.getAllRoom();

    return of(rooms);
  }

  getReservations(args: ChangeReservationArg): Observable<object> {
    const res = new Reservation();

    let list1 = this.getAllRoom();
    if (args.roomtype !== 0) {
      list1 = list1.filter(l => l.roomType === args.roomtype);
    }
    res.rooms  = list1;

    let list2 = this.getAllBooking();
    if (args.roomtype !== 0) {
      list2 = list2.filter(l => l.roomType === args.roomtype);
    }
    res.bookings = list2;

    return of(res);
  }

  getReservationByName(args: SearchReservationArg): Observable<object> {
    const persons = new Array<Person>();

    if (args.year === 0 && args.month === 0 && args.name === '') {
      return of(persons);
    }

    let list = this.getAllBooking();
    if (args.year !== 0) {
      list = list.filter(l => l.startDate.getFullYear() === args.year);
    }
    if (args.month !== 0) {
      list = list.filter(l => l.startDate.getMonth() === args.month - 1);
    }
    if (args.name !== '') {
      list = list.filter(l => l.name.startsWith(args.name) === true);
    }

    for (const b of list) {
      const p = new Person();
      p.bookingId = b.bookingId;
      p.roomId = b.roomId;
      p.roomType = b.roomType;
      p.roomNumber = this.getRoomById(p.roomId).roomNumber;
      p.roomTypeName = this.getRoomById(p.roomId).roomTypeName;
      p.startDate = b.startDate;
      p.endDate = b.endDate;
      p.stayDay = b.stayDay;
      p.name = b.name;
      persons.push(p);
    }

    return of(persons);
  }

  insertReservation(booking: Booking): Observable<string> {
    const list = this.getAllBooking();

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + booking.startDate.toString());
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + booking.endDate.toString());
        }
      }
    }
    booking.bookingId = this.maxValue(list) + 1;
    list.push(booking);

    return of('ok');
  }

  updateReservation(booking: Booking): Observable<string> {
    const list = this.getAllBooking();

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + this.formatGMY(booking.startDate));
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + this.formatGMY(booking.endDate));
        }
      }
    }
    const index = list.findIndex(x => x.bookingId === booking.bookingId);
    list[index] = booking;

    return of('ok');
  }

  deleteReservation(id: number): Observable<string> {
    const list = this.getAllBooking();

    const index = list.findIndex(x => x.bookingId === id);
    list.splice(index, 1);

    return of('ok');
  }

  private formatGMY(date: Date): string {
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }

  private maxValue(list: Booking[]): number {
    return list.reduce((max, p) => p.bookingId > max ? p.bookingId : max, list[0].bookingId);
  }

  private cloneBooking(list: Booking[]): Booking[] {
    const a = new Array<Booking>();
    for (const b of list) {
      a.push(b);
    }
    return a;
  }

  private getRoomById(value: number): Room {
    const list = this.getAllRoom();
    const r = list.filter(l => l.roomId === value)[0];
    return r;
  }

  private getAllRoom(): Room[] {
    const r = new Array<Room>();
    let room: Room;

    room = new Room();
    room.roomId = 1;
    room.roomNumber = '100';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 2;
    room.roomNumber = '101';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 3;
    room.roomNumber = '102';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 4;
    room.roomNumber = '104';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);
    room = new Room();
    room.roomId = 5;
    room.roomNumber = '105';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);

    room = new Room();
    room.roomId = 6;
    room.roomNumber = '200';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 7;
    room.roomNumber = '201';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 8;
    room.roomNumber = '202';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 9;
    room.roomNumber = '204';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);
    room = new Room();
    room.roomId = 10;
    room.roomNumber = '205';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);

    room = new Room();
    room.roomId = 11;
    room.roomNumber = '300';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 12;
    room.roomNumber = '301';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 13;
    room.roomNumber = '302';
    room.roomType = 1;
    room.roomTypeName = 'Single';
    r.push(room);
    room = new Room();
    room.roomId = 14;
    room.roomNumber = '304';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);
    room = new Room();
    room.roomId = 15;
    room.roomNumber = '305';
    room.roomType = 2;
    room.roomTypeName = 'Double';
    r.push(room);

    return r;
  }

  private getAllBooking(): Booking[] {
    if (this.bookings) {
      return this.bookings;
    }
    const b = new Array<Booking>();
    this.bookings = b;

    let index = 1;
    for (let y = 2018; y < 2020; ++y) {
      for (let m = 0; m < 12; ++m) {
        if ((m % 2) === 1) {
          this.createBoking1(b, y, m, index);
        } else {
          this.createBoking2(b, y, m, index);
        }
        index = index + 13;
      }
    }

    return b;
  }

  private createBoking1(b:Booking[], y:number, m:number, bid:number) {
    let booking: Booking;

    booking = new Booking();
    booking.bookingId = bid;
    booking.roomId = 1;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 2;
    booking.roomId = 1;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 3;
    booking.roomId = 2;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 5;
    booking.roomId = 2;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 6;
    booking.roomId = 3;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 9);
    booking.endDate = new Date(y, m, 11);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 7;
    booking.roomId = 3;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 11);
    booking.endDate = new Date(y, m, 14);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 8;
    booking.roomId = 3;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 14);
    booking.endDate = new Date(y, m, 16);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 1;
    booking.roomId = 1;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 9;
    booking.roomId = 2;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 4;
    booking.roomId = 5;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 6;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 3;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 8;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
  }

  private createBoking2(b:Booking[], y:number, m:number, bid:number) {
    let booking: Booking;

    booking = new Booking();
    booking.bookingId = bid;
    booking.roomId = 4;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 2;
    booking.roomId = 4;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 3;
    booking.roomId = 5;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 5;
    booking.roomId = 5;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 6;
    booking.roomId = 9;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 9);
    booking.endDate = new Date(y, m, 11);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 7;
    booking.roomId = 9;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 11);
    booking.endDate = new Date(y, m, 14);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 8;
    booking.roomId = 9;
    booking.roomType = 2;
    booking.startDate = new Date(y, m, 14);
    booking.endDate = new Date(y, m, 16);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 1;
    booking.roomId = 1;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 4;
    booking.roomId = 2;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 9;
    booking.roomId = 6;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 7;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 3;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
    booking = new Booking();
    booking.bookingId = bid + 10;
    booking.roomId = 8;
    booking.roomType = 1;
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
  }
}
