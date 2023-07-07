import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeDateArg } from '../change-date-arg';
import { DateAndWeek, DateManager } from '../date-manager';
import { Booking } from 'src/app/models/booking';
import { Utility } from 'src/app/appcore/utility';
import { SelectReservationArg } from '../select-reservation-arg';
import { HeaderDays, MonthsDay } from '../models/header-days';

@Component({
  selector: 'app-calendar-navbar',
  templateUrl: './calendar-navbar.component.html',
  styleUrls: ['./calendar-navbar.component.scss'],
})
export class CalendarNavbarComponent  implements OnInit {

  @Input() day: number=0;
  @Input() month: number=0;
  @Input() year: number=0;
  @Input() statusbar: Booking = new Booking;
  @Input() manager: DateManager= new DateManager();
  @Output() changedays = new EventEmitter<ChangeDateArg>();
  currymd: Date = new Date();
  currvalues: DateAndWeek= new DateAndWeek();
  datpicker: Date = new Date();
  cbrooms: any[] = [];
  type: string= "";
  roomtype = '0';

  constructor() { }

  ngOnInit() {
    this.type = 'month';
    const roomtype = +this.roomtype;
    this.currymd = new Date(this.year, this.month - 1, 1);
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const hd = this.createHeaderDays();
    const args = new ChangeDateArg(this.type, 'init', roomtype, hd);
    this.changedays.emit(args);
  }


  onRoomChange(data: { value: string; }) {
    this.roomtype = data.value;
    this.changeDays(this.type, 'refresh');
  }

  onPickerChange(e:any) {
    this.type = 'month';
    const date = Utility.toDate(e.value);
    date.setDate(1);
    this.currymd = new Date(date);
    this.changeDays(this.type, 'refresh');
  }

  onReservationSelected(args: SelectReservationArg) {
    this.type = 'month';
    const d = new Date(args.startDate);
    d.setDate(1);
    this.currymd = new Date(d);
    this.changeDays(this.type, 'refresh');
  }

  onPrev15Day() {
    this.type = '15day';
    const d = new Date(this.manager.getPrevMonth(this.currymd));
    d.setDate(15);
    this.currymd = new Date(d);
    this.changeDays(this.type, 'prev');
  }

  onNext15Day() {
    this.type = '15day';
    const d = new Date(this.manager.getNextMonth(this.currymd));
    d.setDate(15);
    this.currymd = new Date(d);
    this.changeDays(this.type, 'next');
  }

  onPrevMonth() {
    if (this.type === '15day') {
      const d = this.manager.getDaysInTheMonth(this.currymd);
      this.currymd = new Date(this.currymd.getFullYear(), this.currymd.getMonth(), 1);
    } else {
      this.currymd = new Date(this.manager.getPrevMonth(this.currymd));
    }
    this.type = 'month';
    this.changeDays(this.type, 'prev');
  }

  onNextMonth() {
    if (this.type === '15day') {
      const d = this.manager.getDaysInTheMonth(this.currymd);
      this.currymd = new Date(this.currymd.getFullYear(), this.currymd.getMonth(), d);
    } else {
      this.currymd = new Date(this.manager.getNextMonth(this.currymd));
    }
    this.type = 'month';
    this.changeDays(this.type, 'next');
  }

  private changeDays(type: string, operation: string) {
    const roomtype = +this.roomtype;
    this.datpicker = new Date(this.currymd);
    this.currvalues = this.getCurrentValues();
    const hd = this.createHeaderDays();
    const args = new ChangeDateArg(type, operation, roomtype, hd);
    this.changedays.emit(args);
  }

  private createHeaderDays(): HeaderDays {
    const h = new HeaderDays();
    let currdate = new Date(this.currymd);
    const dd = currdate.getDate();
    const days = (dd === 1) ? this.manager.getDaysInTheMonth(currdate) : 31;
    for (let i = 0; i < days; i++) {
      if (i > 0) {
        currdate = this.manager.getNextDay(currdate);
      }
      const dw = this.manager.getDateAndWeekValues(currdate);
      h.headDaysAll.push(dw);
    }
    h.startDate = h.headDaysAll[0].date;
    h.endDate = h.headDaysAll[h.headDaysAll.length - 1].date;
    const firstmonth = h.headDaysAll[0].date.getMonth();
    for (const dayhead of h.headDaysAll) {
      if (dayhead.date.getMonth() === firstmonth) {
        h.headDays1.push(dayhead);
      } else {
        h.headDays2.push(dayhead);
      }
    }
    if (h.headDays1.length > 0) {
      const monthName1 = h.headDays1[0].monthName;
      const m1 = new MonthsDay(monthName1, h.headDays1.length);
      h.months.push(m1);
    }
    if (h.headDays2.length > 0) {
      const monthName2 = h.headDays2[0].monthName;
      const m2 = new MonthsDay(monthName2, h.headDays2.length);
      h.months.push(m2);
    }
    return h;
  }

  private getCurrentValues(): DateAndWeek {
    return this.manager.getDateAndWeekValues(this.currymd);
  }


}
