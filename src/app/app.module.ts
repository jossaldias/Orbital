import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SatelliteMapComponent } from './components/satellite-map/satellite-map.component';
import { SatelliteInfoComponent } from './components/satellite-info/satellite-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SatelliteMapComponent,
    SatelliteInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
