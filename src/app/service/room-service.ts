import { Injectable } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Booking } from 'src/app/models/booking';
import { Attribute } from '../calendrier/calendar/utils/room-info-cell';


@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private rooms: Room[] = [];
  private attributes: Attribute[] = [
    { key: 'name', color: '#f0f0f0' },
    { key: 'category', color: '#f0f0f0' },
    { key: 'type', color: '#f0f0f0' }
];

  constructor() {
    // Créer quelques chambres par défaut
    this.generateRooms(10); // Vous pouvez ajuster le nombre de chambres ici
  }

  private generateRooms(count: number): void {
    for (let i = 1; i <= count; i++) {
      const room: Room = {
        roomId: i,
        name: `Chambre ${i}`,
        category: this.getRandomCategory(),
        type: this.getRandomType(),
      };
      this.rooms.push(room);
    }
  }

  private getRandomCategory(): string {
    const categories = ['Catégorie A', 'Catégorie B', 'Catégorie C'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomType(): string {
    const types = ['Simple', 'Double', 'Suite'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getRoomInfo(): Attribute[] {
    return this.attributes;
  }
}

