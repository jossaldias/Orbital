import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteInfoComponent } from './satellite-info.component';

describe('SatelliteInfoComponent', () => {
  let component: SatelliteInfoComponent;
  let fixture: ComponentFixture<SatelliteInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SatelliteInfoComponent]
    });
    fixture = TestBed.createComponent(SatelliteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
