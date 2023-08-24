import Konva from 'konva';
import { Room } from 'src/app/models/room';


interface Attribute {
    key: keyof Room;
    color: string;
    label?: string;
}

export interface RoomInfoData {
    rect: Konva.Rect;
    text: Konva.Text;
}

interface RoomInfoCellCreator {
    createRoomInfoCell(x: number, attribute: Attribute, width: number): Konva.Rect;
    createRoomInfoText(x: number, textData: string, width: number): Konva.Text;
}

class DefaultRoomInfoCellCreator implements RoomInfoCellCreator {
    constructor(private cellHeight: number) {}

    createRoomInfoCell(x: number, attribute: Attribute, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width - 1,
            height: this.cellHeight * 2 - 1,
            fill: attribute.color,
            stroke: 'grey',
            strokeWidth: 0.5,
            x: x,
            y: 0,
        });
    }

    createRoomInfoText(x: number, textData: string, width: number): Konva.Text {
        return new Konva.Text({
            text: textData,
            width: width,
            height: this.cellHeight * 2,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 14,
            fontStyle: 'bold',
            fill: 'black',
            x: x,
            y: 0,
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
    private roomCellsHeaderText: RoomInfoData[] = [];
    private roomCells: RoomInfoData[] = [];
    private roomTexts: RoomInfoData[] = [];
    private roomInfoCellCreator: RoomInfoCellCreator;

    constructor(
        tableLayer: Konva.Layer,
        cellWidthRoom: number,
        cellHeight: number,
        attributes: Attribute[],
        rooms: Room[]
    ) {
        this.cellWidthRoom = cellWidthRoom;
        this.cellHeight = cellHeight;
        this.attributes = attributes;
        this.rooms = rooms;
        this.tableLayer = tableLayer;

        this.roomInfoCellCreator = new DefaultRoomInfoCellCreator(this.cellHeight);
        this.createRoomInfoCells();
    }

    private createRoomInfoCells() {
        const positionYBase = this.cellHeight * 2 + 30;

        this.attributes.forEach((attr, index) => {
            const positionX = this.cellWidthRoom * index;

            const celluleHeader = this.roomInfoCellCreator.createRoomInfoCell(positionX, attr, this.cellWidthRoom);
            const textHeader = this.roomInfoCellCreator.createRoomInfoText(positionX, attr.label || '', this.cellWidthRoom);

            this.roomCellsHeader.push({ rect: celluleHeader, text: textHeader });

            this.tableLayer.add(celluleHeader);
            this.tableLayer.add(textHeader);
        });

        for (let row = 1; row <= this.rooms.length; row++) {
            const positionY = row * this.cellHeight + positionYBase;

            this.attributes.forEach((attr, index) => {
                const positionX = this.cellWidthRoom * index;

                const cell = this.roomInfoCellCreator.createRoomInfoCell(positionX, attr, this.cellWidthRoom);
                const textData = this.getAttributeValueByIndex(this.rooms[row - 1], attr.key);
                const text = this.roomInfoCellCreator.createRoomInfoText(positionX, textData, this.cellWidthRoom);

                this.roomCells.push({ rect: cell, text: text });

                this.tableLayer.add(cell);
                this.tableLayer.add(text);
            });
        }
    }

    private getAttributeValueByIndex(room: Room, attributeKey: keyof Room): string {
        const attributeValue = room[attributeKey];
    
        if (typeof attributeValue === 'number') {
            return attributeValue.toString();
        }
    
        return attributeValue;
    }
    
}
