import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { ChangeReservationArg } from '../change-reservation-arg';
import { ReservationArg } from '../reservation-arg';
import { DateAndWeek, DateManager, StepHours } from '../date-manager';
import { HeaderDays } from '../models/header-days';
import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import Konva from 'konva';
import { MatDialog } from '@angular/material/dialog';
import { NewReservationModalComponent } from 'src/app/components/new-reservation-modal/new-reservation-modal.component';
import { Layer } from 'konva/lib/Layer';
import { RoomService } from 'src/app/service/room-service';
import { ReservationService } from 'src/app/service/reservation-service';
import { FormReservationComponent } from 'src/app/components/form-reservation/form-reservation.component';
import { Utility } from 'src/app/appcore/utility';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() year: number = 0;
  @Input() month: number = 0;
  @Input() day: number = 0;
  rooms: Room[] = []; // Initialisez ici votre tableau de chambres
  bookings: Booking[] = [];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  @ViewChild(CalendarNavbarComponent) navbar: any;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  headerdays: HeaderDays = new HeaderDays();
  @Input() statusbar: Booking = new Booking();
  manager: DateManager;
  tableLayer: Konva.Layer = new Layer;

  currentMonth: number = 6; // Exemple : juillet (0 pour janvier, 1 pour février, ..., 11 pour décembre)
  currentYear: number = 2023; // Exemple : 2023
  cellWidthRoom: number = 100;
  cellWidthDay: number = 70;
  cellHeight: number = 50;
  numRooms: number = 6;
  monthName: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];



  constructor(private dialog: MatDialog, private roomService: RoomService, private reservationService: ReservationService) {
    this.manager = new DateManager();
    this.rooms = this.roomService.getRooms(); // Récupérez la liste des chambres à partir du service

    this.reservationService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
      this.updateCalendar(); // Appelez la mise à jour du calendrier une fois que vous avez les réservations
    });
  }

  get currentYMD(): Date {
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return new Date();
    }
  }

  ngOnInit() {
    this.rooms = this.roomService.getRooms(); // Récupérer la liste des chambres à partir du service
    this.reservationService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
      this.updateCalendar(); // Appelez la mise à jour du calendrier une fois que vous avez les réservations
    });
    this.updateCalendar();



    // Écouter l'événement reservationAdded du composant NewReservationModalComponent
    this.dialog.afterAllClosed.subscribe(() => {
      this.reservationService.getBookings().subscribe((bookings: Booking[]) => {
        this.bookings = bookings;
        this.updateCalendar(); // Appelez la mise à jour du calendrier une fois que vous avez les réservations
      });
    });

  }


  openNewReservationDialog() {
    // Ouvrir la boîte de dialogue en utilisant MatDialog
    const dialogRef = this.dialog.open(NewReservationModalComponent, {
      data: {}, // Vous pouvez passer des données supplémentaires ici si nécessaire
      width: '400px', // Définir la largeur de la boîte de dialogue
      // Vous pouvez également définir d'autres options de boîte de dialogue ici si nécessaire
    });

    // Souscrire à l'événement de fermeture de la boîte de dialogue
    dialogRef.afterClosed().subscribe(result => {
      // Traiter le résultat de la boîte de dialogue ici si nécessaire
      console.log('Résultat de la boîte de dialogue :', result);
    });
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


  public createReservationCell(tableStage: Konva.Stage, selectedRoom: Room, startDate: Date, endDate: Date) {
    const cellWidthDay = this.cellWidthDay;
    const cellHeight = this.cellHeight;
    const cellWidthRoom = this.cellWidthRoom


    // Calculer les positions x et y de la cellule en fonction de la date de début et de fin
    const colStart = Math.floor((startDate.getDate() - 1) * cellWidthDay);
    const colEnd = Math.floor((endDate.getDate() - 1) * cellWidthDay);
    const row = this.rooms.findIndex((room) => room.roomId === selectedRoom.roomId) + 1; // +1 pour sauter l'en-tête des jours du mois

    // Créer la cellule Konva déplaçable (bleue)
    const draggableCell = new Konva.Rect({
      width: colEnd - colStart + cellWidthDay,
      height: cellHeight,
      fill: 'blue',
      opacity: 1,
      draggable: true,
    });

    draggableCell.position({
      x: colStart + 300, // 100 est la position de départ x pour les cellules de chambre
      y: row * cellHeight + 30 + cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
    });


    // Créer le texte à afficher au-dessus de la cellule
    const text = new Konva.Text({
      text: this.findBooking(selectedRoom, startDate, endDate)?.name, // Remplacez par le texte souhaité
      width: colEnd - colStart + cellWidthDay,
      fontSize: 18,
      align: 'center',
      verticalAlign: 'middle',
      fill: 'black',
    });

    // Positionner le texte au-dessus de la cellule
    text.position({
      x: draggableCell.x(),
      y: draggableCell.y() + 20, // Ajuster la position verticale du texte par rapport à la cellule
    });



    // Gérer les événements de déplacement et de redimensionnement

    // Événement dragstart pour mettre la cellule au-dessus des autres
    draggableCell.on('dragstart', () => {
      draggableCell.moveToTop();
      text.moveToTop();
      this.tableLayer.draw();
    });



    // Ajouter l'écouteur d'événements de double-clic pour la cellule de réservation
    draggableCell.on('dblclick', () => {
      this.openReservationModal(selectedRoom, startDate, endDate);
    });

    // Événement dragend pour ajuster la position de la cellule après le déplacement
    draggableCell.on('dragend', (e) => {
      var newPosition = e.target.position();

      // Ajuster le calcul en fonction de la nouvelle largeur des cellules
      var cellX = Math.floor((newPosition.x - cellWidthRoom * 3) / cellWidthDay);
      var cellY = Math.floor((newPosition.y - (30 + cellHeight)) / cellHeight); // 30 est la hauteur de l'en-tête des jours du mois

      // Appliquer la nouvelle position
      draggableCell.position({
        x: cellWidthRoom * 3 + cellX * cellWidthDay,
        y: cellY * cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      // Appliquer la nouvelle position
      text.position({
        x: cellWidthRoom * 3 + cellX * cellWidthDay,
        y: cellY * cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });
      this.tableLayer.draw();
    });

    // Événement dragmove pour limiter le mouvement et la position de la cellule bleue
    draggableCell.on('dragmove', (e) => {
      var newPosition = e.target.position();
      var maxX = tableStage.width() - cellWidthDay;
      var maxY = tableStage.height() - cellHeight;

      // Limiter le mouvement aux cellules vides (jours du mois)
      newPosition.y = Math.max(newPosition.y, 80 + cellHeight);
      newPosition.x = Math.max(newPosition.x, cellWidthRoom * 3);
      newPosition.x = Math.min(newPosition.x, maxX);
      newPosition.y = Math.min(newPosition.y, maxY);

      e.target.position(newPosition);
      this.tableLayer.draw();
    });

    // Événement dragmove pour limiter le mouvement et la position de la cellule bleue
    text.on('dragmove', (e) => {
      var newPosition = e.target.position();
      var maxX = tableStage.width() - cellWidthDay;
      var maxY = tableStage.height() - cellHeight;

      // Limiter le mouvement aux cellules vides (jours du mois)
      newPosition.y = Math.max(newPosition.y, 80 + cellHeight);
      newPosition.x = Math.max(newPosition.x, cellWidthRoom * 3);
      newPosition.x = Math.min(newPosition.x, maxX);
      newPosition.y = Math.min(newPosition.y, maxY);

      e.target.position(newPosition);
      this.tableLayer.draw();
    });


    // Gérer les événements de déplacement et de redimensionnement si nécessaire

    // Ajouter la cellule bleue et le Transformer au calque
    this.tableLayer.add(draggableCell);
    this.tableLayer.add(text);
    // Créer un Transformer pour le redimensionnement de la cellule bleue
    var tr = new Konva.Transformer({
      rotateEnabled: false, // Désactiver la rotation
      enabledAnchors: ['middle-right'], // Activer uniquement les poignées de redimensionnement droite
      boundBoxFunc: (oldBox, newBox) => {
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

    // Ajouter le Transformer au calque
    this.tableLayer.add(tr);

    // Lier le Transformer à la cellule bleue
    tr.nodes([draggableCell, text]);

    // Redessiner le calque
    this.tableLayer.draw();
  }

  updateCalendar() {
    // console.log(this.bookings)

    // Variables locales pour stocker les valeurs globales
    const cellWidthRoom = this.cellWidthRoom;
    const cellWidthDay = this.cellWidthDay;



    var monthDays = getDaysInMonth(this.currentYear, this.currentMonth);

    var monthName = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Calculer la largeur du canvas en fonction du nombre de jours dans le mois
    var canvasWidth = this.cellWidthRoom * 3 + (this.cellWidthDay * monthDays); // Largeur de la colonne des noms des chambres + largeur des jours du mois

    // Fonction pour obtenir le nombre de jours dans un mois donné
    function getDaysInMonth(year: number, month: number) {
      return new Date(year, month + 1, 0).getDate();
    }
    // Initialiser le stage pour le tableau Konva avec la largeur calculée
    var tableStage = new Konva.Stage({
      container: 'table-container',
      width: canvasWidth,
      height: this.cellHeight * (this.numRooms + 2) + 30, // +2 pour l'en-tête des jours du mois et les semaines des années, +30 pour la hauteur de l'en-tête
    });


    // Initialiser le calque pour le tableau Konva
    this.tableLayer = new Konva.Layer();
    tableStage.add(this.tableLayer);

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

    this.tableLayer.add(monthHeader);


    // Calculer le nombre de semaines dans le mois en fonction du premier jour du mois et du nombre de jours dans le mois
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const weeksInMonth = Math.ceil((monthDays + firstDayOfMonth) / 7);

    // Créer une boucle pour parcourir les semaines du mois
    for (let week = 0; week < weeksInMonth; week++) {
      // Calculer le nombre de jours dans la semaine actuelle
      const startDayOfWeek = week * 7 - firstDayOfMonth + 2;
      const endDayOfWeek = Math.min(startDayOfWeek + 6, monthDays);

      // Calculer la position X de la première cellule de la semaine
      const startX = this.cellWidthRoom * 3 + Math.max(0, (startDayOfWeek - 1) * this.cellWidthDay);

      // Calculer la position du semaine dans l'année courant
      const weekNumber = Utility.getWeek(this.currentYear, this.currentMonth, startDayOfWeek);

      // Créer une cellule pour représenter la semaine
      var weekCell = new Konva.Rect({
        width: (endDayOfWeek - startDayOfWeek + 1) * this.cellWidthDay - 1,
        height: this.cellHeight - 1,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      weekCell.position({
        x: startX,
        y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
      });

      var text = new Konva.Text({
        text: `${weekNumber}/ ${this.currentYear}`, // Vous pouvez personnaliser le texte ici si nécessaire
        width: (endDayOfWeek - startDayOfWeek + 1) * this.cellWidthDay,
        height: this.cellHeight,
        align: 'left',
        verticalAlign: 'middle',
        fontSize: 16,
        fill: 'black',
      });

      text.position({
        x: startX + 10,
        y: 30, // Utilisez la même ligne de départ que les cellules Konva pour l'en-tête des jours du mois
      });

      this.tableLayer.add(weekCell);
      this.tableLayer.add(text);
    }




    // Créer les cellules Konva pour l'en-tête des jours du mois
    for (let col = 1; col <= monthDays; col++) {
      var cell = new Konva.Rect({
        width: this.cellWidthDay - 1, // 1px pour compenser la bordure
        height: this.cellHeight - 1, // 1px pour compenser la bordure
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cell.position({
        x: this.cellWidthRoom * 3 + (col - 1) * this.cellWidthDay,
        y: 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var currentDate = new Date(this.currentYear, this.currentMonth, col);
      var dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'short' });

      var text = new Konva.Text({
        text: `${dayOfWeek} ${col} `,
        width: this.cellWidthDay,
        height: this.cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 16,
        fill: 'black',
      });

      text.position({
        x: this.cellWidthRoom * 3 + (col - 1) * this.cellWidthDay,
        y: 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      this.tableLayer.add(cell);
      this.tableLayer.add(text);
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

    for (let row = 1; row <= this.numRooms; row++) {
      for (let col = 0; col <= monthDays; col++) {
        var cell = new Konva.Rect({
          width: col === 0 ? this.cellWidthRoom - 1 : this.cellWidthDay - 1, // 1px pour compenser la bordure
          height: this.cellHeight - 1, // 1px pour compenser la bordure
          fill: col === 0 ? '#f0f0f0' : 'white', // Les cellules de nom de chambre sont grises, les autres sont blanches
          stroke: 'black',
          strokeWidth: 1,
        });

        cell.position({
          x: col === 0 ? 0 : this.cellWidthRoom * 3 + (col - 1) * this.cellWidthDay,
          y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
        });

        var text = new Konva.Text({
          text: col === 0 ? roomData[row - 1].name : '', // Le texte des cellules de nom de chambre est le nom de la chambre, sinon vide
          width: col === 0 ? this.cellWidthRoom : this.cellWidthDay,
          height: this.cellHeight,
          align: 'center',
          verticalAlign: 'middle',
          fontSize: 14,
          fill: 'black',
        });

        text.position({
          x: col === 0 ? 0 : this.cellWidthRoom * 3 + (col - 1) * this.cellWidthDay,
          y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
        });

        this.tableLayer.add(cell);
        this.tableLayer.add(text);
      }

      // Ajouter la colonne "Catégorie" à côté des noms de chambre
      var cellCategory = new Konva.Rect({
        width: this.cellWidthRoom - 1,
        height: this.cellHeight - 1,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cellCategory.position({
        x: this.cellWidthRoom,
        y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var textCategory = new Konva.Text({
        text: roomData[row - 1].category,
        width: this.cellWidthRoom,
        height: this.cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        fill: 'black',
      });

      textCategory.position({
        x: this.cellWidthRoom,
        y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      this.tableLayer.add(cellCategory);
      this.tableLayer.add(textCategory);

      // Ajouter la colonne "Type de chambre" à côté des noms de chambre
      var cellType = new Konva.Rect({
        width: this.cellWidthRoom - 1,
        height: this.cellHeight - 1,
        fill: '#f0f0f0',
        stroke: 'black',
        strokeWidth: 1,
      });

      cellType.position({
        x: this.cellWidthRoom * 2,
        y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      var textType = new Konva.Text({
        text: roomData[row - 1].type,
        width: this.cellWidthRoom,
        height: this.cellHeight,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        fill: 'black',
      });

      textType.position({
        x: this.cellWidthRoom * 2,
        y: row * this.cellHeight + 30 + this.cellHeight, // À partir de la ligne 30 pour l'en-tête des jours du mois
      });

      this.tableLayer.add(cellType);
      this.tableLayer.add(textType);
    }

    this.tableLayer.draw();


    this.tableLayer.draw();


   // Maintenant, bouclez à travers les réservations et appelez createReservationCell pour chaque réservation
for (const booking of this.bookings) {
  // Vous devrez peut-être adapter cette partie en fonction de la structure de vos objets de réservation.
  const room = this.rooms.find((room) => room.roomId === booking.roomId);

  // Vérifier que la chambre existe dans la liste des chambres et que la réservation est dans le mois et l'année correspondant
  if (room && this.isReservationInCurrentMonth(booking)) {
    // Vous devrez peut-être adapter cette partie en fonction de la structure de vos objets de réservation.
    const startDate = new Date(booking.startDate); // Assurez-vous que la date est correctement formatée en tant que Date.
    const endDate = new Date(booking.endDate); // Assurez-vous que la date est correctement formatée en tant que Date.

    // Appelez createReservationCell pour cette réservation spécifique et la chambre correspondante
    this.createReservationCell(tableStage, room, startDate, endDate);
  }
}


    // Créer un Transformer pour le redimensionnement de la cellule bleue
    const tr = new Konva.Transformer({
      rotateEnabled: false,
      enabledAnchors: ['middle-right'],
      boundBoxFunc: function (oldBox, newBox) {
        // Utiliser les variables locales pour les calculs
        const initialWidth = cellWidthDay * Math.ceil(oldBox.width / cellWidthDay);
        const closestMultiple = cellWidthDay * Math.round(newBox.width / cellWidthDay);

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
    // this.tableLayer.add(draggableCell);
    this.tableLayer.add(tr);

    // Lier le Transformer à la cellule bleue
    // tr.nodes([draggableCell]);

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

  // Fonction pour rechercher le bookingId correspondant
  findBooking(selectedRoom: any, startDate: Date, endDate: Date): Booking | undefined {
    // Parcourez la liste des réservations
    for (const booking of this.bookings) {
      // Vérifiez si la chambre correspond
      if (booking.roomId === selectedRoom.roomId) {
        // Vérifiez si les dates correspondent (supposons que startDate et endDate sont les mêmes qu'enregistrées dans la réservation)
        if (booking.startDate.getTime() === startDate.getTime() && booking.endDate.getTime() === endDate.getTime()) {
          // Si la chambre et les dates correspondent, renvoyez le bookingId correspondant
          return booking;
        }
      }
    }

    // Si aucun bookingId correspondant n'est trouvé, renvoyez undefined
    return undefined;
  }


  private openReservationModal(room: any, startDate: Date, endDate: Date) {

    // Ouvrir le modal en utilisant le service MatDialog
    const dialogRef = this.dialog.open(FormReservationComponent, {
      data: {

        roomid: room.id, // Passer l'ID de la chambre
        booking: {
          bookingId: this.findBooking(room, startDate, endDate)?.bookingId,
          roomId: room.id, // Vous pouvez également passer d'autres détails de réservation si nécessaire
          startDate: startDate,
          endDate: endDate,
          // Autres détails de réservation ici...
        },
        rooms: this.rooms // Passer la liste des chambres au modal
      }
    });

    // Vous pouvez également ajouter une logique supplémentaire pour gérer la fermeture du modal
    dialogRef.afterClosed().subscribe(result => {
      // Faire quelque chose après la fermeture du modal si nécessaire
      console.log('Modal closed:', result);
    });
  }
  private isReservationInCurrentMonth(booking: Booking): boolean {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
  
    return (
      startDate.getFullYear() === this.currentYear &&
      startDate.getMonth() === this.currentMonth &&
      endDate.getFullYear() === this.currentYear &&
      endDate.getMonth() === this.currentMonth
    );
  }
  
}
