import { Injectable } from '@angular/core';
import * as satellite from 'satellite.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatelliteCalculationService {
  private coordinatesSubject: Subject<any> = new Subject<any>();

  constructor() { 
    // Llamar al método para iniciar la actualización de coordenadas
    this.updateSatelliteCoordinates();
  }

  get coordinates$() {
    return this.coordinatesSubject.asObservable();
  }

  private updateSatelliteCoordinates() {
    setInterval(() => {
      const tleLine1 = '1 38011U 11076E   23354.79367538  .00002248  00000+0  28953-3 0  9998';
      const tleLine2 = '2 38011  97.7290  55.4537 0001608  87.9070   6.9436 14.82018237649692';
      const currentTime = new Date();

      const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
      const positionAndVelocity = satellite.propagate(satrec, currentTime);

      const positionEci: any = positionAndVelocity.position;
      const gmst = satellite.gstime(currentTime);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);
      const altitude = positionGd.height;

      const coordinates = {
        latitude: latitude,
        longitude: longitude,
        altitude: altitude
      };

      // Notificar a los suscriptores sobre el cambio en las coordenadas
      this.coordinatesSubject.next(coordinates);
    }, 100); // Actualizar cada segundo (puedes ajustar el intervalo según sea necesario)
  }
}
