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
    private roomHeadersCells: RoomInfoData[];
    private tableLayer: Konva.Layer;
    private cellWidthDay: number;
    private cellHeight: number;
    private cellWidthInfo: number;
    currentYear: number;
    currentMonth: number;
    private calendarData: CalendarData;
    limite: string;
    bookings: Booking[];
    reservationCellInstance!: ReservationCell ;
    tableStage: Konva.Stage;



    constructor(calendarData: CalendarData, limite: string, currentYear: number, currentMonth: number, cellWidthInfo: number, cellWidthDay: number, cellHeight: number, tableLayer: Konva.Layer, private roomService: RoomService, bookings: Booking[], private dialog: MatDialog, tableStage: Konva.Stage) {
        this.monthCells = [];
        this.weekCells = [];
        this.dayCells = [];
        this.voidCells = [];
        this.roomInfoCells = [];
        this.roomHeadersCells = [];
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
        // this.reservationCellInstance = new ReservationCell(
        //     this.cellWidthDay,
        //     this.cellHeight,
        //     this.cellWidthInfo,
        //     this.tableLayer,
        //     this.roomService.getRooms(),
        //     this.bookings,
        //     this.limite,
        //     this.currentYear,
        //     this.currentMonth,
        //     this.tableStage
        // );

    }

    public createCalendar() {
        this.tableStage.add(this.tableLayer);
        // this.reservationCellInstance = new ReservationCell(
        //     this.cellWidthDay,
        //     this.cellHeight,
        //     this.cellWidthInfo,
        //     this.tableLayer,
        //     this.roomService.getRooms(),
        //     this.bookings,
        //     this.limite,
        //     this.currentYear,
        //     this.currentMonth,
        //     this.tableStage
        // );
        this.createMonthCellsAndHeaders();
        this.createWeekCells();
        this.createDayCells();
        this.createVoidCells();
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

   

    private createRoomInfoCells() {
        const roomInfoCell = new RoomInfoCell(this.tableLayer, this.cellWidthInfo, this.cellHeight, this.roomService);
        this.roomInfoCells = roomInfoCell.createRoomInfoCells();
        this.roomHeadersCells = roomInfoCell.createRoomHeader();

    }

   
    private resizeHeight() {
        // Implementation for resizing cell heights
    }

    private resizeWidth() {
        // Implementation for resizing cell widths
    }

    private setupScrollListener() {
        let scrollContainer = document.getElementById('canvas-container');

        scrollContainer?.addEventListener('scroll', () => {

            let scrollLeft = scrollContainer?.scrollLeft ?? 0;

            console.log(`scroll vers droite: ${scrollLeft}`)
            this.roomHeadersCells.forEach((cell, key) => {
                cell.rect.x(this.cellWidthInfo * key + scrollLeft);
                cell.text.x(this.cellWidthInfo * key + scrollLeft);

                cell.rect.moveToTop();
                cell.text.moveToTop();
            });



            this.roomInfoCells.forEach((cell, key) => {
                cell.rect.x(this.cellWidthInfo * (key % 3) + scrollLeft);
                cell.text.x(this.cellWidthInfo * (key % 3) + scrollLeft);

                cell.rect.moveToTop();
                cell.text.moveToTop();
            });

            // roomTexts.forEach((text, key) => {
            //     text.x(textStartXPositions[key] + scrollLeft);
            //     //  text.moveToTop();
            // });

            // cellResizeHeigth[cellResizeHeigth.length - 1].x(scrollLeft)

            // cellResizeHeigth[cellResizeHeigth.length - 1].y(cellHeight + 30 + cellHeight)
            // cellResizeHeigth[cellResizeHeigth.length - 1].moveToTop();


            this.tableLayer.batchDraw();
        });

    }

    private adjustStageBorder() {
        // Implementation for adjusting stage border
    }
}
