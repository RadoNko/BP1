import {TestBed} from '@angular/core/testing';

import {ImportService} from './import.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material';

describe('ImportService', () => {
  let service: ImportService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(ImportService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import', () => {
    http.get('assets/mortgage_modeler.xml', {responseType: 'text'})
      .subscribe(data => {
        const model = service.importFromXml(service.parseXml(data));
        expect(model).toBeTruthy();
      });
  });
});
