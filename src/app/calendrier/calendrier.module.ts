import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateModule } from '@angular/material/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarNavbarComponent } from './calendar-navbar/calendar-navbar.component';
import { CanlendrierReservationComponent } from './canlendrier-reservation/canlendrier-reservation.component';
import { CanlendrierSearchoutComponent } from './calendrier-search/canlendrier-searchout/canlendrier-searchout.component';
import { CanlendrierSearchinComponent } from './calendrier-search/canlendrier-searchin/canlendrier-searchin.component';



@NgModule({
  declarations: [
    CalendarComponent,
    CalendarNavbarComponent,
    CanlendrierReservationComponent,
    CanlendrierSearchoutComponent,
    CanlendrierSearchinComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    OverlayModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    NativeDateModule
  ],
  // entryComponents: [
  //   CanlendrierSearchinComponent
  // ],
  exports: [
    CalendarComponent,
    CalendarNavbarComponent,
    CanlendrierReservationComponent,
    CanlendrierSearchoutComponent,
    CanlendrierSearchinComponent
  ],
 
})
export class CalendrierModule { }
