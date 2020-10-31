import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumerationFieldComponent } from './enumeration-field.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GridsterModule} from 'angular-gridster2';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialImportModule} from '../../../../material-import/material-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ResizableModule} from 'angular-resizable-element';
import {CompileModule} from 'p3x-angular-compile';
import {Component} from '@angular/core';
import {EnumerationField, EnumerationFieldTypes} from '../../classes/enumeration-field';
import {WrapperBoolean} from '../../classes/wrapper-boolean';

describe('EnumerationFieldComponent', () => {
  let component: EnumerationFieldComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EnumerationFieldComponent,
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
  template: '<nab-enumeration-field [datafieldObject]="dataField" [showLabel]="showLabel"></nab-enumeration-field>'
})
class TestWrapperComponent {
  dataField = new EnumerationField('', '', 'option', [{key: 'option', value: 'Option'}], true, [], '', '', 'outline', EnumerationFieldTypes.CUSTOM);
  showLabel = new WrapperBoolean();
}
