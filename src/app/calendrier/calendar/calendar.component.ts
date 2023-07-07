import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { ChangeReservationArg } from '../change-reservation-arg';
import { ReservationArg } from '../reservation-arg';
import { DateAndWeek, DateManager, StepHours } from '../date-manager';
import { HeaderDays } from '../models/header-days';
import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { ChangeDateArg } from '../change-date-arg';
import { StatusbarArg } from '../change-status-bar-arg';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {
  @Input() year: number = 0;
  @Input() month: number= 0;
  @Input() day: number = 0;
  @Input() rooms: Room[];
  @Input() bookings: Booking[];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  @ViewChild(CalendarNavbarComponent) navbar: any;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  headerdays: HeaderDays = new HeaderDays();
  statusbar: Booking = new Booking();
  manager: DateManager;


  constructor() { 
    this.manager = new DateManager();
    this.rooms = [];
    this.bookings = [];
  }

  get currentYMD(): Date {
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return new Date();
    }
  }

  ngOnInit() { }

  onDaysChanged(data: ChangeDateArg) {
    this.headerdays = data.days;
    const startDate = data.days.startDate;
    const endDate = data.days.endDate;
    const roomtype = data.roomtype;
    const args = new ChangeReservationArg(data.type, data.operation, roomtype, startDate, endDate);
    this.changereservation.emit(args);
  }

  onStatusbarChanged(args: StatusbarArg) {
    if (args.type === 'enter') {
      this.statusbar = args.booking;
    } else {
      this.statusbar = new Booking;
    }
  }

  onDayReservation(args: ReservationArg) {
    this.reservation.emit(args);
  }

}
