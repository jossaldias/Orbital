import { Injectable } from '@angular/core';
import * as satellite from 'satellite.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SatelliteCalculationService {
  private coordinatesSubject: Subject<any> = new Subject<any>();
  private satelliteNameSubject: Subject<string> = new Subject<string>();
  private satelliteJsonSubject: Subject<any> = new Subject<any>();
  private intervalId: any;

  private tleLine1: string = '1 41866U 16071A   23359.22757810 -.00000237  00000+0  00000+0 0  9995';
  private tleLine2: string = '2 41866   0.0654 247.0651 0001352  56.0167 157.1108  1.00271540 26037';
  private satelliteName: string = 'Unnamed Satellite'; // Nombre predeterminado
  private satelliteJson: any = '';

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
  get satelliteJson$(){
    return this.satelliteJsonSubject.asObservable()};

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

  updateJson(satelliteJson: any) {
    console.log('Nuevo JSON del satélite:', satelliteJson);
    this.satelliteJson = satelliteJson;
    this.satelliteJsonSubject.next(this.satelliteJson);
    // Imprimir el JSON en la consola del navegador
    console.log('Satellite JSON:', this.satelliteJson);
  }


}