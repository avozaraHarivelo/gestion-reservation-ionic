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
  private bookings: Booking[] = [
    // Liste de vos réservations locales
    {
      bookingId: 1,
      roomId: 1,
      startDate: new Date(2023, 6, 1), // Exemple de date de début (année, mois (indexé à partir de 0), jour)
      endDate: new Date(2023, 6, 5),   // Exemple de date de fin
      name: 'Réservation 1'           // Nom de la réservation
    },
    {
      bookingId: 2,
      roomId: 3,
      startDate: new Date(2023, 6, 10),
      endDate: new Date(2023, 6, 15),
      name: 'Réservation 2'
    },
    // Ajoutez d'autres réservations ici...
  ];

  constructor(private http: HttpClient) {}

  getRooms(): Observable<object> {
    let rooms: Room[];

    rooms = this.getAllRoom();

    return of(rooms);
  }


  getBookings(): Observable<Booking[]> {
    let bookings: Booking[];

    bookings = this.getAllBooking();

    return of(bookings);
  }

  // getReservations(args: ChangeReservationArg): Observable<object> {
  //   const res = new Reservation();

  //   let list1 = this.getAllRoom();
  //   if (args.roomtype !== 0) {
  //     list1 = list1.filter(l => l.roomType === args.roomtype);
  //   }
  //   res.rooms  = list1;

  //   let list2 = this.getAllBooking();
  //   if (args.roomtype !== 0) {
  //     list2 = list2.filter(l => l.roomType === args.roomtype);
  //   }
  //   res.bookings = list2;

  //   return of(res);
  // }

  // getReservationByName(args: SearchReservationArg): Observable<Person[]> {
  //   const persons = new Array<Person>();

  //   if (args.year === 0 && args.month === 0 && args.name === '') {
  //     return of(persons);
  //   }

  //   let list = this.getAllBooking();
  //   if (args.year !== 0) {
  //     list = list.filter(l => l.startDate.getFullYear() === args.year);
  //   }
  //   if (args.month !== 0) {
  //     list = list.filter(l => l.startDate.getMonth() === args.month - 1);
  //   }
  //   if (args.name !== '') {
  //     list = list.filter(l => l.name.startsWith(args.name) === true);
  //   }

  //   for (const b of list) {
  //     const p = new Person();
  //     p.bookingId = b.bookingId;
  //     p.roomId = b.roomId;
  //     p.roomType = b.roomType;
  //     p.roomNumber = this.getRoomById(p.roomId).roomNumber;
  //     p.roomTypeName = this.getRoomById(p.roomId).roomTypeName;
  //     p.roomState = this.getRoomById(p.roomId).roomState;

  //     p.startDate = b.startDate;
  //     p.endDate = b.endDate;
  //     p.stayDay = b.stayDay;
  //     p.name = b.name;
  //     persons.push(p);
  //   }

  //   return of(persons);
  // }

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
// console.log(booking)
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
    if (list.length === 0) {
      return 0; // Valeur par défaut si le tableau est vide
    }
  
    const bookingIds = list.map((p) => p.bookingId);
    return Math.max(...bookingIds);
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
  
    r.push(new Room(1, 'Chambre 101', 'Catégorie A', 'Simple'));
    r.push(new Room(2, 'Chambre 102', 'Catégorie B', 'Double'));
    r.push(new Room(3, 'Chambre 103', 'Catégorie A', 'Simple'));
    r.push(new Room(4, 'Chambre 104', 'Catégorie C', 'Suite'));
    r.push(new Room(5, 'Chambre 105', 'Catégorie B', 'Double'));
    r.push(new Room(6, 'Chambre 106', 'Catégorie A', 'Simple'));
  
    return r;
  }
  getAllBooking(): Booking[] {
    return this.bookings;
  }

  addBooking(booking: Booking): void {
    // Trouver la valeur maximale actuelle de l'ID dans la liste des réservations
    const maxId = this.bookings.reduce((max, booking) => (booking.bookingId > max ? booking.bookingId : max), 0);

    // Incrémenter l'ID de la nouvelle réservation
    booking.bookingId = maxId + 1;

    // Ajouter la réservation à la liste
    this.bookings.push(booking);
  }

  // private createBoking1(b:Booking[], y:number, m:number, bid:number) {
  //   let booking: Booking;

  //   booking = new Booking();
  //   booking.bookingId = bid;
  //   booking.roomId = 1;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 5);
  //   booking.endDate = new Date(y, m, 10);
  //   booking.stayDay = 5;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 2;
  //   booking.roomId = 1;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 15);
  //   booking.endDate = new Date(y, m, 20);
  //   booking.stayDay = 5;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 3;
  //   booking.roomId = 2;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 5);
  //   booking.endDate = new Date(y, m, 10);
  //   booking.stayDay = 5;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 5;
  //   booking.roomId = 2;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 15);
  //   booking.endDate = new Date(y, m, 20);
  //   booking.stayDay = 5;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 6;
  //   booking.roomId = 3;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 9);
  //   booking.endDate = new Date(y, m, 11);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 7;
  //   booking.roomId = 3;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 11);
  //   booking.endDate = new Date(y, m, 14);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 8;
  //   booking.roomId = 3;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 14);
  //   booking.endDate = new Date(y, m, 16);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 1;
  //   booking.roomId = 1;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 9;
  //   booking.roomId = 2;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 4;
  //   booking.roomId = 5;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 6;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personA-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 3;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 24);
  //   booking.endDate = new Date(y, m, 26);
  //   booking.stayDay = 1;
  //   booking.name = 'personC-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 8;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 24);
  //   booking.endDate = new Date(y, m, 26);
  //   booking.stayDay = 1;
  //   booking.name = 'personC-' + booking.bookingId;
  //   b.push(booking);
  // }

  // private createBoking2(b:Booking[], y:number, m:number, bid:number) {
  //   let booking: Booking;

  //   booking = new Booking();
  //   booking.bookingId = bid;
  //   booking.roomId = 4;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 5);
  //   booking.endDate = new Date(y, m, 10);
  //   booking.stayDay = 5;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 2;
  //   booking.roomId = 4;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 15);
  //   booking.endDate = new Date(y, m, 20);
  //   booking.stayDay = 5;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 3;
  //   booking.roomId = 5;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 5);
  //   booking.endDate = new Date(y, m, 10);
  //   booking.stayDay = 5;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 5;
  //   booking.roomId = 5;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 15);
  //   booking.endDate = new Date(y, m, 20);
  //   booking.stayDay = 5;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 6;
  //   booking.roomId = 9;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 9);
  //   booking.endDate = new Date(y, m, 11);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 7;
  //   booking.roomId = 9;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 11);
  //   booking.endDate = new Date(y, m, 14);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 8;
  //   booking.roomId = 9;
  //   booking.roomType = 2;
  //   booking.startDate = new Date(y, m, 14);
  //   booking.endDate = new Date(y, m, 16);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 1;
  //   booking.roomId = 1;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 4;
  //   booking.roomId = 2;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 9;
  //   booking.roomId = 6;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 7;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 12);
  //   booking.endDate = new Date(y, m, 13);
  //   booking.stayDay = 1;
  //   booking.name = 'personB-' + booking.bookingId;
  //   b.push(booking);

  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 3;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 24);
  //   booking.endDate = new Date(y, m, 26);
  //   booking.stayDay = 1;
  //   booking.name = 'personC-' + booking.bookingId;
  //   b.push(booking);
  //   booking = new Booking();
  //   booking.bookingId = bid + 10;
  //   booking.roomId = 8;
  //   booking.roomType = 1;
  //   booking.startDate = new Date(y, m, 24);
  //   booking.endDate = new Date(y, m, 26);
  //   booking.stayDay = 1;
  //   booking.name = 'personC-' + booking.bookingId;
  //   b.push(booking);
  // }
}
