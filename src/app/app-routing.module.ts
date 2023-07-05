import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageCalendrierComponent } from './components/page-calendrier/page-calendrier.component';

const routes: Routes = [
  { path: '', redirectTo: 'reservation', pathMatch: 'full' },
  { path: 'reservation', component: PageCalendrierComponent },
  { path: '**', redirectTo: 'reservation' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
