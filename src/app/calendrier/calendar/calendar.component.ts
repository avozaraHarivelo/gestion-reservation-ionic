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
  @Input() statusbar: Booking = new Booking();
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

   getRandomNumberFromArray(): number {
    const numbers: number[] = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    const randomIndex: number = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
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

  isReserved(room: Room, day: DateAndWeek): boolean {
    return this.bookings.some(b => b.roomId === room.roomId && day.date >= b.startDate && day.date <= b.endDate);
  }
  
  isFirstDayOfReservation(room: Room, day: DateAndWeek): boolean {
    return this.bookings.some(b => b.roomId === room.roomId && day.date.getTime() === b.startDate.getTime());
  }
  
  getColspan(room: Room, day: DateAndWeek): number {
    const booking = this.bookings.find(b => b.roomId === room.roomId && day.date >= b.startDate && day.date <= b.endDate);
    if (booking) {
      const duration = booking.endDate.getTime() - booking.startDate.getTime();
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      return days + 1;
    }
    return 1;
  }
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
