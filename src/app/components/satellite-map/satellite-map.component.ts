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

  constructor(private satelliteService: SatelliteCalculationService) {}

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
              style: 'mapbox://styles/mapbox/streets-v11',
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
        essential: true // Asegura una transición suave
      });
      this.addOrUpdateMarker(); 
    }
  }

  addOrUpdateMarker() {
    if (!this.map || !this.satelliteCoordinates || !this.satelliteName) {
      return;
    }

    const { latitude, longitude } = this.satelliteCoordinates;

    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = 'url(\'../../assets/img/fasat.png\')';
    el.style.width = '200px';
    el.style.height = '200px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';

    if (!this.marker) {
      this.marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(this.map);

      const legend = document.createElement('div');
      legend.id = 'satelliteNameLabel';
      legend.innerHTML = this.satelliteName;
      legend.style.color = '#ffffff';
      legend.style.fontSize = '20px';
      legend.style.textAlign = 'center';
      legend.style.backgroundColor = '#000000';
      legend.style.padding = '5px';
      legend.style.borderRadius = '5px';
      legend.style.width = '70px';
      this.marker.getElement().appendChild(legend);
    } else {
      this.marker.setLngLat([longitude, latitude]);
        const labelElement = this.marker.getElement().querySelector('#satelliteNameLabel');
              if (labelElement) {
                labelElement.innerHTML = this.satelliteName;
              }
    }
  }
}