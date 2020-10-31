import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListFieldComponent } from './file-list-field.component';
import {Component} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GridsterModule} from 'angular-gridster2';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialImportModule} from '../../../material-import/material-import.module';
import {CompileModule} from 'p3x-angular-compile';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ResizableModule} from 'angular-resizable-element';
import {FileListField, FileListFieldTypes} from '../classes/file-list-field';

describe('FileListFieldComponent', () => {
  let component: FileListFieldComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FileListFieldComponent,
        TestWrapperComponent
      ],
      imports: [
        CommonModule,
        DragDropModule,
        GridsterModule,
        FormsModule,
        HttpClientModule,
        MaterialImportModule,
        CompileModule,
        FlexLayoutModule,
        AngularResizedEventModule,
        ResizableModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'nab-test-wrapper',
  template: '<nab-file-list-field [datafieldObject]="dataField" [showLabel]="showLabel"></nab-file-list-field>'
})
class TestWrapperComponent {
  dataField = new FileListField('', '', true, [], '', FileListFieldTypes.CUSTOM);
  showLabel = new WrapperBoolean();
}
