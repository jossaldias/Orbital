import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteMapComponent } from './satellite-map.component';

describe('SatelliteMapComponent', () => {
  let component: SatelliteMapComponent;
  let fixture: ComponentFixture<SatelliteMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SatelliteMapComponent]
    });
    fixture = TestBed.createComponent(SatelliteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
