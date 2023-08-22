import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export class MonthCell {
    private cellWidth: number;
    private cellWidthInfo: number;
    private cellHeight: number = 30;
    private limite: String;
    private currentYear: number;
    private currentMonth: number;
    private tableLayer: Konva.Layer;

    constructor(tableLayer: Konva.Layer, cellWidthInfo: number, limite: String, cellWidthDay: number, cellHeight: number, currentYear: number, currentMonth: number) {
        this.cellWidth = cellWidthDay;
        this.cellWidthInfo = cellWidthInfo;
        this.cellHeight = cellHeight;
        this.limite = limite;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.tableLayer = tableLayer;

        this.createMonthCell();
    }

    private createMonthCell() {
        let positionX = this.cellWidthInfo * 3;

        if (this.limite === 'Année') {
            Utility.monthNames.forEach((mois, index) => {
                this.createCell(positionX, mois, this.currentYear, index);
                positionX += Utility.getDaysInMonth(this.currentYear, index) * this.cellWidth;
            });
        } else {
            this.createCell(positionX, Utility.getMonthName(this.currentMonth), this.currentYear, this.currentMonth);
            positionX += Utility.getDaysInMonth(this.currentYear, this.currentMonth) * this.cellWidth;
        }
    }

    private createCell(positionX: number, mois: string, year: number, month: number) {
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
    }
}
