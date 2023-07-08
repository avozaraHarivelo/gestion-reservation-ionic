import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { SelectReservationArg } from '../../select-reservation-arg';
import { ReservationService } from 'src/app/service/reservation-service';
import { SearchReservationArg } from '../../search-reservation-arg';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-calendarsearchover',
  templateUrl: './canlendrier-searchin.component.html',
  styleUrls: ['./canlendrier-searchin.component.scss'],
})
export class CanlendrierSearchinComponent  implements OnInit, AfterViewInit {
  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  @ViewChild('fastsearch')fastsearch!: ElementRef;
  persons$!:Observable<Person[]>;
  years = '0';
  months = '0';
  name = '';

  constructor(private service: ReservationService) {}
 

  ngOnInit() {}

  ngAfterViewInit() {
    fromEvent(this.fastsearch.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.name = this.fastsearch.nativeElement.value;
        const search = new SearchReservationArg(+this.years, +this.months, this.name);
        this.persons$ = this.service.getReservationByName(search);
      })
    ).subscribe();
  }

  onYearsChange(data: { value: string; }) {
    this.years = data.value;
    const search = new SearchReservationArg(+this.years, +this.months, this.name);
    this.persons$ = this.service.getReservationByName(search);
  }

  onMonthsChange(data: { value: string; }) {
    this.months = data.value;
    const search = new SearchReservationArg(+this.years, +this.months, this.name);
    this.persons$ = this.service.getReservationByName(search);
  }

  onSelect(person: Person) {
    const roomId = person.roomId;
    const startDate = person.startDate;
    const endDate = person.endDate;
    const args = new SelectReservationArg(roomId, startDate, endDate);
    this.selectreservation.emit(args);
  }

}
