import { TestBed } from '@angular/core/testing';

import { I18nModeService } from './i18n-mode.service';

describe('I18nModeService', () => {
  let service: I18nModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
