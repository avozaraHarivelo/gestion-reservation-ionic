import { MonthCell, monthCellData } from "./month-cell";
import { DayCell, DayCellData } from "./day-cell";
import { RoomInfoCell, RoomInfoData } from "./room-info-cell";
import Konva from "konva";
import { WeekCell, weekCellData } from "./week-cell";
import { VoidCell, VoidCellData } from "./void-cell";
import { Utility } from "src/app/appcore/utility";
import { RoomService } from "src/app/service/room-service";
import { ReservationCell } from "./reservation-cell";
import { Booking } from "src/app/models/booking";
import { MatDialog } from "@angular/material/dialog";
import { Room } from "src/app/models/room";


export interface CalendarData {
    currentYear: number;
    cellWidthRoom: number;
    cellWidthDay: number;
    rooms: Room[];
    bookings: Booking[];
}


export class Calendar {

    private monthCells: monthCellData[];
    private weekCells: weekCellData[];
    private dayCells: DayCellData[];
    private voidCells: VoidCellData[];
    private roomInfoCells: RoomInfoData[];
    private tableLayer: Konva.Layer;
    private cellWidthDay: number;
    private cellHeight: number;
    private cellWidthInfo: number;
    currentYear: number;
    currentMonth: number;
    private calendarData: CalendarData;
    limite: string;
    bookings: Booking[];

    tableStage: Konva.Stage;



    constructor(calendarData: CalendarData, limite: string, currentYear: number, currentMonth: number, cellWidthInfo: number, cellWidthDay: number, cellHeight: number, tableLayer: Konva.Layer, private roomService: RoomService, bookings: Booking[], private dialog: MatDialog, tableStage: Konva.Stage) {
        this.monthCells = [];
        this.weekCells = [];
        this.dayCells = [];
        this.voidCells = [];
        this.roomInfoCells = [];
        this.tableLayer = tableLayer;
        this.currentYear = currentYear;
        this.cellWidthInfo = cellWidthInfo;
        this.cellWidthDay = cellWidthDay;
        this.currentMonth = currentMonth;
        this.calendarData = calendarData;
        this.limite = limite;
        this.cellHeight = cellHeight;
        this.bookings = bookings;
        this.tableStage = tableStage;
      

    }

    public createCalendar() {
        console.log(`limite ${this.limite}`)
        const { rooms } = this.calendarData;
        // const yearDays = Number(Utility.getDaysInYear(this.currentYear));
        // const monthDays = Number(Utility.getDaysInMonth(this.currentYear, this.currentMonth));
        // const canvasWidth = this.limite === "année" ? this.cellWidthInfo * 3 + (this.cellWidthDay * yearDays) : this.cellWidthInfo * 3 + (this.cellWidthDay * monthDays);

        // this.tableStage = new Konva.Stage({
        //     container: 'table-container',
        //     width: canvasWidth,
        //     height: this.cellHeight * (rooms.length + 2) + 30,
        // });

        this.tableStage.add(this.tableLayer);
        this.createMonthCellsAndHeaders();
        this.createWeekCells();
        this.createDayCells();
        this.createVoidCells();
        this.createReservationCells();
        this.createRoomInfoCells();
        this.resizeHeight();
        this.resizeWidth();

        this.setupScrollListener();
        this.adjustStageBorder();

        window.addEventListener('resize', () => this.adjustStageBorder());
    }

    private createMonthCellsAndHeaders() {


        const monthCell = new MonthCell(this.tableLayer, this.cellWidthInfo, this.limite, this.cellWidthDay, this.cellHeight, this.currentYear, this.currentMonth);
        this.monthCells = monthCell.createMonthCell();

    }

    private createWeekCells() {
        const weekCell = new WeekCell(this.tableLayer, this.cellHeight, this.limite, this.cellWidthDay, this.cellWidthInfo, this.currentYear, this.currentMonth);
        this.weekCells = weekCell.createWeekCells();
    }

    private createDayCells() {
        const dayCell = new DayCell(this.tableLayer, this.cellHeight, this.cellWidthDay, this.cellWidthInfo, this.currentYear, this.currentMonth, this.limite);
        //   this.dayCells = dayCell.createDayCells();
    }

    private createVoidCells() {
        const voidCell = new VoidCell(
            this.limite,
            this.tableLayer,
            this.cellWidthDay,
            this.cellHeight,
            this.calendarData, // Provide the actual calendarData
            this.currentYear, // Provide the actual yearDays
            this.currentMonth, // Provide the actual monthDays
            this.cellWidthInfo // Provide the actual cellWidthRoom
        );

        this.voidCells = voidCell.createVoidCells();
    }

    private createReservationCells() {
        const reservationCellInstance = new ReservationCell(
            this.cellWidthDay,
            this.cellHeight,
            this.cellWidthInfo,
            this.tableLayer,
            this.roomService.getRooms(),
            this.bookings,
            this.limite,
            this.currentYear,
            this.currentMonth,
        );
        for (const booking of this.bookings) {
            const room = this.roomService.getRooms().find((room) => room.roomId === booking.roomId);
      
            if (room && this.isReservationInCurrentMonth(booking)) {
                const startDate = new Date(booking.startDate);
                const endDate = new Date(booking.endDate);
               reservationCellInstance.createReservationCell(
                    this.tableStage,
                    room,
                    startDate,
                    endDate,
                    this.dialog,
                )
                    ;
            }
        }
    }

    private createRoomInfoCells() {
        const roomInfoCell = new RoomInfoCell(this.tableLayer, this.cellWidthInfo, this.cellHeight, this.roomService);
        this.roomInfoCells = roomInfoCell.createRoomInfoCells();
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

    private resizeHeight() {
        // Implementation for resizing cell heights
    }

    private resizeWidth() {
        // Implementation for resizing cell widths
    }

    private setupScrollListener() {
        // Implementation for setting up scroll listener
    }

    private adjustStageBorder() {
        // Implementation for adjusting stage border
    }
}
