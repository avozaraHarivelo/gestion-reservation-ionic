import Konva from "konva";
import { Utility } from "src/app/appcore/utility";
import { ReservationCell } from "./reservation-cell";
import { Room } from "src/app/models/room";
import { Booking } from "src/app/models/booking";
import { MatDialog } from "@angular/material/dialog";

export interface CalendarData {
    currentYear: number;
    cellWidthRoom: number;
    cellWidthDay: number;
    rooms: Room[];
    bookings: Booking[];
}

export function updateCalendar(
    limite: string,
    calendarData: CalendarData,
    cellHeight: number,
    cellWidth: number,
    dialog: MatDialog
) {
    const { currentYear, cellWidthRoom, rooms, bookings } = calendarData;
    let currentMonth = 0;
    const monthName = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const yearDays = Number(Utility.getDaysInYear(currentYear));
    const monthDays = Number(Utility.getDaysInMonth(currentYear, currentMonth));
    const canvasWidth = limite === "année" ? cellWidthRoom * 3 + (cellWidth * yearDays) : cellWidthRoom * 3 + (cellWidth * monthDays);

console.log(`canvasWidth :${canvasWidth} widthcell:${cellWidth}`);


    const tableStage = new Konva.Stage({
        container: 'table-container',
        width: canvasWidth,
        height: cellHeight * (rooms.length + 2) + 30,
    });

    const tableLayer = new Konva.Layer();
    tableStage.add(tableLayer);



    const reservationCellInstance = new ReservationCell(
        cellWidth,
        cellHeight,
        cellWidthRoom,
        tableLayer,
        rooms,
        bookings
    );

    function isReservationInCurrentMonth(booking: Booking): boolean {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);

        return (
            startDate.getFullYear() === currentYear &&
            startDate.getMonth() === currentMonth &&
            endDate.getFullYear() === currentYear &&
            endDate.getMonth() === currentMonth
        );
    }

    // Méthode pour créer les cellules représentant les mois et les en-têtes
    function createMonthCellsAndHeaders() {

        let positionX = cellWidthRoom * 3;
        // Parcourir les mois et afficher chaque mois côte à côte
        monthName.forEach((mois, index) => {

            var joursDansMois = Utility.getDaysInMonth(currentYear, index);

            // Créer une cellule pour représenter le mois
            var celluleMois = new Konva.Rect({
                width: joursDansMois * cellWidth - 1,
                height: 30 - 1,
                fill: '#f0f0f0',
                stroke: 'black',
                strokeWidth: 1,
            });
            celluleMois.position({
                x: positionX,
                y: 0,
            });

            // Créer la cellule Konva pour l'en-tête du mois
            var enTeteMois = new Konva.Text({
                text: `${mois} ${currentYear}`,
                width: joursDansMois * cellWidth,
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

            tableLayer.add(celluleMois);
            // Ajouter la cellule à la couche
            tableLayer.add(enTeteMois);

            // Mettre à jour la position (x) pour le prochain mois
            positionX += joursDansMois * cellWidth;
        });
    }

    function createWeekCellsYears() {
        let positionXSemaine = cellWidthRoom * 3;

        monthName.forEach((_mois, index) => {
            const monthDays = Utility.getDaysInMonth(currentYear, index);
            const premierJourDuMois = new Date(currentYear, index, 1).getDay();
            const premierJourDuMoisLundi = premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;
            const semainesDansMois = Math.ceil((monthDays + premierJourDuMois) / 7);

            for (let semaine = 0; semaine < semainesDansMois; semaine++) {
                const premierJourSemaine = semaine * 7 - premierJourDuMois + 1;
                const numeroSemaine = Utility.getWeek(currentYear, index, premierJourSemaine);

                if (numeroSemaine === currentMonth) continue;

                currentMonth = numeroSemaine;

                const celluleSemaine = new Konva.Rect({
                    width: (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * cellWidth : 7 * cellWidth - 1,
                    height: cellHeight - 1,
                    fill: '#f0f0f0',
                    stroke: 'black',
                    strokeWidth: 1,
                });

                celluleSemaine.position({
                    x: positionXSemaine,
                    y: 30,
                });

                const texteSemaine = new Konva.Text({
                    text: `${(index === 0 && semaine === 0) ? '1' : numeroSemaine}/ ${currentYear}`,
                    width: (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * cellWidth : 7 * cellWidth,
                    height: cellHeight,
                    align: 'left',
                    verticalAlign: 'middle',
                    fontSize: 16,
                    fill: 'black',
                });

                texteSemaine.position({
                    x: positionXSemaine + 10,
                    y: 30,
                });

                tableLayer.add(celluleSemaine);
                tableLayer.add(texteSemaine);

                positionXSemaine += (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * cellWidth : 7 * cellWidth;
            }
        });
    }

    function createWeekCellsMonth() {


        // Calculer le nombre de semaines dans le mois en fonction du premier jour du mois et du nombre de jours dans le mois
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const weeksInMonth = Math.ceil((monthDays + firstDayOfMonth) / 7);

        // Créer une boucle pour parcourir les semaines du mois
        for (let week = 0; week < weeksInMonth; week++) {
            // Calculer le nombre de jours dans la semaine actuelle
            const startDayOfWeek = week * 7 - firstDayOfMonth + 2;
            const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);

            // Calculer la position X de la première cellule de la semaine
            const startX = cellWidthRoom * 3 + Math.max(0, (startDayOfWeek - 1) * cellWidth);

            // Calculer la position du semaine dans l'année courant
            const weekNumber = Utility.getWeek(currentYear, currentMonth, startDayOfWeek);

            // Créer une cellule pour représenter la semaine
            var weekCell = new Konva.Rect({
                width: (endDayOfWeek - startDayOfWeek + 1) * cellWidth - 1,
                height: cellHeight - 1,
                fill: '#f0f0f0',
                stroke: 'black',
                strokeWidth: 1,
            });

            weekCell.position({
                x: startX,
                y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
            });

            var text = new Konva.Text({
                text: `${weekNumber}/ ${currentYear}`, // Vous pouvez personnaliser le texte ici si nécessaire
                width: (endDayOfWeek - startDayOfWeek + 1) * cellWidth,
                height: cellHeight,
                align: 'left',
                verticalAlign: 'middle',
                fontSize: 16,
                fill: 'black',
            });

            text.position({
                x: startX + 10,
                y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
            });

            tableLayer.add(weekCell);
            tableLayer.add(text);
        }




    }

    function createDayCells() {
        let positionXDay = cellWidthRoom * 3;

        // Parcourir les mois et afficher chaque mois côte à côte
        monthName.forEach((_mois, index) => {
            const monthDays = Utility.getDaysInMonth(currentYear, index);

            // Créer une boucle pour parcourir les jours du mois
            for (let jour = 1; jour <= monthDays; jour++) {
                const cellPositionX = positionXDay + (jour - 1) * cellWidth;

                // Créer une cellule pour représenter le jour
                const celluleJour = new Konva.Rect({
                    width: cellWidth - 1,
                    height: cellHeight - 1,
                    fill: '#ffffff',
                    stroke: 'black',
                    strokeWidth: 1,
                });

                celluleJour.position({
                    x: cellPositionX,
                    y: 30 + cellHeight,
                });

                const currentDate = new Date(currentYear, index, jour);
                const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'short' });

                const text = new Konva.Text({
                    text: `${dayOfWeek} ${jour}`,
                    width: cellWidth,
                    height: cellHeight,
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 16,
                    fill: 'black',
                });

                text.position({
                    x: cellPositionX,
                    y: 30 + cellHeight,
                });

                tableLayer.add(celluleJour);
                tableLayer.add(text);
            }

            positionXDay += monthDays * cellWidth;
        });
    }

    function createRoomInfoCells() {

        const { cellWidthRoom, rooms } = calendarData;
        const attributes = [
            { key: 'name', color: '#f0f0f0' },
            { key: 'category', color: '#f0f0f0' },
            { key: 'type', color: '#f0f0f0' }
        ];

        for (let row = 1; row <= rooms.length; row++) {
            const positionY = row * cellHeight + 30 + cellHeight;

            attributes.forEach((attr, index) => {
                const cell = new Konva.Rect({
                    width: cellWidthRoom - 1,
                    height: cellHeight - 1,
                    fill: attr.color,
                    stroke: 'black',
                    strokeWidth: 1,
                    className: 'table-cell'
                });

                cell.position({
                    x: cellWidthRoom * index,
                    y: positionY
                });

                let textData = '';

                if (index === 0) {
                    textData = rooms[row - 1].name;
                } else if (index === 1) {
                    textData = rooms[row - 1].category;
                } else if (index === 2) {
                    textData = rooms[row - 1].type;
                }

                const text = new Konva.Text({
                    text: textData,
                    width: cellWidthRoom,
                    height: cellHeight,
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 14,
                    fill: 'black'
                });

                text.position({
                    x: cellWidthRoom * index,
                    y: positionY
                });

                tableLayer.add(cell);
                tableLayer.add(text);
            });
        }
    }

    function resizeHeigth() {
        for (let row = rooms.length; row >= 1; row--) {

            // Créer la cellule de sélection pour les noms de chambre
            var select = new Konva.Rect({
                width: cellWidthRoom * 3 - 1,
                height: cellHeight - 1,
                opacity: 0.1,
                strokeWidth: 1,
                className: 'table-cell'
            });
            select.position({
                x: 0,
                y: row * cellHeight + 30 + cellHeight,
            });

            // create new transformer
            var t = new Konva.Transformer({
                rotateEnabled: false,
                enabledAnchors: ['bottom-center'],
                boundBoxFunc: (oldBox, newBox) => {
                    // Obtenir la nouvelle hauteur
                    cellHeight = newBox.height;

                    updateCalendar(limite, calendarData, newBox.height, cellWidth, dialog)

                    // Redessiner la couche du tableau pour mettre à jour les changements
                    tableLayer.draw();

                    return newBox;
                }
            });

            tableLayer.add(t);
            tableLayer.add(select);

            t.nodes([select]);
        }
    }

    function resizeWidth() {
        const width = limite == "année" ? yearDays : monthDays;

        for (let cell = width; cell >= 0; cell--) {

            var day = new Konva.Rect({
                width: cellWidth - 1,
                height: cellHeight - 1,
                opacity: 0.1,
                strokeWidth: 1,
                className: 'days-cell'
            });


            day.position({
                x: cellWidthRoom * 3 + (cell) * cellWidth,
                y: 30 + cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
            });
            // create new transformer
            var t = new Konva.Transformer({
                rotateEnabled: false,
                enabledAnchors: ['middle-right'],
                boundBoxFunc: (oldBox, newBox) => {
                    // Obtenir la nouvelle hauteur
                    cellWidth = newBox.width;

                    updateCalendar(limite, calendarData, cellHeight, newBox.width, dialog)

                    // Redessiner la couche du tableau pour mettre à jour les changements
                    tableLayer.draw();

                    return newBox;
                }
            });

            tableLayer.add(t);
            tableLayer.add(day);

            t.nodes([day]);
        }

    }

    function createVoidCelles() {
        const { cellWidthRoom, rooms } = calendarData;
        const numberVoid = limite == "année" ? yearDays : monthDays;

        const cellOptions = {
            width: cellWidth - 1,
            height: cellHeight - 1,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            className: 'table-cell'
        };

        for (let row = 1; row <= rooms.length; row++) {
            for (let col = 1; col <= numberVoid; col++) {
                const positionX = cellWidthRoom * 3 + (col - 1) * cellWidth;
                const positionY = row * cellHeight + 30 + cellHeight;

                const cell = new Konva.Rect(cellOptions);
                cell.position({ x: positionX, y: positionY });

                const text = new Konva.Text({
                    text: '',
                    width: cellWidth,
                    height: cellHeight,
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 14,
                    fill: 'black'
                });

                text.position({ x: positionX, y: positionY });

                tableLayer.add(cell);
                tableLayer.add(text);
            }
        }
    }


    function createReservationCells() {
        for (const booking of bookings) {
            createReservationCell(booking);
        }
    }

    function createReservationCell(booking: Booking) {
        const room = rooms.find((room) => room.roomId === booking.roomId);
        if (room && isReservationInCurrentMonth(booking)) {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            reservationCellInstance.createReservationCell(
                tableStage,
                room,
                startDate,
                endDate,
                dialog
            );
        }
    }

    function adjustStageBorder() {
        const stageWidth = tableStage.width();
        const stageHeight = tableStage.height();

        const containerDiv = document.getElementById('table-container');
        if (containerDiv) {
            containerDiv.style.width = stageWidth + 'px';
            containerDiv.style.height = stageHeight + 'px';
        }
    }

    console.log(`limite: ${limite} currentYear:${currentYear} cellWidthRoom:${cellWidthRoom} rooms${rooms} bookings${bookings}`)

    createMonthCellsAndHeaders();
    limite == "année" ? createWeekCellsYears() : createWeekCellsMonth();
    createDayCells();
    createRoomInfoCells();
    resizeHeigth();
    resizeWidth();
    createVoidCelles();
    createReservationCells();

    adjustStageBorder();

    window.addEventListener('resize', adjustStageBorder);
}