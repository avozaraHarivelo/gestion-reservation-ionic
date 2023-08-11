import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomService } from 'src/app/service/room-service';
import { ReservationService } from 'src/app/service/reservation-service';
import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { DateAndWeek, StepHours } from '../date-manager';
import { HeaderDays } from '../models/header-days';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Room } from 'src/app/models/room';
import { Booking } from 'src/app/models/booking';
import { CalendarData, updateCalendar } from './utils/calendar-utils';
import { ChangeReservationArg } from '../change-reservation-arg';
import { ReservationArg } from '../reservation-arg';
import { NewReservationModalComponent } from 'src/app/components/new-reservation-modal/new-reservation-modal.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  selectedLimit:string = "";
  @Input() year = 0;
  @Input() month = 0;
  @Input() day = 0;
  rooms: Room[] = [];
  bookings: Booking[] = [];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() reservation = new EventEmitter<ReservationArg>();
  @ViewChild(CalendarNavbarComponent) navbar: any;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  headerdays: HeaderDays = new HeaderDays();
  tableLayer: Konva.Layer = new Layer();
  monthName: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  //test data
  // currentYear: number = 2023; // Exemple : 2023
  cellWidthRoom: number = 80;
  cellWidthDay: number = 70;
  cellHeight: number = 35;
  // Déclarer et initialiser calendarData ici
  calendarData: CalendarData = {
    currentYear: 0,
    cellWidthRoom: 0,
    cellWidthDay: 0,
    rooms: [],
    bookings: [],
  };

  constructor(private dialog: MatDialog, private roomService: RoomService, private reservationService: ReservationService) { }

  ngOnInit() {
    this.selectedLimit = "mois";
    this.fetchRoomsAndBookings();
    this.calendarData = {
      currentYear: this.year,
      cellWidthRoom: this.cellWidthRoom,
      cellWidthDay: this.cellWidthDay,
      rooms: this.rooms,
      bookings: this.bookings,
    };
  
    this.updateCalendar();

    // Écouter l'événement reservationAdded du composant NewReservationModalComponent
    this.dialog.afterAllClosed.subscribe(() => {
      this.fetchRoomsAndBookings();
      this.updateCalendar();
    });
  }

  private fetchRoomsAndBookings() {
    this.rooms = this.roomService.getRooms();
    

    this.reservationService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
      console.log(`bookins:${bookings}`)
    });
  }

  private updateCalendar() {
    updateCalendar(this.month,this.selectedLimit,this.calendarData, this.cellHeight, this.cellWidthDay, this.dialog);
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

  onLimitChange() {
  //  console.log(`limite: ${this.selectedLimit}`)
    this.updateCalendar();
  }


  onPrevMonth() {
    this.month--; // Décrémenter le mois actuel pour aller au mois précédent
    if (this.month < 0) {
      this.month = 11; // Si le mois est inférieur à 0, revenir à décembre (11)
      this.year--; // Décrémenter l'année lorsque nous atteignons janvier de l'année précédente
    }
    this.updateCalendar(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }

  onNextMonth() {
    this.month++; // Incrémenter le mois actuel pour aller au mois suivant
    if (this.month > 11) {
      this.month = 0; // Si le mois est supérieur à 11, revenir à janvier (0)
      this.year++; // Incrémenter l'année lorsque nous atteignons décembre de l'année suivante
    }
    this.updateCalendar(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }
}
