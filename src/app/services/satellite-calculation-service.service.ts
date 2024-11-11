import { Injectable } from '@angular/core';
import * as satellite from 'satellite.js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SatelliteCalculationService {
  private coordinatesSubject: Subject<any> = new Subject<any>();
  private satelliteJsonSubject: Subject<any> = new Subject<any>();
  private satelliteArraySubject: Subject<any[]> = new Subject<any[]>();

  private intervalId: any;

  private tleLine1: string = '';
  private tleLine2: string = '';

  constructor() {
    this.updateSatelliteData();
    this.calculateSatelliteCoordinatesFor24Hours();
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


// private calculateSatelliteCoordinatesFor24Hours() {

//   const currentTime = new Date();

//   const startMinute = currentTime.getMinutes(); // Obtener el minuto actual
//   const intervalMinutes = 5; // Intervalo de minutos

//   for (let i = startMinute; i <= startMinute + 1440; i += intervalMinutes) { // 1440 minutos en 24 horas
//     const timeAtStep = new Date(currentTime.getTime() + (i - startMinute) * 60000); // Incrementar por minutos (60000 ms = 1 minuto)

//     const satrec = satellite.twoline2satrec('1 38011U 11076E   24006.81518052  .00001471  00000+0  19135-3 0  9994', '2 38011  97.7267  71.8874 0001437  82.9664  52.9251 14.82088223652216');
//     const positionAndVelocity = satellite.propagate(satrec, timeAtStep);
//     //console.log(positionAndVelocity)
//     const positionEci: any = positionAndVelocity.position;
//     const gmst = satellite.gstime(timeAtStep);
//     const positionGd = satellite.eciToGeodetic(positionEci, gmst);

//     const latitude = satellite.degreesLat(positionGd.latitude);
//     const longitude = satellite.degreesLong(positionGd.longitude);
//     const altitude = positionGd.height;

//       this.coordinatesFor24Hours.push([longitude, latitude, altitude]);
//       //console.log('SSOT' + this.coordinatesFor24Hours)
//   }
// }


private calculateSatelliteCoordinatesFor24Hours() {
  const coordinatesArray: any[] = [];

  const currentTime = new Date();

  const startMinute = currentTime.getMinutes(); // Obtener el minuto actual
  const intervalMinutes = 0.01; // Intervalo de minutos

  for (let i = startMinute; i <= startMinute + 1380; i += intervalMinutes) { // 1440 minutos en 24 horas
    const timeAtStep = new Date(currentTime.getTime() + (i - startMinute) * 60000); // Incrementar por minutos (60000 ms = 1 minuto)

    const satrec = satellite.twoline2satrec(this.tleLine1, this.tleLine2);
    const positionAndVelocity = satellite.propagate(satrec, timeAtStep);
    //console.log(positionAndVelocity)
    const positionEci: any = positionAndVelocity.position;
    const gmst = satellite.gstime(timeAtStep);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height;

    coordinatesArray.push([longitude, latitude, altitude]); // Agregar las coordenadas al array
  }
    this.satelliteArraySubject.next(coordinatesArray); 
    //console.log(coordinatesArray + '')
}

  updateTLE(tleLine1: string, tleLine2: string) {
    clearInterval(this.intervalId);

    this.tleLine1 = tleLine1;
    this.tleLine2 = tleLine2;

    this.updateSatelliteData();
    this.calculateSatelliteCoordinatesFor24Hours();

  }

  updateJson(satelliteJson: any) {
    this.satelliteJsonSubject.next(satelliteJson);
  }




}
