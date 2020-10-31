import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DatetimeFieldComponent} from './datetime-field.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GridsterModule} from 'angular-gridster2';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialImportModule} from '../../../material-import/material-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ResizableModule} from 'angular-resizable-element';
import {CompileModule} from 'p3x-angular-compile';
import {Component} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {DatetimeField, DatetimeFieldTypes} from '../classes/datetime-field';

describe('DatetimeFieldComponent', () => {
  let component: DatetimeFieldComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatetimeFieldComponent,
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
  template: '<nab-datetime-field [datafieldObject]="dataField" [showLabel]="showLabel"></nab-datetime-field>'
})
class TestWrapperComponent {
  dataField = new DatetimeField('', '', new Date(), true, [], '', '', 'outline', DatetimeFieldTypes.CUSTOM);
  showLabel = new WrapperBoolean();
}
