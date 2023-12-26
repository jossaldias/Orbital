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
  satelliteName: string | undefined;
  satelliteJson: any = '';

  constructor(private satelliteService: SatelliteCalculationService) { }

  ngOnInit() {
    this.satelliteSubscription = this.satelliteService.coordinates$.subscribe(
      (coordinates: SatelliteCoordinates) => {
        this.satelliteCoordinates = coordinates;
        this.updateMarkerPosition();
      }
    );

    this.satelliteService.satelliteName$.subscribe((name: string) => {
      this.satelliteName = name;
      if (this.mapInitialized) {
        this.addOrUpdateMarker();
      }
    });

    this.satelliteService.satelliteJson$.subscribe((json: any) => {
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
              style: 'mapbox://styles/mapbox/dark-v11',
              center: [coordinates.longitude, coordinates.latitude],
              zoom: 5
            });

            this.map.on('load', () => {
              this.mapInitialized = true;
              this.addOrUpdateMarker();
            });
          }
        }
      );
    }
  }

  updateMarkerPosition() {
    if (this.mapInitialized && this.map && this.satelliteCoordinates) {
      this.addOrUpdateMarker();
      const { latitude, longitude } = this.satelliteCoordinates;
      this.map.flyTo({
        center: [longitude, latitude],
        essential: true,
      });
      this.addOrUpdateMarker();
    }
  }

  addOrUpdateMarker() {
    if (!this.map || !this.satelliteCoordinates || !this.satelliteName || !this.satelliteJson) {
      return;
    }

    const { latitude, longitude } = this.satelliteCoordinates;

    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = 'url(\'../../assets/img/fasat.png\')';
    el.style.width = '150px';
    el.style.height = '150px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';

    if (!this.marker) {
      this.marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map);

      const legend = document.createElement('div');
      legend.id = 'satelliteNameLabel';
      legend.innerHTML = this.satelliteJson.OBJECT_NAME;
      legend.style.color = '#ffffff';
      legend.style.fontSize = '10px';
      legend.style.height = '25px';
      legend.style.textAlign = 'center';
      legend.style.backgroundColor = '#000000';
      legend.style.padding = '5px';
      legend.style.borderRadius = '5px';
      legend.style.width = '70px';
      legend.style.display = 'flex';
      legend.style.justifyContent = 'center';
      legend.style.alignItems = 'center';
      this.marker.getElement().appendChild(legend);


      const popup = new mapboxgl.Popup().setHTML(`

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
        `);
      this.marker.setPopup(popup);

      this.marker.getElement().addEventListener('click', () => {
        if (this.marker) {
          this.marker.togglePopup();
        }
      });
    } else {
      this.marker.setLngLat([longitude, latitude]);
      const labelElement = this.marker.getElement().querySelector('#satelliteNameLabel');
      if (labelElement) {
        labelElement.innerHTML = this.satelliteName;
      }
      const popupContent = `

        <h2>${this.satelliteJson.OBJECT_NAME}</h2>  
        <table style="font-size: 6px; border-collapse: collapse; padding:0px">
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
    </table>`;

      const existingPopup = this.marker.getPopup();
      if (existingPopup) {
        existingPopup.setHTML(popupContent);
      }


    }
  }
}


