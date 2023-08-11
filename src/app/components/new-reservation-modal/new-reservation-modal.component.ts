import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utility } from 'src/app/appcore/utility';
import { Booking } from 'src/app/models/booking';
import { Room } from 'src/app/models/room';
import { ReservationService } from 'src/app/service/reservation-service';
import { RoomService } from 'src/app/service/room-service';

@Component({
  selector: 'app-new-reservation-modal',
  templateUrl: './new-reservation-modal.component.html',
  styleUrls: ['./new-reservation-modal.component.scss'],
})
export class NewReservationModalComponent implements OnInit {
  selectedRoom!: Room;
  startDate!: Date;
  endDate!: Date;
  // Créer un EventEmitter pour émettre un événement lorsque la réservation est ajoutée
  @Output() reservationAdded = new EventEmitter<void>();
  booking: Booking = new Booking();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public rooms: Room[], // Note: Vous n'avez pas besoin d'injecter les chambres ici car elles sont fournies par le service.
    private roomService: RoomService,
    private reservationService: ReservationService, // Injectez le service RoomService ici.
    private dialogRef: MatDialogRef<NewReservationModalComponent> // Ajouter MatDialogRef ici
  ) {
   
    this.startDate = data.date;
    this.endDate = data.date;
  }

  ngOnInit(): void {

    // Utilisez le service RoomService pour obtenir la liste des chambres
    this.rooms = this.roomService.getRooms();

    // Afficher la première chambre de la liste comme chambre sélectionnée par défaut
    if (this.rooms.length > 0) {
      this.selectedRoom = this.rooms[0];
    }
  }



  onConfirm(form: NgForm) {
   
    const vm = new Booking();
    vm.bookingId = this.booking.bookingId;
    vm.roomId =this.selectedRoom.roomId;
    vm.startDate = Utility.toDate(form.value.startDate);
    vm.endDate = Utility.toDate(form.value.endDate);
    vm.name = Utility.toString(form.value.name);
    //
    if (vm.endDate < vm.startDate) {
      alert('Attention: startDate > endDate');
      return;
    }
    // const index = this.rooms.findIndex((x: { roomId: number; }) => x.roomId === vm.roomId);
    // vm.roomType = this.rooms[index].roomType;
    // this.computeStayDay(vm.startDate, vm.endDate);
    // //
    // if (vm.bookingId === 0) {
    //   this.service.insertReservation(vm).subscribe(
    //     result => this.dialogRef.close(result),
    //     error => alert(error)
    //   );
    // } else {
    //   this.service.updateReservation(vm).subscribe(
    //     result => this.dialogRef.close(result),
    //     error => alert(error)
    //   );
    // }

    // console.log(vm);
    // Appeler la méthode addBooking du service RoomService pour ajouter la réservation
    this.reservationService.addBooking(vm);
    this.reservationAdded.emit();
    this.dialogRef.close(true); 
  }


  // onReserveClick(selectedRoom: Room, startDate: Date, endDate: Date): void {
  //   // Créer un nouvel objet Booking pour représenter la réservation
  //   const newBooking: Booking = {
  //     bookingId: 0, // Vous pouvez laisser 0 ou mettre une valeur appropriée si vous avez un moyen de générer des identifiants uniques
  //     roomId: selectedRoom.roomId,
  //     startDate: startDate,
  //     endDate: endDate,
  //     name: 'Réservation test', // Vous pouvez remplacer cette chaîne par un nom de réservation approprié si vous en avez un
  //   };

  //   console.log();
  //   // Appeler la méthode addBooking du service RoomService pour ajouter la réservation
  //   this.roomService.addBooking(newBooking);
  //   this.reservationAdded.emit();
  //   this.dialogRef.close(true); // Fermez le modal et indiquez que la réservation a été effectuée avec succès.
  // }
}
