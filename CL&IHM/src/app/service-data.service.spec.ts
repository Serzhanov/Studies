import { TestBed } from '@angular/core/testing';

import { ServiceDataService } from './service-data.service';

describe('ServiceDataService', () => {
  let service: ServiceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
