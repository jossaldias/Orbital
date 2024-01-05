import { Injectable } from '@angular/core';
import * as satellite from 'satellite.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SatelliteCalculationService {
  private coordinatesSubject: Subject<any> = new Subject<any>();
  private satelliteJsonSubject: Subject<any> = new Subject<any>();
  private satelliteArraySubject: Subject<any> = new Subject<any>();

  private intervalId: any;

  private tleLine1: string = '';
  private tleLine2: string = '';

  constructor() {
    this.updateSatelliteData();
    this.calculateSatelliteCoordinatesFor24Hours
  }

  get coordinates$() {
    return this.coordinatesSubject.asObservable();
  }

  get satelliteJson$() {
    return this.satelliteJsonSubject.asObservable();
  }
get satelliteArray$() {
    return this.satelliteArraySubject.asObservable();
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

      this.coordinatesSubject.next(coordinates);
    }, 0); 
  }


  updateTLE(tleLine1: string, tleLine2: string) {
    clearInterval(this.intervalId);

    this.tleLine1 = tleLine1;
    this.tleLine2 = tleLine2;

    this.updateSatelliteData();
  }

  updateJson(satelliteJson: any) {
    this.satelliteJsonSubject.next(satelliteJson);
  }

private calculateSatelliteCoordinatesFor24Hours() {
  const coordinatesArray: any[] = [];

  const currentTime = new Date();

  // Calcular las coordenadas para un período de 24 horas
  for (let i = 0; i < 24; i++) {
    const timeAtStep = new Date(currentTime.getTime() + i * 3600000); // Incrementar la hora por cada paso (3600000 ms = 1 hora)

    const satrec = satellite.twoline2satrec(this.tleLine1, this.tleLine2);
    const positionAndVelocity = satellite.propagate(satrec, timeAtStep);

    const positionEci: any = positionAndVelocity.position;
    const gmst = satellite.gstime(timeAtStep);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height;

    coordinatesArray.push([longitude, latitude, altitude]); // Agregar las coordenadas al array
  }

    this.satelliteArraySubject.next(coordinatesArray);
}


}
