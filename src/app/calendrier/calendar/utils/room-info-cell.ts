import Konva from 'konva';
import { Room } from 'src/app/models/room';
import { RoomService } from 'src/app/service/room-service';


export interface Attribute {
    key: keyof Room;
    color: string;
    label?: string;
}

export interface RoomInfoData {
    rect: Konva.Rect;
    text: Konva.Text;
}

interface RoomInfoCellCreator {
    createRoomInfoCellHeader(x: number, attribute: Attribute, width: number): Konva.Rect;
    createRoomInfoTextHeader(x: number, textData: string, width: number): Konva.Text;
    createRoomInfoCell(x: number, y: number, attribute: Attribute, width: number): Konva.Rect;
    createRoomInfoText(x: number, y: number, textData: string, width: number): Konva.Text;
}

class DefaultRoomInfoCellCreator implements RoomInfoCellCreator {
    constructor(private cellHeight: number) { }

    createRoomInfoCellHeader(x: number, attribute: Attribute, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width - 1,
            height: this.cellHeight + 30 * 2 - 1,
            fill: attribute.color,
            stroke: 'grey',
            strokeWidth: 0.5,
            x: x,
            y: 0,
        });
    }

    createRoomInfoTextHeader(x: number, textData: string, width: number): Konva.Text {
        return new Konva.Text({
            text: textData,
            width: width,
            height: this.cellHeight + 30 * 2,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 14,
            fontStyle: 'bold',
            fill: 'black',
            x: x,
            y: 0,
        });
    }

    createRoomInfoCell(x: number, y: number, attribute: Attribute, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width - 1,
            height: this.cellHeight - 1,
            fill: "white",
            stroke: 'grey',
            strokeWidth: 0.5,
            x: x,
            y: y,
        });
    }

    createRoomInfoText(x: number, y: number, textData: string, width: number): Konva.Text {
        return new Konva.Text({
            text: textData,
            width: width,
            height: this.cellHeight,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 14,
            fontStyle: 'bold',
            fill: 'black',
            x: x,
            y: y,
        });
    }
}

export class RoomInfoCell {
    private cellWidthRoom: number;
    private cellHeight: number;
    private tableLayer: Konva.Layer;
    private attributes: Attribute[];
    private rooms: Room[];
    private roomCellsHeader: RoomInfoData[] = [];
    private roomCells: RoomInfoData[] = [];
    private roomInfoCellCreator: RoomInfoCellCreator;

    constructor(
        tableLayer: Konva.Layer,
        cellWidthRoom: number,
        cellHeight: number,
        private roomService: RoomService,
    ) {
        this.cellWidthRoom = cellWidthRoom;
        this.cellHeight = cellHeight;
        this.attributes = this.roomService.getRoomInfo();
        this.rooms = this.roomService.getRooms();
        this.tableLayer = tableLayer;

        this.roomInfoCellCreator = new DefaultRoomInfoCellCreator(this.cellHeight);
        this.createRoomInfoCells();
    }

    public createRoomInfoCells(): RoomInfoData[] {
        const positionYBase = this.cellHeight + 30 * 2;



        for (let row = 0; row < this.rooms.length; row++) {
            const positionY = row * this.cellHeight + positionYBase;
            this.attributes.forEach((attr, index) => {
                const positionX = this.cellWidthRoom * index;

                const cell = this.roomInfoCellCreator.createRoomInfoCell(positionX, positionY, attr, this.cellWidthRoom);
                const textData = this.getAttributeValueByIndex(this.rooms[row], attr.key);
                const text = this.roomInfoCellCreator.createRoomInfoText(positionX, positionY, textData, this.cellWidthRoom);

                this.roomCells.push({ rect: cell, text: text });

                this.tableLayer.add(cell);
                this.tableLayer.add(text);
            });
        }




        return this.roomCells;
    }

    public createRoomHeader():RoomInfoData[] {

        this.attributes.forEach((attr, index) => {

            const positionX = this.cellWidthRoom * index;

            const celluleHeader = this.roomInfoCellCreator.createRoomInfoCellHeader(positionX, attr, this.cellWidthRoom);
            const textHeader = this.roomInfoCellCreator.createRoomInfoTextHeader(positionX, attr.key, this.cellWidthRoom);

            this.roomCellsHeader.push({ rect: celluleHeader, text: textHeader });

            this.tableLayer.add(celluleHeader);
            this.tableLayer.add(textHeader);
        });

        return this.roomCellsHeader;
    }

    private getAttributeValueByIndex(room: Room, attributeKey: keyof Room): string {
        const attributeValue = room[attributeKey];

        if (typeof attributeValue === 'number') {
            return attributeValue.toString();
        }

        return attributeValue;
    }


}
