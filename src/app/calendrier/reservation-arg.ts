import { Booking } from "../models/booking";


export class ReservationArg {

  constructor(public roomid: number, public date: Date, public booking: Booking) { }

}
