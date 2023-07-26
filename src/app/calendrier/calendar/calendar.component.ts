import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { ChangeReservationArg } from '../change-reservation-arg';
import { ReservationArg } from '../reservation-arg';
import { DateAndWeek, DateManager, StepHours } from '../date-manager';
import { HeaderDays } from '../models/header-days';
import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { ChangeDateArg } from '../change-date-arg';
import { StatusbarArg } from '../change-status-bar-arg';
import Konva from 'konva';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() year: number = 0;
  @Input() month: number = 0;
  @Input() day: number = 0;
  @Input() rooms: Room[];
  @Input() bookings: Booking[];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  @ViewChild(CalendarNavbarComponent) navbar: any;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  headerdays: HeaderDays = new HeaderDays();
  @Input() statusbar: Booking = new Booking();
  manager: DateManager;

  currentMonth: number = 6; // Exemple : juillet (0 pour janvier, 1 pour février, ..., 11 pour décembre)
  currentYear: number = 2023; // Exemple : 2023


  constructor() {
    this.manager = new DateManager();
    this.rooms = [];
    this.bookings = [];
  }

  get currentYMD(): Date {
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return new Date();
    }
  }

  ngOnInit() {

    this.updateCalendar();

  }
  onPrevMonth() {
    this.currentMonth--; // Décrémenter le mois actuel pour aller au mois précédent
    if (this.currentMonth < 0) {
      this.currentMonth = 11; // Si le mois est inférieur à 0, revenir à décembre (11)
      this.currentYear--; // Décrémenter l'année lorsque nous atteignons janvier de l'année précédente
    }
    this.updateCalendar(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }

  onNextMonth() {
    this.currentMonth++; // Incrémenter le mois actuel pour aller au mois suivant
    if (this.currentMonth > 11) {
      this.currentMonth = 0; // Si le mois est supérieur à 11, revenir à janvier (0)
      this.currentYear++; // Incrémenter l'année lorsque nous atteignons décembre de l'année suivante
    }
    this.updateCalendar(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }

  updateCalendar() {

    // Dimensions des cellules pour les noms de chambre et les jours du mois
    var cellWidthRoom = 100;
    var cellWidthDay = 70;
    var cellHeight = 50;
    var numRooms = 6; // Nombre de chambres

   

    // Fonction pour obtenir le nombre de jours dans un mois donné
    function getDaysInMonth(year: number, month: number) {
      return new Date(year, month + 1, 0).getDate();
    }

    var monthDays = getDaysInMonth(this.currentYear, this.currentMonth);

    var monthName = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Calculer la largeur du canvas en fonction du nombre de jours dans le mois
    var canvasWidth = cellWidthRoom * 3 + (cellWidthDay * monthDays); // Largeur de la colonne des noms des chambres + largeur des jours du mois

    // Initialiser le stage pour le tableau Konva avec la largeur calculée
    var tableStage = new Konva.Stage({
      container: 'table-container',
      width: canvasWidth,
      height: cellHeight * (numRooms + 1) + 30, // +1 pour l'en-tête des jours du mois, +30 pour la hauteur de l'en-tête
    });

    // Initialiser le calque pour le tableau Konva
    var tableLayer = new Konva.Layer();
    tableStage.add(tableLayer);

    // Créer la cellule Konva pour l'en-tête du mois
    var monthHeader = new Konva.Text({
      text: `${monthName[this.currentMonth]} ${this.currentYear}`,
      width: canvasWidth,
      height: 30,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 18,
      fontStyle: 'bold',
      fill: 'black',
    });

    monthHeader.position({
      x: 0,
      y: 0,
    });

    tableLayer.add(monthHeader);

    // Créer les cellules Konva pour l'en-tête des jours du mois
    for (let col = 1; col <= monthDays; col++) {
      var cell = new Konva.Rect({
        width: cellWidthDay - 1, // 1px pour compenser la bordure
        height: cellHeight - 1, // 1px pour compenser la bordure
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cell.position({
        x: cellWidthRoom * 3 + (col - 1) * cellWidthDay,
        y: 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var currentDate = new Date(this.currentYear, this.currentMonth, col);
      var dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'short' });

      var text = new Konva.Text({
        text: `${dayOfWeek} ${col} `,
        width: cellWidthDay,
        height: cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 16,
        fill: 'black',
      });

      text.position({
        x: cellWidthRoom * 3 + (col - 1) * cellWidthDay,
        y: 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      tableLayer.add(cell);
      tableLayer.add(text);
    }
    // Créer les cellules Konva pour les noms des chambres, catégorie et type de chambre
    var roomData = [
      { name: 'Chambre 101', category: 'Catégorie A', type: 'Simple' },
      { name: 'Chambre 102', category: 'Catégorie B', type: 'Double' },
      { name: 'Chambre 103', category: 'Catégorie A', type: 'Simple' },
      { name: 'Chambre 104', category: 'Catégorie C', type: 'Suite' },
      { name: 'Chambre 105', category: 'Catégorie B', type: 'Double' },
      { name: 'Chambre 106', category: 'Catégorie A', type: 'Simple' }
    ];

    for (let row = 1; row <= numRooms; row++) {
      for (let col = 0; col <= monthDays; col++) {
        var cell = new Konva.Rect({
          width: col === 0 ? cellWidthRoom - 1 : cellWidthDay - 1, // 1px pour compenser la bordure
          height: cellHeight - 1, // 1px pour compenser la bordure
          fill: col === 0 ? '#f0f0f0' : 'white', // Les cellules de nom de chambre sont grises, les autres sont blanches
          stroke: 'black',
          strokeWidth: 1,
        });

        cell.position({
          x: col === 0 ? 0 : cellWidthRoom * 3 + (col - 1) * cellWidthDay,
          y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
        });

        var text = new Konva.Text({
          text: col === 0 ? roomData[row - 1].name : '', // Le texte des cellules de nom de chambre est le nom de la chambre, sinon vide
          width: col === 0 ? cellWidthRoom : cellWidthDay,
          height: cellHeight,
          align: 'center',
          verticalAlign: 'middle',
          fontSize: 14,
          fill: 'black',
        });

        text.position({
          x: col === 0 ? 0 : cellWidthRoom * 3 + (col - 1) * cellWidthDay,
          y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
        });

        tableLayer.add(cell);
        tableLayer.add(text);
      }

      // Ajouter la colonne "Catégorie" à côté des noms de chambre
      var cellCategory = new Konva.Rect({
        width: cellWidthRoom - 1,
        height: cellHeight - 1,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cellCategory.position({
        x: cellWidthRoom,
        y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var textCategory = new Konva.Text({
        text: roomData[row - 1].category,
        width: cellWidthRoom,
        height: cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        fill: 'black',
      });

      textCategory.position({
        x: cellWidthRoom,
        y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      tableLayer.add(cellCategory);
      tableLayer.add(textCategory);

      // Ajouter la colonne "Type de chambre" à côté des noms de chambre
      var cellType = new Konva.Rect({
        width: cellWidthRoom - 1,
        height: cellHeight - 1,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cellType.position({
        x: cellWidthRoom * 2,
        y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var textType = new Konva.Text({
        text: roomData[row - 1].type,
        width: cellWidthRoom,
        height: cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        fill: 'black',
      });

      textType.position({
        x: cellWidthRoom * 2,
        y: row * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      tableLayer.add(cellType);
      tableLayer.add(textType);
    }

    tableLayer.draw();


    tableLayer.draw();

    // Créer la cellule Konva déplaçable (bleue)
    var draggableCell = new Konva.Rect({
      width: cellWidthDay,
      height: cellHeight,
      fill: 'blue',
      opacity: 0.7,
      draggable: true,
    });

    draggableCell.position({
      x: 100,
      y: 80,
    });

    // Ajouter l'événement dragstart pour mettre la cellule au-dessus des autres
    draggableCell.on('dragstart', function () {
      draggableCell.moveToTop();
      tableLayer.draw();
    });

    draggableCell.on('dragend', function (e) {
      var newPosition = e.target.position();
    
      // Ajuster le calcul en fonction de la nouvelle largeur des cellules
      var cellX = Math.floor((newPosition.x - cellWidthRoom * 3) / cellWidthDay);
      var cellY = Math.floor((newPosition.y - 30) / cellHeight); // 30 est la hauteur de l'en-tête des jours du mois
    
      // Appliquer la nouvelle position
      draggableCell.position({
        x: cellWidthRoom * 3 + cellX * cellWidthDay,
        y: cellY * cellHeight + 30, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });
    
      tableLayer.draw();
    });

    // Événement dragmove pour limiter le mouvement et la position de la cellule bleue
    draggableCell.on('dragmove', function (e) {
      var newPosition = e.target.position();
      var maxX = tableStage.width() - cellWidthDay;
      var maxY = tableStage.height() - cellHeight;

      // Limiter le mouvement aux cellules vides (jours du mois)
      newPosition.y = Math.max(newPosition.y, 80);
      newPosition.x = Math.max(newPosition.x, cellWidthRoom*3);
      newPosition.x = Math.min(newPosition.x, maxX);
      newPosition.y = Math.min(newPosition.y, maxY);

      e.target.position(newPosition);
      tableLayer.draw();
    });

    tableLayer.add(draggableCell);




   // Créer un Transformer pour le redimensionnement de la cellule bleue
var tr = new Konva.Transformer({
  rotateEnabled: false, // Désactiver la rotation
  enabledAnchors: ['middle-right'], // Activer uniquement les poignées de redimensionnement  droite
  boundBoxFunc: function (oldBox, newBox) {
    // Calculer la largeur initiale de la cellule bleue
    var initialWidth = cellWidthDay * Math.ceil(oldBox.width / cellWidthDay);

    // Trouver le multiple le plus proche de cellWidthDay pour la nouvelle largeur
    var closestMultiple = cellWidthDay * Math.round(newBox.width / cellWidthDay);

    // Limiter la largeur minimale de la cellule bleue à cellWidthDay
    if (newBox.width < cellWidthDay) {
      newBox.width = cellWidthDay;
    }

    // Limiter la largeur maximale de la cellule bleue à cellWidthRoom
    if (newBox.width > cellWidthRoom) {
      newBox.width = cellWidthRoom;
    }

    // Utiliser le multiple le plus proche de cellWidthDay pour ajuster la largeur
    newBox.width = closestMultiple;

    return newBox;
  },
});

// Ajouter la cellule bleue et le Transformer au calque
tableLayer.add(draggableCell);
tableLayer.add(tr);

// Lier le Transformer à la cellule bleue
tr.nodes([draggableCell]);

    // Ajuster dynamiquement la taille de la bordure en fonction de la taille du contenu du stage
    function adjustStageBorder() {
      var stageWidth = tableStage.width();
      var stageHeight = tableStage.height();

      var containerDiv = document.getElementById('table-container');
      if (containerDiv) {
        containerDiv.style.width = stageWidth + 'px';
        containerDiv.style.height = stageHeight + 'px';
      }
    }

    // Appeler la fonction d'ajustement lors de l'initialisation
    adjustStageBorder();

    // Appeler la fonction d'ajustement lors du redimensionnement de la fenêtre pour gérer les changements de taille
    window.addEventListener('resize', adjustStageBorder);


  }


  onDaysChanged(data: ChangeDateArg) {
    this.headerdays = data.days;
    const startDate = data.days.startDate;
    const endDate = data.days.endDate;
    const roomtype = data.roomtype;
    const args = new ChangeReservationArg(data.type, data.operation, roomtype, startDate, endDate);
    this.changereservation.emit(args);

  }

  getRandomNumberFromArray(): number {
    const numbers: number[] = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    const randomIndex: number = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  }
  onStatusbarChanged(args: StatusbarArg) {
    if (args.type === 'enter') {
      this.statusbar = args.booking;
    } else {
      this.statusbar = new Booking;
    }
  }

  onDayReservation(args: ReservationArg) {
    this.reservation.emit(args);
  }

  isReserved(room: Room, day: DateAndWeek): boolean {
    return this.bookings.some(b => b.roomId === room.roomId && day.date >= b.startDate && day.date <= b.endDate);
  }

  isFirstDayOfReservation(room: Room, day: DateAndWeek): boolean {
    return this.bookings.some(b => b.roomId === room.roomId && day.date.getTime() === b.startDate.getTime());
  }

  getColspan(room: Room, day: DateAndWeek): number {
    const booking = this.bookings.find(b => b.roomId === room.roomId && day.date >= b.startDate && day.date <= b.endDate);
    if (booking) {
      const duration = booking.endDate.getTime() - booking.startDate.getTime();
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      return days + 1;
    }
    return 1;
  }
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
