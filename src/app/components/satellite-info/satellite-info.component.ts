// satellite-info.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SatelliteCalculationService } from 'src/app/services/satellite-calculation-service.service';

@Component({
  selector: 'app-satellite-info',
  templateUrl: './satellite-info.component.html',
  styleUrls: ['./satellite-info.component.css']
})
export class SatelliteInfoComponent {
  selectedSatellite: string = '';
  satelliteInfo: string = '';
  satelliteName: string = ''; // Agrega una propiedad para almacenar el nombre del satélite

  constructor(private http: HttpClient, private satelliteService: SatelliteCalculationService) {}

  async getSatelliteInfo() {
    if (!this.selectedSatellite) {
      console.error('Por favor, selecciona un satélite');
      return;
    }

    try {
      const response = await this.http.get(`https://us-central1-orbital-trackr.cloudfunctions.net/app/satellite/${this.selectedSatellite}`, { responseType: 'text' }).toPromise();
      if (response !== undefined) {
        //console.log('Response from server:', response);
        this.satelliteInfo = response;
        const lines = response.split(/\r?\n/).filter(line => line.trim().length > 0);

        if (lines.length >= 3) {
          this.satelliteName = lines[0].trim(); // Almacena el nombre del satélite en la propiedad

          const tleLine1 = lines[1].trim();
          const tleLine2 = lines[2].trim();

          //console.log('Nombre del satélite:', this.satelliteName);
          //console.log('TLE Line 1:', tleLine1);
          //console.log('TLE Line 2:', tleLine2);

          this.satelliteService.updateTLE(tleLine1, tleLine2, this.satelliteName);
          this.satelliteService.updateSatelliteName(this.satelliteName);
        } else {
          console.error('La respuesta del servidor no tiene el formato esperado');
        }
      } else {
        console.error('La respuesta del servidor está vacía');
      }
    } catch (error) {
      console.error('Hubo un error al obtener la información del satélite:', error);
    }
  }
}
