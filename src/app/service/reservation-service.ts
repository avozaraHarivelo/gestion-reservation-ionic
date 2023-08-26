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
}
