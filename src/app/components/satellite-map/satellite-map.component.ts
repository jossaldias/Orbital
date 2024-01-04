import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SatelliteCalculationService } from '../../services/satellite-calculation-service.service';
import { Subscription } from 'rxjs';
import mapboxgl from 'mapbox-gl';

interface SatelliteCoordinates {
  latitude: number;
  longitude: number;
  altitude: number;
}

@Component({
  selector: 'app-satellite-map',
  templateUrl: './satellite-map.component.html',
  styleUrls: ['./satellite-map.component.css']
})
export class SatelliteMapComponent implements OnInit, OnDestroy, AfterViewInit {
  map: mapboxgl.Map | undefined;
  marker: mapboxgl.Marker | undefined;
  satelliteCoordinates: SatelliteCoordinates | undefined;
  satelliteSubscription: Subscription | undefined;
  mapInitialized = false;
  satelliteJson: any = '';
  coordinatesArray: any[] = [];

  constructor(private satelliteService: SatelliteCalculationService) { }

  ngOnInit() {

    this.satelliteSubscription = this.satelliteService.coordinates$.subscribe(
      (coordinates: SatelliteCoordinates) => {
        this.satelliteCoordinates = coordinates;

        const newCoordinates = [this.satelliteCoordinates.longitude, this.satelliteCoordinates.latitude];
        this.coordinatesArray.push(newCoordinates);
        this.drawSatellitePath(this.coordinatesArray);

        this.updateMarkerPosition();
        this.initializeMap();
      }
    );

    this.satelliteService.satelliteJson$.subscribe((json: any) => {
      this.coordinatesArray.length = 0;
      this.flyToSatellite()
      this.satelliteJson = json;
      if (this.mapInitialized) {
        this.addOrUpdateMarker();
      }
    });

  }

  ngOnDestroy() {
    if (this.satelliteSubscription) {
      this.satelliteSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    if (!this.mapInitialized) {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpemExOTkxIiwiYSI6ImNscWZ5eGo0ZTE0NGUya3F3eDA5bzh6bXoifQ.ru0c29-QaQzDC_AefTP9tA'; // Reemplaza con tu token de Mapbox

      this.satelliteSubscription = this.satelliteService.coordinates$.subscribe(
        (coordinates: SatelliteCoordinates) => {
          this.satelliteCoordinates = coordinates;

          if (this.satelliteCoordinates && !this.map) {
            this.map = new mapboxgl.Map({
              container: 'map',
              //style: 'mapbox://styles/mapbox/streets-v9',
              style: 'mapbox://styles/shiza1991/clqrjzve800ld01pd59dg9y7s',
              center: [-70.648, -33.456],
              zoom: 1
            });
            this.map.addControl(new mapboxgl.NavigationControl());
            this.map.on('style.load', () => {
              //this.addRadarLayer();
              this.mapInitialized = true;
              this.addOrUpdateMarker();
            });
          }
        }
      );
    }
  }


  flyToSatellite() {
    if (this.satelliteCoordinates && this.map) {

      const { latitude, longitude } = this.satelliteCoordinates;
      this.map.flyTo({
        center: [longitude, latitude],
        zoom: 1,
        essential: true
      });
    }
  }

  updateMarkerPosition() {
    if (this.mapInitialized && this.map && this.satelliteCoordinates) {
      this.addOrUpdateMarker();
    }
  }


  addOrUpdateMarker() {
    if (!this.map || !this.satelliteCoordinates || !this.satelliteJson) {
      return;
    }

    const { latitude, longitude } = this.satelliteCoordinates;

    const el = this.createCustomMarker();

    if (!this.marker) {
      this.marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map);
    } else {
      this.marker.setLngLat([longitude, latitude]);

      if (this.marker.getElement()) {
        this.marker.getElement().remove();
      }
      this.marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map);
      const legend = document.createElement('div');
      legend.id = 'satelliteNameLabel';
      legend.innerHTML = this.satelliteJson.OBJECT_NAME;
      legend.style.color = '#ffffff';
      legend.style.fontSize = '10px';
      legend.style.height = '30px';
      legend.style.textAlign = 'center';
      legend.style.backgroundColor = '#000000';
      legend.style.padding = '10px';
      legend.style.marginTop = '-50px';
      legend.style.borderRadius = '5px';
      legend.style.width = '70px';
      legend.style.display = 'flex';
      legend.style.justifyContent = 'center';
      legend.style.alignItems = 'center';
      this.marker.getElement().appendChild(legend);

      const popupContent = this.generatePopupContent();
      const popup = new mapboxgl.Popup({ closeButton: false }).setHTML(popupContent);
      this.marker.setPopup(popup);

      this.marker.getElement().addEventListener('click', () => {
        if (this.marker?.getPopup) {
          this.marker.getPopup().remove();
        }
      });


      const labelElement = this.marker.getElement().querySelector('#satelliteNameLabel');
      if (labelElement) {
        labelElement.innerHTML = this.satelliteJson.OBJECT_NAME;
      }

      const existingPopup = this.marker.getPopup();
      if (existingPopup) {
        existingPopup.setHTML(popupContent);
      }
    }
  }

  private createCustomMarker(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'custom-marker';

    switch (this.satelliteJson.OBJECT_NAME) {
      case 'SSOT':
        el.style.backgroundImage = 'url(\'../../assets/img/fasat.png\')';
        el.style.width = '150px';
        el.style.height = '150px';
        break;
      case 'ISS (ZARYA)':
        el.style.backgroundImage = 'url(\'../../assets/img/iss.png\')';
        el.style.width = '50px';
        el.style.height = '50px';
        break;
      default:
        el.style.backgroundImage = 'url(\'../../assets/img/sat.png\')';
        el.style.width = '50px';
        el.style.height = '50px';
        break;
    }

    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';

    return el;
  }

  private generatePopupContent(): string {
    return `
    <h6>${this.satelliteJson.OBJECT_NAME}</h6>  
        <table>
        <tr>
            <td><strong>OBJECT_ID:</strong></td>
            <td><pre>${this.satelliteJson.OBJECT_ID}</pre></td>
        </tr>
        <tr>
            <td><strong>EPOCH:</strong></td>
            <td><pre>${this.satelliteJson.EPOCH}</pre></td>
        </tr>
        <tr>
            <td><strong>MEAN_MOTION:</strong></td>
            <td><pre>${this.satelliteJson.MEAN_MOTION}</pre></td>
        </tr>
        <tr>
            <td><strong>ECCENTRICITY:</strong></td>
            <td><pre>${this.satelliteJson.ECCENTRICITY}</pre></td>
        </tr>
        <tr>
            <td><strong>INCLINATION:</strong></td>
            <td><pre>${this.satelliteJson.INCLINATION}</pre></td>
        </tr>
        <tr>
            <td><strong>RA_OF_ASC_NODE:</strong></td>
            <td><pre>${this.satelliteJson.RA_OF_ASC_NODE}</pre></td>
        </tr>
        <tr>
            <td><strong>ARG_OF_PERICENTER:</strong></td>
            <td><pre>${this.satelliteJson.ARG_OF_PERICENTER}</pre></td>
        </tr>
        <tr>
            <td><strong>MEAN_ANOMALY:</strong></td>
            <td><pre>${this.satelliteJson.MEAN_ANOMALY}</pre></td>
        </tr>
        <tr>
            <td><strong>EPHEMERIS_TYPE:</strong></td>
            <td><pre>${this.satelliteJson.EPHEMERIS_TYPE}</pre></td>
        </tr>
        <tr>
            <td><strong>CLASSIFICATION_TYPE:</strong></td>
            <td><pre>${this.satelliteJson.CLASSIFICATION_TYPE}</pre></td>
        </tr>
        <tr>
            <td><strong>NORAD_CAT_ID:</strong></td>
            <td><pre>${this.satelliteJson.NORAD_CAT_ID}</pre></td>
        </tr>
        <tr>
            <td><strong>ELEMENT_SET_NO:</strong></td>
            <td><pre>${this.satelliteJson.ELEMENT_SET_NO}</pre></td>
        </tr>
        <tr>
            <td><strong>REV_AT_EPOCH:</strong></td>
            <td><pre>${this.satelliteJson.REV_AT_EPOCH}</pre></td>
        </tr>
        <tr>
            <td><strong>BSTAR:</strong></td>
            <td><pre>${this.satelliteJson.BSTAR}</pre></td>
        </tr>
        <tr>
            <td><strong>MEAN_MOTION_DOT:</strong></td>
            <td><pre>${this.satelliteJson.MEAN_MOTION_DOT}</pre></td>
        </tr>
        <tr>
            <td><strong>MEAN_MOTION_DDOT:</strong></td>
            <td><pre>${this.satelliteJson.MEAN_MOTION_DDOT}</pre></td>
        </tr>
        </table>
  `;
  }


  drawSatellitePath(coordinates: any[]) {
    if (!this.map || !coordinates || coordinates.length < 2) {
      return;
    }

    if (!this.map.getSource('satellitePath')) {
      this.map.addSource('satellitePath', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });


      this.map.addLayer({
        id: 'satellitePath',
        type: 'line',
        source: 'satellitePath',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF0000',
          'line-opacity': 0.8,
          'line-width': 2
        }
      });



    } else {
      const satellitePathSource = this.map.getSource('satellitePath');
      if (satellitePathSource) {
        (satellitePathSource as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });
      }
    }
  }

}


