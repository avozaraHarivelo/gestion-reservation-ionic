import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { Subscription } from 'rxjs';
import { ChangeReservationArg } from 'src/app/calendrier/change-reservation-arg';

@Component({
  selector: 'app-page-calendrier',
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

  constructor() {}

  ngOnInit() {}
}
