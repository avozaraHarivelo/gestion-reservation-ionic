import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PageCalendrierComponent } from './components/page-calendrier/page-calendrier.component';
import { FormReservationComponent } from './components/form-reservation/form-reservation.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from './app.material.module';
import { CalendrierModule } from './calendrier/calendrier.module';
import { ReservationService } from './service/reservation-service';

@NgModule({
  declarations: [
    AppComponent,
    PageCalendrierComponent,
    FormReservationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    CalendrierModule,
    AppRoutingModule,
    IonicModule.forRoot()
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },ReservationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
