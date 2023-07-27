import { Injectable } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Booking } from 'src/app/models/booking';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private rooms: Room[] = [
    { roomId: 1, name: 'Chambre 101', category: 'Catégorie A', type: 'Simple' },
    { roomId: 2, name: 'Chambre 102', category: 'Catégorie B', type: 'Double' },
    { roomId: 3, name: 'Chambre 103', category: 'Catégorie A', type: 'Simple' },
    { roomId: 4, name: 'Chambre 104', category: 'Catégorie C', type: 'Suite' },
    { roomId: 5, name: 'Chambre 105', category: 'Catégorie B', type: 'Double' },
    { roomId: 6, name: 'Chambre 106', category: 'Catégorie A', type: 'Simple' },
  ];

  constructor() {}

  getRooms(): Room[] {
    return this.rooms;
  }


}
