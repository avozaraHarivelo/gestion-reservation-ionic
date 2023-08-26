import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export interface VoidCellData {
    cell: Konva.Rect;
    text: Konva.Text;
}

export class VoidCell {
    private limite: string;
    private cellWidth: number;
    private cellHeight: number;
    private tableLayer: Konva.Layer;
    private voidCells: VoidCellData[] = [];
    private calendarData: any; // Replace 'any' with the actual type of calendarData
    private currentYear: number; // Define the actual type
    private currentMonth: number; // Define the actual type
    private cellWidthRoom: number; // Define the actual type

    constructor(
        limite: string,
        tableLayer: Konva.Layer,
        cellWidth: number,
        cellHeight: number,
        calendarData: any, // Replace 'any' with the actual type of calendarData
        currentYear: number,
        currentMonth: number,
        cellWidthRoom: number
    ) {
        this.limite = limite;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.tableLayer = tableLayer;
        this.calendarData = calendarData;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.cellWidthRoom = cellWidthRoom;

        this.createVoidCells();
    }

    public createVoidCells(): VoidCellData[] {
        const { rooms } = this.calendarData;
        const numberVoid = this.limite === 'année' ? Utility.getDaysInYear(this.currentYear) : Utility.getDaysInMonth(this.currentYear, this.currentMonth);

        for (let row = 1; row <= rooms.length; row++) {
            this.createVoidCellsForRow(row, numberVoid);
        }
        this.tableLayer.batchDraw();

        return this.voidCells;
    }

    private createVoidCellsForRow(row: number, numberVoid: number): void {
        const colors = ['#F5F5F5', 'white'];
        let currentColorIndex = 0;

        const color = colors[currentColorIndex];
        for (let col = 1; col <= numberVoid; col++) {
            const positionX = this.cellWidthRoom * 3 + (col - 1) * this.cellWidth;
            const positionY = row * this.cellHeight + 30 + 30;//ajoute ici la hauteur de cell event

            const cell = new Konva.Rect({
                width: this.cellWidth - 1,
                height: this.cellHeight - 1,
                fill: color,
                stroke: 'gray',
                strokeWidth: 0.5,
                className: 'table-cell'
            });
            cell.position({ x: positionX, y: positionY });

            const text = new Konva.Text({
                text: '',
                width: this.cellWidth,
                height: this.cellHeight,
                align: 'center',
                verticalAlign: 'middle',
                fontSize: 14,
                fill: 'black'
            });

            text.position({ x: positionX, y: positionY });
            this.tableLayer.add(cell);
            this.tableLayer.add(text);

            this.voidCells.push({ cell, text });

            currentColorIndex = (currentColorIndex + 1) % colors.length;
        }
    }

    public addToTableLayer(): void {

    }
}
