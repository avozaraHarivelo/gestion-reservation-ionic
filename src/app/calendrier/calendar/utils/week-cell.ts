import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export interface weekCellData {
    rect: Konva.Rect;
    text: Konva.Text;
}

interface WeekCellCreator {
    createWeekCell(x: number, weekNumber: number, width: number): Konva.Rect;
    createWeekText(x: number, weekNumber: number, width: number): Konva.Text;
}

class DefaultWeekCellCreator implements WeekCellCreator {
    private cellHeight: number = 30;

    constructor(private currentYear: number) {}

    createWeekCell(x: number, weekNumber: number, width: number): Konva.Rect {
        return new Konva.Rect({
            width: width,
            height: this.cellHeight - 1,
            fill: 'white',
            stroke: 'gray',
            strokeWidth: 0.5,
            x: x,
            y: 30,
        });
    }

    createWeekText(x: number, weekNumber: number, width: number): Konva.Text {
        return new Konva.Text({
            text: `${weekNumber}/ ${this.currentYear}`,
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

export class WeekCell {
    private cellWidth: number;
    private cellWidthInfo: number;
    private cellHeight: number = 30;
    private currentYear: number;
    private currentMonth: number;
    private tableLayer: Konva.Layer;
    private type: string;
    private weekCellCreator: WeekCellCreator;

    constructor(tableLayer: Konva.Layer, cellHeight: number, type: string, cellWidth: number, cellWidthInfo: number, currentYear: number, currentMonth: number) {
        this.cellHeight = cellHeight;
        this.cellWidthInfo = cellWidthInfo;
        this.cellWidth = cellWidth;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.type = type;
        this.tableLayer = tableLayer;

        this.weekCellCreator = new DefaultWeekCellCreator(this.currentYear);
        this.createWeekCells();
    }

    public createWeekCells() {
        const weeks: weekCellData[] = (this.type === 'année') ? this.createYearWeekCells() : this.createMonthWeekCells();
        this.tableLayer.batchDraw();
        return weeks;
    }

    private calculatePositionX(week: number, firstDay: number): number {
        const startDayOfWeek = week * 7 - firstDay + 2;
        return this.cellWidthInfo * 3 + Math.max(0, (startDayOfWeek - 1) * this.cellWidth);
    }

    private createYearWeekCells(): weekCellData[] {
        const weeks: weekCellData[] = [];
        let positionXSemaine = this.cellWidthInfo * 3;
        let oldSemaine = 0;

        Utility.monthNames.forEach((_mois, index) => {
            const monthDays = Utility.getDaysInMonth(this.currentYear, index);
            const premierJourDuMois = new Date(this.currentYear, index, 1).getDay();
            const premierJourDuMoisLundi = premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;
            const semainesDansMois = Math.ceil((monthDays + premierJourDuMois) / 7);

            for (let semaine = 0; semaine < semainesDansMois; semaine++) {
                const premierJourSemaine = semaine * 7 - premierJourDuMois + 1;
                const numeroSemaine = Utility.getWeek(this.currentYear, index, premierJourSemaine);

                if (numeroSemaine === oldSemaine) {
                    continue;
                }

                this.currentMonth = numeroSemaine;
                const cellWidth = (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * this.cellWidth : 7 * this.cellWidth;
                const celluleSemaine = this.weekCellCreator.createWeekCell(positionXSemaine, numeroSemaine, cellWidth);
                const texteSemaine = this.weekCellCreator.createWeekText(positionXSemaine + 10, numeroSemaine, cellWidth);

                weeks.push({
                    rect: celluleSemaine,
                    text: texteSemaine,
                });

                this.tableLayer.add(celluleSemaine);
                this.tableLayer.add(texteSemaine);

                positionXSemaine += cellWidth;
                oldSemaine = numeroSemaine;
            }
        });

        return weeks;
    }

    private createMonthWeekCells(): weekCellData[] {
        const weeks: weekCellData[] = [];
        const monthDays = Utility.getDaysInMonth(this.currentYear, this.currentMonth);
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const weeksInMonth = Math.ceil((monthDays + firstDayOfMonth) / 7);
        const startXBase = this.calculatePositionX(0, firstDayOfMonth);

        for (let week = 0; week < weeksInMonth; week++) {
            const startDayOfWeek = week * 7 - firstDayOfMonth + 2;
            const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);
            const startX = startXBase + Math.max(0, (startDayOfWeek - 1) * this.cellWidth);
            const weekNumber = Utility.getWeek(this.currentYear, this.currentMonth, startDayOfWeek);

            const weekCell = this.weekCellCreator.createWeekCell(startX, weekNumber, (endDayOfWeek - startDayOfWeek + 1) * this.cellWidth);
            const text = this.weekCellCreator.createWeekText(startX + 10, weekNumber, (endDayOfWeek - startDayOfWeek + 1) * this.cellWidth);

            weeks.push({
                rect: weekCell,
                text: text,
            });

            this.tableLayer.add(weekCell);
            this.tableLayer.add(text);
        }

        return weeks;
    }

    public setWeekCellCreator(creator: WeekCellCreator): void {
        this.weekCellCreator = creator;
    }
}
