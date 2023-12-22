import { TestBed } from '@angular/core/testing';

import { SatelliteCalculationServiceService } from './satellite-calculation-service.service';

describe('SatelliteCalculationServiceService', () => {
  let service: SatelliteCalculationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatelliteCalculationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
