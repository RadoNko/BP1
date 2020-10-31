import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTreeComponent } from './validation-tree.component';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from '../../../../material-import/material-import.module';
import {CdkImportModule} from '../../../../cdk-import/cdk-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule, MatSortModule, MatTabsModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {HotkeyModule} from 'angular2-hotkeys';
import {ResizableModule} from 'angular-resizable-element';

describe('ValidationTreeComponent', () => {
  let component: ValidationTreeComponent;
  let fixture: ComponentFixture<ValidationTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationTreeComponent ],
      imports: [
        CommonModule,
        MaterialImportModule,
        CdkImportModule,
        FlexLayoutModule,
        FormsModule,
        MatCheckboxModule,
        MatTabsModule,
        RouterModule,
        MonacoEditorModule.forRoot(),
        HotkeyModule.forRoot(),
        MatSortModule,
        ResizableModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
