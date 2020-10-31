import { TestBed } from '@angular/core/testing';

import { CanvasService } from './canvas.service';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {MaterialImportModule} from '../material-import/material-import.module';

describe('CanvasService', () => {
  let service: CanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MaterialImportModule,
        MatDialogModule
      ]
    });
    service = TestBed.inject(CanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
