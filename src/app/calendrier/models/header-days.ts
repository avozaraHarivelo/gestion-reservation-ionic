import { DateAndWeek } from "../date-manager";


export class HeaderDays {
  startDate: Date =new Date();
  endDate: Date=new Date();
  headDaysAll: DateAndWeek[];
  headDays1: DateAndWeek[];
  headDays2: DateAndWeek[];
  months: MonthsDay[];
  startDayIndex: any;

  constructor() {
    this.headDaysAll = [];
    this.headDays1 = [];
    this.headDays2 = [];
    this.months = [];
  }

}

export class MonthsDay {

  constructor(public monthName: string, public days: number) { }

}