import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export interface DayCellData {
    rect: Konva.Rect;
    text: Konva.Text;
}

interface DayCellCreator {
    createDayCell(x: number, dayNumber: number, width: number): Konva.Rect;
    createDayText(x: number, dayNumber: number, width: number): Konva.Text;
}

class DefaultDayCellCreator implements DayCellCreator {
    private cellHeight: number = 30;

    constructor(private currentYear: number) { }

    createDayCell(x: number, dayNumber: number, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width - 1,
            height: this.cellHeight - 1,
            fill: 'white',
            stroke: 'gray',
            strokeWidth: 0.5,
            x: x,
            y: 30,
        });
    }

    createDayText(x: number, dayNumber: number, width: number): Konva.Text {
        return new Konva.Text({
            text: `${dayNumber}`,
            width: width,
            height: this.cellHeight,
            align: 'left',
            verticalAlign: 'middle',
            fontSize: 16,
            fill: '#279EFF',
            x: x,
            y: 30,
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
    private type: string;
    private dayCellCreator: DayCellCreator;

    constructor(tableLayer: Konva.Layer, cellHeight: number, cellWidth: number, cellWidthInfo: number, currentYear: number, currentMonth: number, type: string) {
        this.cellHeight = cellHeight;
        this.cellWidthInfo = cellWidthInfo;
        this.cellWidth = cellWidth;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.type = type;
        this.tableLayer = tableLayer;

        this.dayCellCreator = new DefaultDayCellCreator(this.currentYear); // Provide the currentYear
        this.createDayCells();
    }

    private createDayCells() {
        const days: DayCellData[] = [];

        if (this.type === 'Année') {
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
        const weeksInYear = Utility.getWeeksInYear(this.currentYear);

        let positionXWeek = this.calculatePositionX(1);

        for (let week = 1; week <= weeksInYear; week++) {
            const weekNumber = week;
            const weekStartDate = Utility.getDateOfWeek(this.currentYear, week);

            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(weekStartDate);
                currentDate.setDate(currentDate.getDate() + day);

                const cellPositionX = positionXWeek + day * this.cellWidth;
                const dayCell = this.dayCellCreator.createDayCell(cellPositionX, currentDate.getDate(), this.cellWidth);
                const text = this.dayCellCreator.createDayText(cellPositionX + 10, currentDate.getDate(), this.cellWidth);

                days.push({
                    rect: dayCell,
                    text: text,
                });

                this.tableLayer.add(dayCell);
                this.tableLayer.add(text);
            }

            positionXWeek += 7 * this.cellWidth;
        }

        return days;
    }

    private createMonthDayCells(): DayCellData[] {
        const days: DayCellData[] = [];
        const monthDays = Utility.getDaysInMonth(this.currentYear, this.currentMonth);
        const startXBase = this.calculatePositionX(1);

        for (let day = 1; day <= monthDays; day++) {
            const startX = startXBase + (day - 1) * this.cellWidth;

            const dayCell = this.dayCellCreator.createDayCell(startX, day, this.cellWidth);
            const text = this.dayCellCreator.createDayText(startX + 10, day, this.cellWidth);

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
