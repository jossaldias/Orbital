const satellite = require('satellite.js');

// TLE del satélite
const tleLine1 = '1 38011U 11076E   23354.79367538  .00002248  00000+0  28953-3 0  9998';
const tleLine2 = '2 38011  97.7290  55.4537 0001608  87.9070   6.9436 14.82018237649692';

// Fecha y hora actual
const currentTime = new Date();

// Cargar datos de efemérides
const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

// Calcular posición del satélite en la fecha y hora actual
const positionAndVelocity = satellite.propagate(satrec, currentTime);

// Obtener coordenadas (latitud, longitud, altitud)
const positionEci = positionAndVelocity.position;
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

window.satelliteCoordinates = coordinates;
