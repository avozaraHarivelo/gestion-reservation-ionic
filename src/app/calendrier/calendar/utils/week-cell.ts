import Konva from 'konva';
import { Utility } from 'src/app/appcore/utility';

export class weekCell {
    private cellWidth: number;
    private cellWidthInfo: number;
    private cellHeight: number = 30;
    private currentYear: number;
    private currentMonth: number;
    private tableLayer: Konva.Layer;
    private type: string;

    constructor(tableLayer: Konva.Layer,cellHeight:number, type: string, cellWidth: number, cellWidthInfo: number, currentYear: number, currentMonth: number) {
        this.cellHeight = cellHeight;
        this.cellWidthInfo = cellWidthInfo;
        this.cellWidth = cellWidth;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.type = type;
        this.tableLayer = tableLayer;

        this.createWeekCells(type);
    }

    private createWeekCells(type: string) {
        let positionXSemaine = this.cellWidthInfo * 3;

        if (type == "Année") {
            Utility.monthNames.forEach((_mois, index) => {
                const monthDays = Utility.getDaysInMonth(this.currentYear, index);
                const premierJourDuMois = new Date(this.currentYear, index, 1).getDay();
                const premierJourDuMoisLundi = premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;
                const semainesDansMois = Math.ceil((monthDays + premierJourDuMois) / 7);

                for (let semaine = 0; semaine < semainesDansMois; semaine++) {
                    const premierJourSemaine = semaine * 7 - premierJourDuMois + 1;
                    const numeroSemaine = Utility.getWeek(this.currentYear, index, premierJourSemaine);

                    if (numeroSemaine === 0) continue;

                    this.currentMonth = numeroSemaine;

                    const celluleSemaine = new Konva.Rect({
                        width: (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * this.cellWidth : 7 * this.cellWidth - 1,
                        height: this.cellHeight - 1,
                        fill: '#f0f0f0',
                        stroke: 'gray',
                        strokeWidth: 0.5,
                    });

                    celluleSemaine.position({
                        x: positionXSemaine,
                        y: 30,
                    });

                    const texteSemaine = new Konva.Text({
                        text: `${(index === 0 && semaine === 0) ? '1' : numeroSemaine}/ ${this.currentYear}`,
                        width: (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * this.cellWidth : 7 * this.cellWidth,
                        height: this.cellHeight,
                        align: 'left',
                        verticalAlign: 'middle',
                        fontSize: 16,
                        fill: 'black',
                    });

                    texteSemaine.position({
                        x: positionXSemaine + 10,
                        y: 30,
                    });

                    this.tableLayer.add(celluleSemaine);
                    this.tableLayer.add(texteSemaine);

                    positionXSemaine += (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * this.cellWidth : 7 * this.cellWidth;
                }
            });
        } else {
           let monthDays = Utility.getDaysInMonth(this.currentYear, this.currentMonth)
            // Calculer le nombre de semaines dans le mois en fonction du premier jour du mois et du nombre de jours dans le mois
            const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
            const weeksInMonth = Math.ceil((monthDays + firstDayOfMonth) / 7);

            // Créer une boucle pour parcourir les semaines du mois
            for (let week = 0; week < weeksInMonth; week++) {
                // Calculer le nombre de jours dans la semaine actuelle
                const startDayOfWeek = week * 7 - firstDayOfMonth + 2;
                const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);

                // Calculer la position X de la première cellule de la semaine
                const startX = this.cellWidthInfo * 3 + Math.max(0, (startDayOfWeek - 1) * this.cellWidth);

                // Calculer la position du semaine dans l'année courant
                const weekNumber = Utility.getWeek(this.currentYear, this.currentMonth, startDayOfWeek);

                // Créer une cellule pour représenter la semaine
                var weekCell = new Konva.Rect({
                    width: (endDayOfWeek - startDayOfWeek + 1) * this.cellWidth - 1,
                    height:this.cellHeight - 1,
                    fill: 'white',
                    stroke: 'gray',
                    strokeWidth: 0.5,

                });

                weekCell.position({
                    x: startX,
                    y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
                });

                var text = new Konva.Text({
                    text: `${weekNumber}/ ${this.currentYear}`, // Vous pouvez personnaliser le texte ici si nécessaire
                    width: (endDayOfWeek - startDayOfWeek + 1) * this.cellWidth,
                    height: this.cellHeight,
                    align: 'left',
                    verticalAlign: 'middle',
                    fontSize: 16,
                    fill: '#279EFF',
                });

                text.position({
                    x: startX + 10,
                    y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
                });

                weeksinfo.push(weekCell);
                weeksText.push(text);
            }
            this.tableLayer.add(...weeksinfo);
            this.tableLayer.add(...weeksText);

        }
    }
}
