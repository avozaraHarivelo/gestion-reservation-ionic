import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export interface DayCellData {
    rect: Konva.Rect;
    text: Konva.Text;
}

interface DayCellCreator {
    createDayCell(x: number, height:number,dayNumber: number, width: number): Konva.Rect;
    createDayText(x: number,height:number, dayNumber: number, width: number): Konva.Text;
}

class DefaultDayCellCreator implements DayCellCreator {

    constructor(private currentYear: number) { }

    createDayCell(x: number,height:number, dayNumber: number, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width - 1,
            height: height- 1,
            fill: 'white',
            stroke: 'gray',
            strokeWidth: 0.5,
            x: x,
            y: 60,
        });
    }

    createDayText(x: number,height:number, dayNumber: number, width: number): Konva.Text {
        return new Konva.Text({
            text: `${dayNumber}`,
            width: width,
            height: height,
            align: 'left',
            verticalAlign: 'middle',
            fontSize: 16,
            fill: '#279EFF',
            x: x,
            y: 60,
        });
    }
}

export class DayCell {
    private cellWidth: number;
    private cellWidthInfo: number;
    private cellHeight: number = 30;
    private currentYear: number;
    private currentMonth: number;
    private tableLayer: Konva.Layer;
    private limite: string;
    private dayCellCreator: DayCellCreator;

    constructor(tableLayer: Konva.Layer, cellHeight: number, cellWidth: number, cellWidthInfo: number, currentYear: number, currentMonth: number, limite: string) {
        this.cellHeight = cellHeight;
        this.cellWidthInfo = cellWidthInfo;
        this.cellWidth = cellWidth;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.limite = limite;
        this.tableLayer = tableLayer;

        this.dayCellCreator = new DefaultDayCellCreator(this.currentYear); // Provide the currentYear
        this.createDayCells();
    }

    public createDayCells() {
        const days: DayCellData[] = [];

        if (this.limite === 'année') {
            days.push(...this.createYearDayCells());
        } else {
            days.push(...this.createMonthDayCells());
        }

        this.tableLayer.batchDraw();

        return days;
    }

    private calculatePositionX(day: number): number {
        return this.cellWidthInfo * 3 + (day - 1) * this.cellWidth;
    }

    private createYearDayCells(): DayCellData[] {
        const days: DayCellData[] = [];












        let positionXDay = this.cellWidthInfo * 3;

        // Parcourir les mois et afficher chaque mois côte à côte
        Utility.monthNames.forEach((_mois, index) => {
            const monthDays = Utility.getDaysInMonth(this.currentYear, index);

            // Créer une boucle pour parcourir les jours du mois
            for (let jour = 1; jour <= monthDays; jour++) {
                const cellPositionX = positionXDay + (jour - 1) * this.cellWidth;

                // Créer une cellule pour représenter le jour
                const celluleJour = new Konva.Rect({
                    width: this.cellWidth,
                    height: this.cellHeight - 1,
                    fill: 'white',
                    stroke: 'gray',
                    strokeWidth: 0.5,
                });

                celluleJour.position({
                    x: cellPositionX,
                    y: 60,
                });

                const currentDate = new Date(this.currentYear, index, jour);
                const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'short' });

                const text = new Konva.Text({
                    text: `${dayOfWeek} ${jour}`,
                    width: this.cellWidth-1,
                    height: this.cellHeight,
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 16,
                    // fill: 'black',
                });

                text.position({
                    x: cellPositionX,
                    y: 60,
                });
                days.push({
                    rect: celluleJour,
                    text: text,
                });
                this.tableLayer.add(celluleJour);
                //  daysinfo.push(celluleJour);
                this.tableLayer.add(text);
            }

            positionXDay += monthDays * this.cellWidth;
        });













        // const weeksInYear = Utility.getWeeksInYear(this.currentYear);

        // let positionXWeek = this.calculatePositionX(1);

        // for (let week = 1; week <= weeksInYear; week++) {
          
        //     const weekStartDate = Utility.getDateOfWeek(this.currentYear, week);

        //     for (let day = 0; day < 7; day++) {
        //         const currentDate = new Date(weekStartDate);
               

        //         currentDate.setDate(currentDate.getDate() + day);

        //         const cellPositionX = positionXWeek + day * this.cellWidth;
        //         const dayCell = this.dayCellCreator.createDayCell(cellPositionX,this.cellHeight, currentDate.getDate(), this.cellWidth);
        //         const text = this.dayCellCreator.createDayText(cellPositionX + 10,this.cellHeight, currentDate.getDate(), this.cellWidth);

        //         days.push({
        //             rect: dayCell,
        //             text: text,
        //         });

        //         this.tableLayer.add(dayCell);
        //         this.tableLayer.add(text);
        //     }

        //     positionXWeek += 7 * this.cellWidth;
        // }

        return days;
    }

    private createMonthDayCells(): DayCellData[] {
        const days: DayCellData[] = [];
        const monthDays = Utility.getDaysInMonth(this.currentYear, this.currentMonth);
        const startXBase = this.calculatePositionX(1);

        for (let day = 1; day <= monthDays; day++) {
            const startX = startXBase + (day - 1) * this.cellWidth;

            const dayCell = this.dayCellCreator.createDayCell(startX,this.cellHeight, day, this.cellWidth);
            const text = this.dayCellCreator.createDayText(startX + 10, this.cellHeight,day, this.cellWidth);

            days.push({
                rect: dayCell,
                text: text,
            });

            this.tableLayer.add(dayCell);
            this.tableLayer.add(text);
        }

        return days;
    }

    public setDayCellCreator(creator: DayCellCreator): void {
        this.dayCellCreator = creator;
    }
}
