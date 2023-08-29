import Konva from "konva";
import { FormReservationComponent } from "src/app/components/form-reservation/form-reservation.component";
import { Booking } from "src/app/models/booking";
import { Room } from "src/app/models/room";
import { MatDialog } from "@angular/material/dialog";
import { Utility } from "src/app/appcore/utility";

export interface ReservationData {
    rect: Konva.Rect;
    text: Konva.Text;
    row: number;
    starDate: Date;
    endDate: Date;
}

export class ReservationCell {
    cellWidthDay: number;
    cellHeight: number;
    private widthTemp: number;
    private heightTemp: number;
    private cellWidthRoom: number;
    private tableLayer: Konva.Layer;
    rooms: Room[];
    bookings: Booking[];
    limite: string;
    currentYear: number;
    currentMonth: number;
    tableStage: Konva.Stage;

    constructor(
        cellWidthDay: number,
        cellHeight: number,
        cellWidthRoom: number,
        tableLayer: Konva.Layer,
        rooms: Room[],
        bookings: Booking[],
        limite: string,
        currentYear: number,
        currentMonth: number,
        tableStage: Konva.Stage
    ) {
        this.widthTemp = cellWidthDay;
        this.heightTemp = cellHeight;
        this.cellWidthDay = cellWidthDay;
        this.cellHeight = cellHeight;
        this.cellWidthRoom = cellWidthRoom;
        this.tableLayer = tableLayer;
        this.rooms = rooms;
        this.bookings = bookings;
        this.limite = limite;
        this.currentYear = currentYear;
        this.currentMonth = currentMonth;
        this.tableStage = tableStage;
    }


    public updateReservationCell(resa: ReservationData,
        row: number,
        startDate: Date,
        endDate: Date,
        width: number,
        height: number) {

        this.widthTemp = width;
        this.heightTemp = height;


        const colStart = Math.floor((startDate.getDate() - 1) * width);
        const colEnd = Math.floor((endDate.getDate() - 1) * width);

        resa.rect.width(colEnd - colStart);
        resa.rect.height(height);
        resa.rect.x(colStart + this.cellWidthRoom * 3)
        //Olana ngamba
        resa.rect.y((row - 1) * height + 30 + this.cellHeight * 2);


        resa.text.height(height);
        resa.text.x(colStart + this.cellWidthRoom * 3)
        resa.text.y((row - 1) * height + 30 + this.cellHeight * 2);

        console.log(`row ${row} voatsou`)

        this.tableLayer.batchDraw();

    }

    public createReservationCell(
        selectedRoom: Room,
        startDate: Date,
        endDate: Date,
        dialog: MatDialog

    ) {


        const colStart = Math.floor((this.limite == "année" ? Utility.getDayOfYear(startDate) - 1 : startDate.getDate() - 1) * this.cellWidthDay);
        const colEnd = Math.floor((this.limite == "année" ? Utility.getDayOfYear(endDate) - 1 : endDate.getDate() - 1) * this.cellWidthDay);
        const row = this.rooms.findIndex((room) => room.roomId === selectedRoom.roomId) + 1;
        console.log(`colStart:${colStart} colEnd:${colEnd} row:${row} this.cellWidthDay:${this.cellWidthDay}`)

        const draggableCell = this.createDraggableCell(colStart, colEnd, row);
        const text = this.createText(selectedRoom, startDate, endDate);

        let reservation: ReservationData = {
            rect: draggableCell,
            text: text,
            row: row,
            starDate: startDate,
            endDate: endDate
        };

        var reservationGroup = new Konva.Group({
            x: colStart + this.cellWidthRoom * 3,
            y: row * this.cellHeight + 60,
            draggable: true,
        });

        reservationGroup.add(draggableCell)
        reservationGroup.add(text)
        this.addEventListeners(reservationGroup, selectedRoom, startDate, endDate, dialog, this.tableStage);




        // this.addTransformer(draggableCell, text);

        this.tableLayer.add(reservationGroup)
        return reservation;
    }


    private createResaBySelect(x: number, y: number, width: number, height: number) {

        // let startDate = this.limite == "année" ? : getDayOfMonth()

        const rowStart =  Math.round((y - 60+this.cellHeight) / this.cellHeight);


        const colStart = Math.round((x - this.cellWidthRoom * 3) / this.cellWidthDay);
        const colEnd = Math.round(((x + width) - this.cellWidthRoom * 3) / this.cellWidthDay);
    }

    public createReservationCells(dialog: MatDialog) {

        for (const booking of this.bookings) {
            const room = this.rooms.find((room) => room.roomId === booking.roomId);

            if (room && this.isReservationInCurrentMonth(booking)) {
                const startDate = new Date(booking.startDate);
                const endDate = new Date(booking.endDate);
                this.createReservationCell(
                    room,
                    startDate,
                    endDate,
                    dialog,
                )
                    ;
            }
        }

        // this.tableStage.on('mousedown touchstart click', (e) => {
        // do nothing if we mousedown on any shape

        // console.log('tafiditra mousedown')

        //   });
        // this.createReservationBySelect()
    }

    public createReservationBySelect() {
        var x1: number | undefined;
        var y1: number | undefined;
        var x2: number | undefined;
        var y2: number | undefined;
        var selectionRectangle = new Konva.Rect({
            fill: 'rgba(0,0,255,0.5)',
            visible: false,
        });
        this.tableLayer.add(selectionRectangle);

        this.tableStage.on('mousedown touchstart', (e) => {
            // do nothing if we mousedown on any shape
            // if (e.target !== this.tableStage) {
            //     return;
            // }


            e.evt.preventDefault();

            x1 = this.tableStage.getPointerPosition()?.x;
            y1 = this.tableStage.getPointerPosition()?.y;
            x2 = this.tableStage.getPointerPosition()?.x;
            y2 = this.tableStage.getPointerPosition()?.y;
            console.log(`depart  x1:${x1} y1:${y1} x2:${x2} y2:${y2}`)
            selectionRectangle.visible(true);
            selectionRectangle.width(0);
            selectionRectangle.height(0);
        });

        this.tableStage.on('mousemove touchmove', (e) => {
            // do nothing if we didn't start selection
            if (!selectionRectangle.visible()) {
                return;
            }
            e.evt.preventDefault();
            x2 = this.tableStage.getPointerPosition()?.x;
            y2 = this.tableStage.getPointerPosition()?.y;

            selectionRectangle.setAttrs({
                x: Math.min(x1!, x2!),
                y: Math.min(y1!, y2!),
                width: Math.abs(x2! - x1!),
                height: Math.abs(y2! - y1!),
            });
        });

        this.tableStage.on('mouseup touchend', (e) => {
            // do nothing if we didn't start selection
            if (!selectionRectangle.visible()) {
                return;
            }
            e.evt.preventDefault();
            // update visibility in timeout, so we can check it in click event
            setTimeout(() => {
                selectionRectangle.visible(false);
            });

            console.log(`fin  x:${Math.min(x1!, x2!)} y:${Math.min(y1!, y2!)} width:${Math.abs(x2! - x1!)} height:${Math.abs(y2! - y1!)}`)
        });
    }

    private createDraggableCell(colStart: number, colEnd: number, row: number) {
        const cellWidthDay = this.cellWidthDay;
        const cellHeight = this.cellHeight;

        return new Konva.Rect({
            width: colEnd - colStart,
            height: cellHeight,
            fill: "blue",
            opacity: 1,
            className: "table-cell",

        });
    }

    private createText(selectedRoom: Room, startDate: Date, endDate: Date) {

        console.log(`selectedRoom:${selectedRoom.name}`)
        const colStart = Math.floor((startDate.getDate() - 1) * this.cellWidthDay);
        const colEnd = Math.floor((endDate.getDate() - 1) * this.cellWidthDay);
        const cellWidthDay = this.cellWidthDay;
        const cellHeight = this.cellHeight;

        return new Konva.Text({
            text: this.findBooking(selectedRoom, startDate, endDate)?.name ?? "",
            fontSize: 18,
            height: cellHeight,
            align: "center",
            verticalAlign: "middle",
            fill: "black",
            padding: 10,

        });
    }

    private addEventListeners(reservationGroup: Konva.Group, selectedRoom: Room, startDate: Date, endDate: Date, dialog: MatDialog, tableStage: Konva.Stage) {

        reservationGroup.on("dblclick", () => {
            this.openReservationModal(selectedRoom, startDate, endDate, dialog);
        });



        reservationGroup.on('dragend', (e) => {
            const newPosition = e.target.position();
            const cellX = Math.floor((newPosition.x - this.cellWidthRoom * 3) / this.widthTemp);
            const cellY = Math.floor((newPosition.y - (30 + this.heightTemp)) / this.heightTemp);

            reservationGroup.position({
                x: this.cellWidthRoom * 3 + cellX * this.widthTemp,
                y: cellY * this.heightTemp + 60 + this.heightTemp,
            });

        });

        const limitDragmove = (e: Konva.KonvaEventObject<DragEvent>) => {
            const newPosition = e.target.position();

            const yearDays = Number(Utility.getDaysInYear(this.currentYear));
            const monthDays = Number(Utility.getDaysInMonth(this.currentYear, this.currentMonth));
            const colStart = Math.floor((startDate.getDate() - 1) * this.cellWidthDay);
            const colEnd = Math.floor((endDate.getDate() - 1) * this.cellWidthDay);
            const maxX = (this.limite === "année" ? this.cellWidthRoom * 3 + (this.cellWidthDay * yearDays) : this.cellWidthRoom * 3 + (this.cellWidthDay * monthDays)) - (colEnd - colStart);
            const maxY = this.rooms.length * this.cellHeight + 60;

            newPosition.y = Math.max(newPosition.y, 60 + this.cellHeight);
            newPosition.x = Math.max(newPosition.x, this.cellWidthRoom * 3);
            newPosition.x = Math.min(newPosition.x, maxX);
            newPosition.y = Math.min(newPosition.y, maxY);

            e.target.position(newPosition);
            // this.tableLayer.batchDraw();
        };




        reservationGroup.on('dragmove', limitDragmove);
        // text.on('dragmove', limitDragmove);
        // reservationGroup.on('dragmove', () => {
        //     console.log(reservationGroup.y())
        //     reservationGroup.y(this.cellHeight + 60);
        //   });

        // Math.max(blueGroup.y(), 50)


    }

    private addTransformer(draggableCell: Konva.Rect, text: Konva.Text) {
        const cellWidthDay = this.cellWidthDay;
        const cellWidthRoom = this.cellWidthRoom;

        const tr = new Konva.Transformer({
            rotateEnabled: false,
            enabledAnchors: ["middle-right"],
            boundBoxFunc: (oldBox, newBox) => {
                const closestMultiple = cellWidthDay * Math.round(newBox.width / cellWidthDay);

                if (newBox.width < cellWidthDay) {
                    newBox.width = cellWidthDay;
                }

                if (newBox.width > cellWidthRoom) {
                    newBox.width = cellWidthRoom;
                }

                newBox.width = closestMultiple;

                return newBox;
            },
        });

        this.tableLayer.add(tr);
        tr.nodes([draggableCell, text]);
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


    private findBooking(
        selectedRoom: Room,
        startDate: Date,
        endDate: Date
    ): Booking | undefined {
        return this.bookings.find(booking =>
            booking.roomId === selectedRoom.roomId &&
            booking.startDate.getTime() === startDate.getTime() &&
            booking.endDate.getTime() === endDate.getTime()
        );
    }

    private openReservationModal(
        room: Room,
        startDate: Date,
        endDate: Date,
        dialog: MatDialog
    ) {
        const dialogRef = dialog.open(FormReservationComponent, {
            data: {
                roomid: room.roomId,
                booking: {
                    bookingId: this.findBooking(room, startDate, endDate)?.bookingId,
                    roomId: room.roomId,
                    startDate: startDate,
                    endDate: endDate,
                },
                rooms: this.rooms,
            },
        });
    }
}
