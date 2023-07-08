import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectReservationArg } from '../../select-reservation-arg';

@Component({
  selector: 'app-calendarsearchbtn',
  templateUrl: './canlendrier-searchout.component.html',
  styleUrls: ['./canlendrier-searchout.component.scss'],
})
export class CanlendrierSearchoutComponent  implements OnInit {

  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  isopen = false;

  constructor() { }

  ngOnInit() { }

  onReservationSelected(args: SelectReservationArg) {
    this.isopen = false;
    this.selectreservation.emit(args);
  }

  onOpenClose() {
    this.isopen = !this.isopen;
  }

}
