import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModeComponent } from './edit-mode.component';
import {HttpClientModule} from '@angular/common/http';
import {MaterialImportModule} from '../../material-import/material-import.module';
import {CommonModule} from '@angular/common';
import {CdkImportModule} from '../../cdk-import/cdk-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule, MatSortModule, MatTabsModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {HotkeyModule} from 'angular2-hotkeys';
import {ResizableModule} from 'angular-resizable-element';
import {RouterTestingModule} from '@angular/router/testing';

describe('EditModeComponent', () => {
  let component: EditModeComponent;
  let fixture: ComponentFixture<EditModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModeComponent ],
      imports: [
        HttpClientModule,
        MaterialImportModule,
        CommonModule,
        CdkImportModule,
        FlexLayoutModule,
        FormsModule,
        MatCheckboxModule,
        MatTabsModule,
        RouterModule,
        MonacoEditorModule.forRoot(),
        HotkeyModule.forRoot(),
        MatSortModule,
        ResizableModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
