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
// import { CalendarData } from './utils/calendar-utils';
import { ChangeReservationArg } from '../change-reservation-arg';
import { ReservationArg } from '../reservation-arg';
import { NewReservationModalComponent } from 'src/app/components/new-reservation-modal/new-reservation-modal.component';
import { Calendar, CalendarData } from './utils/calendar';
import { Utility } from 'src/app/appcore/utility';
import { Stage } from 'konva/lib/Stage';

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
  cellWidthRoom: number = 85;
  cellWidthDay: number = 80;
  cellHeight: number = 45;
  // Déclarer et initialiser calendarData ici
  calendarData: CalendarData = {
    currentYear: 0,
    cellWidthRoom: 0,
    cellWidthDay: 0,
    rooms: [],
    bookings: [],
  };
  tableStage: Konva.Stage | undefined ;

  
  private calendarInstance: Calendar ; // Propriété pour stocker l'instance de la classe Calendar
  constructor(private dialog: MatDialog, private roomService: RoomService, private reservationService: ReservationService) { 
    this.calendarInstance = new Calendar(
      this.calendarData,
      this.selectedLimit,
      this.year,
      this.month,
      this.cellWidthRoom,
      this.cellWidthDay,
      this.cellHeight,
      this.tableLayer,
      this.roomService,
      this.bookings,
      dialog,
      this.tableStage!
    );
  }

  ngOnInit() {
    this.tableStage= new Stage({ container: 'table-container'});
    const currentDate = new Date(); // Obtenir la date actuelle
    this.year = currentDate.getFullYear(); // Année en cours
    this.month = currentDate.getMonth(); // Mois en cours (0-11, où janvier est 0)

    this.selectedLimit = "mois";
    this.fetchRoomsAndBookings();
    this.calendarData = {
      currentYear: this.year,
      cellWidthRoom: this.cellWidthRoom,
      cellWidthDay: this.cellWidthDay,
      rooms: this.rooms,
      bookings: this.bookings,
    };


    const yearDays = Number(Utility.getDaysInYear(this.year));
    const monthDays = Number(Utility.getDaysInMonth(this.year, this.month));
    this.tableStage.width(this.selectedLimit === "année" ? this.cellWidthRoom * 3 + (this.cellWidthDay * yearDays) : this.cellWidthRoom * 3 + (this.cellWidthDay * monthDays)),
    this.tableStage.height(this.cellHeight * (this.roomService.getRooms().length + 2) + 30),
   

    this.calendarInstance = new Calendar(
      this.calendarData,
      this.selectedLimit,
      this.year,
      this.month,
      this.cellWidthRoom,
      this.cellWidthDay,
      this.cellHeight,
      this.tableLayer,
      this.roomService,
      this.bookings,
      this.dialog,
      this.tableStage
    );
    this.calendarInstance.createCalendar();

    // Écouter l'événement reservationAdded du composant NewReservationModalComponent
    this.dialog.afterAllClosed.subscribe(() => {
      this.fetchRoomsAndBookings();
      this.calendarUpdate();
    });
  }

  private fetchRoomsAndBookings() {
    this.rooms = this.roomService.getRooms();
    

    this.reservationService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
      console.log(`bookins:${bookings}`)
    });
  }

  private calendarUpdate() {
    this.fetchRoomsAndBookings();
    this.calendarInstance.limite =this.selectedLimit;
    this.calendarInstance.currentMonth =this.month;
    this.calendarInstance.currentYear =this.year;
    this.calendarInstance.bookings =this.bookings;

      const yearDays = Number(Utility.getDaysInYear(this.year));
        const monthDays = Number(Utility.getDaysInMonth(this.year, this.month));

    this.calendarInstance.tableStage.width(this.selectedLimit === "année" ? this.cellWidthRoom * 3 + (this.cellWidthDay * yearDays) : this.cellWidthRoom * 3 + (this.cellWidthDay * monthDays));
    this.calendarInstance.createCalendar();
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
    this.calendarUpdate();
  }


  onPrevMonth() {
    this.month--; // Décrémenter le mois actuel pour aller au mois précédent
    if (this.month < 0) {
      this.month = 11; // Si le mois est inférieur à 0, revenir à décembre (11)
      this.year--; // Décrémenter l'année lorsque nous atteignons janvier de l'année précédente
    }
    this.calendarUpdate(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }

  onNextMonth() {
    this.month++; // Incrémenter le mois actuel pour aller au mois suivant
    if (this.month > 11) {
      this.month = 0; // Si le mois est supérieur à 11, revenir à janvier (0)
      this.year++; // Incrémenter l'année lorsque nous atteignons décembre de l'année suivante
    }
    this.calendarUpdate(); // Mettre à jour le calendrier avec le mois et l'année actuels
  }
}
