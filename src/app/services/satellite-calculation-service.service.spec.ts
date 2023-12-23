import { TestBed } from '@angular/core/testing';

import { SatelliteCalculationService } from './satellite-calculation-service.service';

describe('SatelliteCalculationServiceService', () => {
  let service: SatelliteCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatelliteCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
