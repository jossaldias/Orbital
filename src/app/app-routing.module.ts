import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatelliteMapComponent } from './components/satellite-map/satellite-map.component'; 
import { SatelliteInfoComponent } from './components/satellite-info/satellite-info.component';

const routes: Routes = [
{ path: 'satellite', component: SatelliteMapComponent },
{ path: 'satelliteInfo', component: SatelliteInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
