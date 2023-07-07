import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Room } from 'src/app/models/room';
import { DateAndWeek } from '../date-manager';
import { Booking } from 'src/app/models/booking';
import { StatusbarArg } from '../change-status-bar-arg';
import { ReservationArg } from '../reservation-arg';

@Component({
  selector: 'app-canlendrier-reservation',
  templateUrl: './canlendrier-reservation.component.html',
  styleUrls: ['./canlendrier-reservation.component.scss'],
})
export class CanlendrierReservationComponent  implements OnInit {

  @Input() room: Room = new Room();
  @Input() day: DateAndWeek = new DateAndWeek();
  @Input() bookings: Booking[] = [];
  @Output() changestatusbar = new EventEmitter<StatusbarArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  isreserved = false;
  isreservedSx = false;
  isreservedCx = false;
  isreservedDx = false;
  booking: Booking= new Booking();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookings']) {
      this.datasourceChanged();
    }
  }

  onMouseEnter(b: Booking) {
    const args = new StatusbarArg('enter', b);
    this.changestatusbar.emit(args);
  }

  onMouseLeave(b: Booking) {
    const args = new StatusbarArg('leave', b);
    this.changestatusbar.emit(args);
  }

  onDayReservation(mouse: MouseEvent) {
    const b = new Booking();
    if (this.booking) {
      b.bookingId = this.booking.bookingId;
      b.roomId = this.booking.roomId;
      b.roomType = this.booking.roomType;
      b.startDate = new Date(this.booking.startDate);
      b.endDate = new Date(this.booking.endDate);
      b.stayDay = this.booking.stayDay;
      b.name = this.booking.name;
    }
    const args = new ReservationArg(this.room.roomId, this.day.date, b);
    this.reservation.emit(args);
  }

  private datasourceChanged() {
    this.isreserved = false;
    this.isreservedDx = false;
    this.isreservedCx = false;
    this.isreservedSx = false;
    const list = this.bookings.filter(b => b.roomId === this.room.roomId);
    for (const b of list) {
      if (this.day.date >= b.startDate &&  this.day.date <= b.endDate) {
        this.isreserved = true;
        const d = this.day.date.getTime();
        if (d === b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedDx = true;
        }
        if (d !== b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedCx = true;
        }
        if (d !== b.startDate.getTime() && d === b.endDate.getTime()) {
          this.isreservedSx = true;
        }
      }
    }
  }


}
