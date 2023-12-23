import { Injectable } from '@angular/core';
import * as satellite from 'satellite.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SatelliteCalculationService {
  private coordinatesSubject: Subject<any> = new Subject<any>();
  private satelliteNameSubject: Subject<string> = new Subject<string>();
  private intervalId: any;

  private tleLine1: string = '1 38011U 11076E   23354.79367538  .00002248  00000+0  28953-3 0  9998';
  private tleLine2: string = '2 38011  97.7290  55.4537 0001608  87.9070   6.9436 14.82018237649692';
  private satelliteName: string = 'Unnamed Satellite'; // Nombre predeterminado

  constructor() {
    // Iniciar la actualización de coordenadas y nombre del satélite
    this.updateSatelliteData();
  }

  get coordinates$() {
    return this.coordinatesSubject.asObservable();
  }

  get satelliteName$() {
    return this.satelliteNameSubject.asObservable();
  }

  private updateSatelliteData() {
    this.intervalId = setInterval(() => {
      const currentTime = new Date();

      const satrec = satellite.twoline2satrec(this.tleLine1, this.tleLine2);
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

  updateTLE(tleLine1: string, tleLine2: string, satelliteName: string,) {
    clearInterval(this.intervalId);

    this.tleLine1 = tleLine1;
    this.tleLine2 = tleLine2;

    this.updateSatelliteData();
    this.updateSatelliteName(satelliteName);
  }

updateSatelliteName(satelliteName: string) {
  this.satelliteName = satelliteName;
  console.log('Nuevo nombre del satélite:', this.satelliteName); // Agregar este registro para verificar
  this.satelliteNameSubject.next(this.satelliteName);
}
}