export class Room {
  roomId: number;
  name: string;
  category: string;
  type: string;

  constructor(roomId: number, name: string, category: string, type: string) {
    this.roomId = roomId;
    this.name = name;
    this.category = category;
    this.type = type;
  }
}
