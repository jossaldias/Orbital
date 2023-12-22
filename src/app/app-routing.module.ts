import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatelliteMapComponent } from './satellite-map/satellite-map.component'; 

const routes: Routes = [
{ path: 'satellite', component: SatelliteMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
