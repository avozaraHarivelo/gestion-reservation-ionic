import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from 'src/app/models/room';

@Component({
  selector: 'app-new-reservation-modal',
  templateUrl: './new-reservation-modal.component.html',
  styleUrls: ['./new-reservation-modal.component.scss'],
})
export class NewReservationModalComponent  implements OnInit {

  selectedRoom!: Room;
  startDate!: Date;
  endDate!: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public rooms: Room[]) { }

  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
