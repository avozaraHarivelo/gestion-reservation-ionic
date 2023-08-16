import Konva from "konva";
import { Utility } from "src/app/appcore/utility";
import { ReservationCell } from "./reservation-cell";
import { Room } from "src/app/models/room";
import { Booking } from "src/app/models/booking";
import { MatDialog } from "@angular/material/dialog";
import { Rect } from "konva/lib/shapes/Rect";
import { Text } from "konva/lib/shapes/Text";

export interface CalendarData {
    currentYear: number;
    cellWidthRoom: number;
    cellWidthDay: number;
    rooms: Room[];
    bookings: Booking[];
}

export function updateCalendar(
    currentMonth: number,
    limite: string,
    calendarData: CalendarData,
    cellHeight: number,
    cellWidth: number,
    dialog: MatDialog
) {
    const { currentYear, cellWidthRoom, rooms, bookings } = calendarData;
    console.log(`currentMonth:number:${currentMonth} currentYear:${currentYear}`);

    const monthName = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const roomCells: Rect[] = [];
    const roomTexts: Text[] = [];
    const cellStartXPositions: number[] = [];
    const textStartXPositions: number[] = [];
    const weeksinfo: Rect[] = [];
    const weeksText: Text[] = [];
    const daysinfo: Rect[] = [];
    const textDaysinfo: Text[] = [];
    const roomCellsHeader: Rect[] = [];
    const roomCellsHeaderText: Text[] = [];
    const cellResizeWidth: Rect[] = []
    const voidCells: Rect[] = [];
    const textVoidCells: Text[] = [];
    const cellResizeHeigth: Rect[] = [];

    const attributes = [
        { key: 'name', color: '#f0f0f0' },
        { key: 'category', color: '#f0f0f0' },
        { key: 'type', color: '#f0f0f0' }
    ];


    const yearDays = Number(Utility.getDaysInYear(currentYear));
    const monthDays = Number(Utility.getDaysInMonth(currentYear, currentMonth));
    const canvasWidth = limite === "année" ? cellWidthRoom * 3 + (cellWidth * yearDays) : cellWidthRoom * 3 + (cellWidth * monthDays);

let heightTemp= cellHeight;
let widthTemp = cellWidth;
    console.log(`cellHeight :${cellHeight} cellWidth:${cellWidth}`);


    let tableStage = new Konva.Stage({
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
                stroke: 'gray',
                strokeWidth: 0.5,
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
    function createMonthCells() {

        let positionX = cellWidthRoom * 3;
        // Parcourir les mois et afficher chaque mois côte à côte


        var joursDansMois = Utility.getDaysInMonth(currentYear, currentMonth);

        // Créer une cellule pour représenter le mois
        var celluleMois = new Konva.Rect({
            width: joursDansMois * cellWidth - 1,
            height: 30 - 1,
            fill: '#A8A196',
            stroke: 'gray',
            strokeWidth: 0.5,
        });
        celluleMois.position({
            x: positionX,
            y: 0,
        });

        // Créer la cellule Konva pour l'en-tête du mois
        var enTeteMois = new Konva.Text({
            text: `${monthName[currentMonth]} ${currentYear}`,
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

                if (numeroSemaine === 0) continue;

                currentMonth = numeroSemaine;

                const celluleSemaine = new Konva.Rect({
                    width: (index === 0 && semaine === 0) ? (7 - premierJourDuMoisLundi) * cellWidth : 7 * cellWidth - 1,
                    height: cellHeight - 1,
                    fill: '#f0f0f0',
                    stroke: 'gray',
                    strokeWidth: 0.5,
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
                fill: 'white',
                stroke: 'gray',
                strokeWidth: 0.5,
                
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
                fill: '#279EFF',
            });

            text.position({
                x: startX + 10,
                y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
            });

            weeksinfo.push(weekCell);
            weeksText.push(text);
        }
        tableLayer.add(...weeksinfo);
        tableLayer.add(...weeksText);




    }

    function redimenssionDayCellsMonth(width: number) {
        let positionXDay = cellWidthRoom * 3;
        const monthDays = Utility.getDaysInMonth(currentYear, currentMonth);

        // Créer une boucle pour parcourir les jours du mois
        for (let jour = 1; jour <= monthDays; jour++) {
            const cellPositionX = positionXDay + (jour - 1) * width;
            daysinfo[jour - 1].x(cellPositionX);
            textDaysinfo[jour - 1].x(cellPositionX);
            daysinfo[jour - 1].width(width - 1);
            textDaysinfo[jour - 1].width(width);
            tableLayer.batchDraw();
        }

    }

    function rdimensionnerWeekCellsMonth(width: number) {



        // Calculer le nombre de semaines dans le mois en fonction du premier jour du mois et du nombre de jours dans le mois
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        weeksinfo.forEach((cell, key) => {
            // Calculer le nombre de jours dans la semaine actuelle
            const startDayOfWeek = key * 7 - firstDayOfMonth + 2;
            const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);
            const startX = cellWidthRoom * 3 + Math.max(0, (startDayOfWeek - 1) * width);
            const newWidth = (endDayOfWeek - startDayOfWeek + 1) * width - 1
            cell.x(startX);
            cell.width(newWidth)

            tableLayer.batchDraw();

        });

        weeksText.forEach((cell, key) => {
            // Calculer le nombre de jours dans la semaine actuelle
            const startDayOfWeek = key * 7 - firstDayOfMonth + 2;
            const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);
            const startX = cellWidthRoom * 3 + Math.max(0, (startDayOfWeek - 1) * width);
            const newWidth = (endDayOfWeek - startDayOfWeek + 1) * width - 1
            cell.x(startX);
            cell.width(newWidth)

            tableLayer.batchDraw();

        });


    }

    function createDayCellsYears() {
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
                    // stroke: 'black',
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
                    // fill: 'black',
                });

                text.position({
                    x: cellPositionX,
                    y: 30 + cellHeight,
                });

                tableLayer.add(celluleJour);
                //  daysinfo.push(celluleJour);
                tableLayer.add(text);
            }

            positionXDay += monthDays * cellWidth;
        });

        tableLayer.add(...daysinfo);
    }

    function createDayCellsMonth() {
        let positionXDay = cellWidthRoom * 3;


        const monthDays = Utility.getDaysInMonth(currentYear, currentMonth);


        // Créer une boucle pour parcourir les jours du mois
        for (let jour = 1; jour <= monthDays; jour++) {
            const cellPositionX = positionXDay + (jour - 1) * cellWidth;

            // Créer une cellule pour représenter le jour
            const celluleJour = new Konva.Rect({
                width: cellWidth - 1,
                height: cellHeight - 1,
                fill: '#ffffff',
                stroke: 'gray',
                strokeWidth: 0.5,
            });

            celluleJour.position({
                x: cellPositionX,
                y: 30 + cellHeight,
            });

            const currentDate = new Date(currentYear, currentMonth, jour);
            const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'short' });

            const text = new Konva.Text({
                text: `${dayOfWeek} ${jour}`,
                width: cellWidth,
                height: cellHeight,
                align: 'center',
                verticalAlign: 'middle',
                fontSize: 16,
                fill: '#279EFF',
            });

            text.position({
                x: cellPositionX,
                y: 30 + cellHeight,
            });

            //  tableLayer.add(celluleJour);
            daysinfo.push(celluleJour);
            textDaysinfo.push(text);
            // tableLayer.add(text);
        }



        tableLayer.add(...daysinfo);
        tableLayer.add(...textDaysinfo);
    }


    function createRoomInfoCells() {

        const { cellWidthRoom, rooms } = calendarData;


        attributes.forEach((attr, index) => {
            const startX = cellWidthRoom * index;
            const cell = new Konva.Rect({
                width: cellWidthRoom - 1,
                height: 30 + cellHeight * 2,
                fill: attr.color,
                stroke: 'grey',
                strokeWidth: 0.5,
                className: 'table-cell'
            });

            cell.position({
                x: cellWidthRoom * index,
                y: 0
            });




            let textData = '';

            if (index === 0) {
                textData = "Nom";
            } else if (index === 1) {
                textData = "Categorie";
            } else if (index === 2) {
                textData = "Type";
            }

            const text = new Konva.Text({
                text: textData,
                width: cellWidthRoom,
                height: 30 + cellHeight * 2,
                align: 'center',
                verticalAlign: 'middle',
                fontSize: 14,
                fontStyle: 'bold',
                fill: 'black'
            });

            text.position({
                x: cellWidthRoom * index,
                y: 0
            });

            roomCellsHeader.push(cell);
            roomCellsHeaderText.push(text);
        })



        tableLayer.add(...roomCellsHeader);
        tableLayer.add(...roomCellsHeaderText);



        for (let row = 1; row <= rooms.length; row++) {
            const positionY = row * cellHeight + 30 + cellHeight;

            attributes.forEach((attr, index) => {

                const startX = cellWidthRoom * index;
                cellStartXPositions.push(startX); // Stockez les positions X de départ des cellules
                textStartXPositions.push(startX);
                const cell = new Konva.Rect({
                    width: cellWidthRoom - 1,
                    height: cellHeight - 1,
                    fill: attr.color,
                    stroke: 'grey',
                    strokeWidth: 0.5,
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
                    fontStyle: 'bold',
                    fill: 'black'
                });

                text.position({
                    x: cellWidthRoom * index,
                    y: positionY
                });

                roomCells.push(cell);
                roomTexts.push(text);


            });
        }
        tableLayer.add(...roomCells);
        tableLayer.add(...roomTexts);

    }

    function redimensionRoomInfoCells(height: number) {
        const originalPositionY = 30 + cellHeight * 2

        let columnNumber = attributes.length - 1;
        let currentRow = 0;
        let currentColumn = 0;
        // Redimensionnement des cellules en hauteur
        roomCells.forEach((cell) => {
            const positionY = originalPositionY + currentRow * height;
            cell.y(positionY);
            cell.height(height);

            if (currentColumn == columnNumber) {
                currentColumn = 0
                currentRow++
            } else {
                currentColumn++
            }


            tableLayer.batchDraw();
        });

        currentRow = 0;
        currentColumn = 0;
        // Redimensionnement des cellules en hauteur
        roomTexts.forEach((cell) => {
            const positionY = originalPositionY + currentRow * height;
            cell.y(positionY);
            cell.height(height);

            if (currentColumn == columnNumber) {
                currentColumn = 0
                currentRow++
            } else {
                currentColumn++
            }


            tableLayer.batchDraw();
        });
    }

    // function redimCellHeigth(height: number) {

    //     let rowNumber = cellResizeHeigth.length - 1;
    //     for (let row = rowNumber; row >= 0; row--) {
    //         console.log(`new heigth:${height} row: ${row}`, cellResizeHeigth[row])
    //         cellResizeHeigth[row].y(30 + cellHeight * 2 + height * row)
    //         cellResizeHeigth[row].height(height)
    //         tableLayer.batchDraw()
    //     }




    // }
    function resizeHeigth() {
        var t = new Konva.Transformer({
            rotateEnabled: false,
            enabledAnchors: ['bottom-center'],
            boundBoxFunc: (oldBox, newBox) => {
             heightTemp = newBox.height;

                if (newBox.height < 10) {
                    newBox.height = 10
                    return newBox;
                } else if (newBox.width > 300) {
                    newBox.width = 300
                    return newBox;
                }

                redimensionRoomInfoCells(newBox.height);
                redimensionVoidCells(widthTemp, newBox.height);
                tableStage.height(newBox.height * (rooms.length + 2) + 30)
                tableLayer.batchDraw();

                return newBox;
            }
        });
        for (let row = rooms.length; row >= 1; row--) {

            // Créer la cellule de sélection pour les noms de chambre
            var select = new Konva.Rect({
                width: cellWidthRoom * 3 - 1,
                height: cellHeight - 1,
              opacity: 0.1,
               
                strokeWidth: 0.5,
                className: 'table-cell'
            });
            select.position({
                x: 0,
                y:  cellHeight + 30 + cellHeight,
            });

            // create new transformer

            cellResizeHeigth.push(select)


        }
        t.nodes([cellResizeHeigth[cellResizeHeigth.length - 1]]);

        tableLayer.add(...cellResizeHeigth)
        tableLayer.add(t)
       

    }

    function resizeWidth() {
        const width = limite == "année" ? yearDays : monthDays;

        var t = new Konva.Transformer({
            rotateEnabled: false,
            enabledAnchors: ['middle-right'],
            boundBoxFunc: (oldBox, newBox) => {



                widthTemp = newBox.width;
                if (newBox.width < 10) {
                    newBox.width = 10
                    return newBox;
                } else if (newBox.width > 250) {
                    newBox.width = 250
                    return newBox;
                }
                rdimensionnerWeekCellsMonth(newBox.width)
                redimenssionDayCellsMonth(newBox.width)
                redimensionVoidCells(newBox.width, heightTemp)
                tableStage.width(limite === "année" ? cellWidthRoom * 3 + (newBox.width * yearDays) : cellWidthRoom * 3 + (newBox.width * monthDays))

                tableLayer.batchDraw();

                return newBox;
            }
        });


        for (let cell = width; cell >= 0; cell--) {

            var day = new Konva.Rect({
                width: cellWidth - 1,
                height: cellHeight - 1,
                opacity: 0.1,
                stroke: "gray",
                strokeWidth: 0.5,
                className: 'days-cell'
            });


            day.position({
                x: cellWidthRoom * 3 + (cell) * cellWidth,
                y: 30 + cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
            });


            cellResizeWidth.push(day)

            // create new transformer





        }
        t.nodes([cellResizeWidth[cellResizeWidth.length - 1]])

        tableLayer.add(...cellResizeWidth)
        tableLayer.add(t)

    }


    // function redimenssionResize(width: number) {
    //     const w = limite == "année" ? yearDays : monthDays;
    //     let i = 0;
    //     for (let cell = w; cell >= 0; cell--) {

    //         cellResizeWidth[i].width(width - 1);
    //         cellResizeWidth[i].x(cellWidthRoom * 3 + (cell) * width);
    //         i++;

    //         tableLayer.batchDraw()
    //     }


    // }
    function createVoidCelles() {
        const { cellWidthRoom, rooms } = calendarData;
        const numberVoid = limite == "année" ? yearDays : monthDays;
    
        // Définir les couleurs à utiliser
        const colors = ['#F5F5F5', 'white'];
        let currentColorIndex = 0; // Indice de la couleur actuelle
    
        for (let row = 1; row <= rooms.length; row++) {
            const color = colors[currentColorIndex];
            for (let col = 1; col <= numberVoid; col++) {
                const positionX = cellWidthRoom * 3 + (col - 1) * cellWidth;
                const positionY = row * cellHeight + 30 + cellHeight;
    
                // Utiliser la couleur actuelle
    
                const cell = new Konva.Rect({
                    width: cellWidth - 1,
                    height: cellHeight - 1,
                    fill: color,
                    stroke: 'gray',
                    strokeWidth: 0.5,
                    className: 'table-cell'
                });
    
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
    
                voidCells.push(cell);
                textVoidCells.push(text);
    
              
            }
              // Alterner entre les couleurs
              currentColorIndex = (currentColorIndex + 1) % colors.length;
        }
    
        tableLayer.add(...voidCells);
        tableLayer.add(...textVoidCells);
    }
    


    function redimensionVoidCells(width: number, height: number) {
        const numberColumns = (limite == "année" ? yearDays : monthDays) - 1;

        const originalPositionY = 30 + cellHeight * 2
        let currentRow = 0;
        let currentColumn = 0;

        voidCells.forEach((cell, index) => {

            const positionX = cellWidthRoom * 3 + currentColumn * width;
            const positionY = originalPositionY + height * currentRow;

            cell.position({ x: positionX, y: positionY });
            cell.width(width - 1);
            cell.height(height);

            textVoidCells[index].position({ x: positionX, y: positionY });
            textVoidCells[index].width(width - 1);
            textVoidCells[index].height(height);



            if (currentColumn == numberColumns) {
                currentColumn = 0;
                currentRow++;

            } else {
                currentColumn++;
            }

        });

        tableLayer.batchDraw();
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

    limite == "année" ? createMonthCellsAndHeaders() : createMonthCells();
    limite == "année" ? createWeekCellsYears() : createWeekCellsMonth();
    limite == "année" ? createDayCellsYears() : createDayCellsMonth();
    createVoidCelles();
    createReservationCells();
    createRoomInfoCells();
    resizeHeigth();
    resizeWidth();
    
   
    

    let scrollContainer = document.getElementById('canvas-container');

    scrollContainer?.addEventListener('scroll', () => {

        let scrollLeft = scrollContainer?.scrollLeft ?? 0;

        roomCellsHeader.forEach((cell, key) => {
            cell.x(cellStartXPositions[key] + scrollLeft);
            cell.moveToTop();
        });

        roomCellsHeaderText.forEach((text, key) => {
            text.x(textStartXPositions[key] + scrollLeft);
            text.moveToTop();
        });

        roomCells.forEach((cell, key) => {
            cell.x(cellStartXPositions[key] + scrollLeft);
            //  cell.moveToTop();
        });

        roomTexts.forEach((text, key) => {
            text.x(textStartXPositions[key] + scrollLeft);
            //  text.moveToTop();
        });
        console.log(cellResizeHeigth.length)

        cellResizeHeigth[cellResizeHeigth.length - 1].x(scrollLeft)
        
        cellResizeHeigth[cellResizeHeigth.length - 1].y(cellHeight + 30 + cellHeight)
        cellResizeHeigth[cellResizeHeigth.length - 1].moveToTop();

      
        tableLayer.batchDraw();
    });


    adjustStageBorder();

    window.addEventListener('resize', adjustStageBorder);
}


