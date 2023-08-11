import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { Subscription } from 'rxjs';
import { ChangeReservationArg } from 'src/app/calendrier/change-reservation-arg';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReservationService } from 'src/app/service/reservation-service';
import { Reservation } from 'src/app/models/reservation';
import { ReservationArg } from 'src/app/calendrier/reservation-arg';
import { FormReservationComponent } from '../form-reservation/form-reservation.component';

@Component({
  selector: 'app-pagescheduler',
  templateUrl: './page-calendrier.component.html',
  styleUrls: ['./page-calendrier.component.scss'],
})
export class PageCalendrierComponent implements OnInit {
  year: number = 0;
  month: number = 0;
  day: number = 0;
  currentsearch: ChangeReservationArg = new ChangeReservationArg(
    'type value',
    '',
    0,
    new Date(),
    new Date()
  );
  sub: Subscription = new Subscription();
  rooms: Room[] = [];
  bookings: Booking[] = [];

  constructor(private dialog: MatDialog, private service: ReservationService, private cd: ChangeDetectorRef) {
    // const d = new Date();
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth();
    this.day = d.getDate();
    this.rooms = [];
    this.bookings = [];
   }

  ngOnInit() { }

  // onReservationChanged(args: ChangeReservationArg) {
  //   this.currentsearch = args;
  //   if (this.sub) {
  //     this.sub.unsubscribe();
  //     this.sub = new Subscription();
  //   }
  //   this.sub = this.service.getReservations(args).subscribe(result => {
  //     const r = result as Reservation;
  //     this.rooms = r.rooms;
  //     this.bookings = r.bookings;
  //     this.cd.detectChanges();
  //   });
  // }

  // onDayReservation(args: ReservationArg) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '600px';
  //   dialogConfig.height = '550px';
  //   const list = this.service.getRooms();
  //   dialogConfig.data = { roomid: args.roomid, date: args.date, booking: args.booking, rooms: list };
  //   const dialogRef = this.dialog.open(FormReservationComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(data => {
  //     if (data === 'ok') {
  //       this.onReservationChanged(this.currentsearch);
  //     }
  //     if (data === 'no') {
  //     }
  //   });
  // }
}
