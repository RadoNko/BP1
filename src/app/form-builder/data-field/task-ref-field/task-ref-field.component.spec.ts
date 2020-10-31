import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskRefFieldComponent} from './task-ref-field.component';
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
import {Component} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {TaskRefField, TaskRefFieldTypes} from '../classes/task-ref-field';

describe('TaskRefFieldComponent', () => {
  let component: TaskRefFieldComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskRefFieldComponent,
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
  template: '<nab-task-ref-field [datafieldObject]="dataField" [showLabel]="showLabel"></nab-task-ref-field>'
})
class TestWrapperComponent {
  dataField = new TaskRefField('', '', '', true, [], '', '', 'outline', TaskRefFieldTypes.CUSTOM);
  showLabel = new WrapperBoolean(true);
}
