import { TestBed } from '@angular/core/testing';

import { HeatmapModeService } from './heatmap-mode.service';

describe('HeatmapModeService', () => {
  let service: HeatmapModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
