import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Utility } from 'src/app/appcore/utility';
import { Booking } from 'src/app/models/booking';
import { ReservationService } from 'src/app/service/reservation-service';

@Component({
  selector: 'app-dialogreservation',
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.scss'],
})
export class FormReservationComponent implements OnInit {
  title: string = "";
  $rooms: any;
  sub: Subscription = new Subscription();
  roomid: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  booking: Booking = new Booking();
  rooms: any;


  // tslint:disable-next-line:max-line-length
  constructor(private service: ReservationService, private dialogRef: MatDialogRef<FormReservationComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.roomid = data.roomid;
    if (data.booking.bookingId === 0) {
      this.title = 'Create ';
      this.startDate = data.date;
      this.endDate = data.date;
    } else {
      this.title = 'Edit ';
      this.startDate = data.booking.startDate;
      this.endDate = data.booking.endDate;
    }
    this.booking = data.booking;
    this.$rooms = data.rooms;
  }

  ngOnInit() {
    this.sub = this.$rooms.subscribe((result: any) => {
      this.rooms = result;
    });
  }

  onConfirm(form: NgForm) {
    if (form.invalid === true) {
      return;
    }
    const vm = new Booking();
    vm.bookingId = this.booking.bookingId;
    vm.roomId = Utility.toInteger(form.value.roomid);
    vm.startDate = Utility.toDate(form.value.startDate);
    vm.endDate = Utility.toDate(form.value.endDate);
    vm.name = Utility.toString(form.value.name);
    //
    if (vm.endDate < vm.startDate) {
      alert('Attention: startDate > endDate');
      return;
    }
    const index = this.rooms.findIndex((x: { roomId: number; }) => x.roomId === vm.roomId);
    vm.roomType = this.rooms[index].roomType;
    this.computeStayDay(vm.startDate, vm.endDate);
    //
    if (vm.bookingId === 0) {
      this.service.insertReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    } else {
      this.service.updateReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    }
  }

  onDelete() {
    const id = this.booking.bookingId;
    this.service.deleteReservation(id).subscribe(
      result => this.dialogRef.close(result),
      error => alert(error)
    );
  }

  onClose() {
    this.dialogRef.close('no');
  }

  private computeStayDay(startDate: Date, endDate: Date): number {
    const valret = 0;
    //
    // ???
    //
    return valret;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
