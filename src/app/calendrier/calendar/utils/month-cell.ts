import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export interface monthCellData {
    rect: Konva.Rect;
    text: Konva.Text;
}

export class MonthCell {
    private cellWidth: number;
    private cellWidthInfo: number;
    private cellHeight: number = 30;
    private limite: string;
    private currentYear: number;
    private currentMonth: number;
    private tableLayer: Konva.Layer;

    constructor(tableLayer: Konva.Layer, cellWidthInfo: number, limite: string, cellWidthDay: number, cellHeight: number, currentYear: number, currentMonth: number) {
        this.cellWidth = cellWidthDay;
        this.cellWidthInfo = cellWidthInfo;
        this.cellHeight = cellHeight;
        this.limite = limite;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.tableLayer = tableLayer;
    }

    public createMonthCell(): monthCellData[] {
        const monthCells: monthCellData[] = [];
        let positionX = this.cellWidthInfo * 3;

        if (this.limite === 'année') {
            console.log(`limite année`)
            Utility.monthNames.forEach((mois, index) => {
                const cellData = this.createCell(positionX, mois, this.currentYear, index);
                monthCells.push(cellData);
                positionX += Utility.getDaysInMonth(this.currentYear, index) * this.cellWidth;
            });
        } else {
            const cellData = this.createCell(positionX, Utility.getMonthName(this.currentMonth), this.currentYear, this.currentMonth);
            monthCells.push(cellData);
            positionX += Utility.getDaysInMonth(this.currentYear, this.currentMonth) * this.cellWidth;
        }

        return monthCells;
    }

    private createCell(positionX: number, mois: string, year: number, month: number): monthCellData {
        const joursDansMois = Utility.getDaysInMonth(year, month);

        const celluleMois = new Konva.Rect({
            width: joursDansMois * this.cellWidth - 1,
            height: 30 - 1,
            fill: this.limite === 'Année' ? '#f0f0f0' : '#A8A196',
            stroke: 'gray',
            strokeWidth: 0.5,
        });
        celluleMois.position({
            x: positionX,
            y: 0,
        });

        const enTeteMois = new Konva.Text({
            text: `${mois} ${year}`,
            width: joursDansMois * this.cellWidth,
            height: 30,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 18,
            fontStyle: 'bold',
            fill: 'black',
        });

        enTeteMois.position({
            x: positionX,
            y: 0,
        });

        this.tableLayer.add(celluleMois);
        this.tableLayer.add(enTeteMois);

        return { rect: celluleMois, text: enTeteMois };
    }
}
