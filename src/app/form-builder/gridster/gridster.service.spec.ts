import { TestBed } from '@angular/core/testing';

import { GridsterService } from './gridster.service';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {MaterialImportModule} from '../../material-import/material-import.module';

describe('GridsterService', () => {
  let service: GridsterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MaterialImportModule,
        MatDialogModule
      ]
    });
    service = TestBed.inject(GridsterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
