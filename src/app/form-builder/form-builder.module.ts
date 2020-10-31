import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilderComponent} from './form-builder.component';
import {PaperComponent} from './paper/paper.component';
import {FieldListComponent} from './field-list/field-list.component';
import {GridsterComponent} from './gridster/gridster.component';
import {DataFieldComponent} from './data-field/data-field.component';
import {EditPanelComponent} from './edit-panel/edit-panel.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GridsterModule} from 'angular-gridster2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialImportModule} from '../material-import/material-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SimpleTextFieldComponent} from './data-field/text-field/simple-text-field/simple-text-field.component';
import {AreaTextFieldComponent} from './data-field/text-field/area-text-field/area-text-field.component';
import {SelectEnumerationFieldComponent} from './data-field/enumeration-field/select-enumeration-field/select-enumeration-field.component';
import {ListEnumerationFieldComponent} from './data-field/enumeration-field/list-enumeration-field/list-enumeration-field.component';
import {SelectMultichoiceFieldComponent} from './data-field/multichoice-field/select-multichoice-field/select-multichoice-field.component';
import {ListMultichoiceFieldComponent} from './data-field/multichoice-field/list-multichoice-field/list-multichoice-field.component';
import {BooleanFieldComponent} from './data-field/boolean-field/boolean-field.component';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GridsterDatafieldComponent} from './gridster/gridster-datafield/gridster-datafield.component';
import {EnumerationFieldComponent} from './data-field/enumeration-field/enumeration-field/enumeration-field.component';
import {MultichoiceFieldComponent} from './data-field/multichoice-field/multichoice-field/multichoice-field.component';
import {TextFieldComponent} from './data-field/text-field/text-field/text-field.component';
import {NumberFieldComponent} from './data-field/number-field/number-field.component';
import {DateFieldComponent} from './data-field/date-field/date-field.component';
import {DatetimeFieldComponent} from './data-field/datetime-field/datetime-field.component';
import {FileFieldComponent} from './data-field/file-field/file-field.component';
import {UserFieldComponent} from './data-field/user-field/user-field.component';
import {TaskRefFieldComponent} from './data-field/task-ref-field/task-ref-field.component';
import {ResizableModule} from 'angular-resizable-element';
import { FileListFieldComponent } from './data-field/file-list-field/file-list-field.component';
import {ModelerModule} from '../modeler/modeler.module';
import { InfoLabelComponent } from './info-label/info-label.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    PaperComponent,
    FieldListComponent,
    GridsterComponent,
    DataFieldComponent,
    EditPanelComponent,
    SimpleTextFieldComponent,
    AreaTextFieldComponent,
    SelectEnumerationFieldComponent,
    ListEnumerationFieldComponent,
    SelectMultichoiceFieldComponent,
    ListMultichoiceFieldComponent,
    BooleanFieldComponent,
    GridsterDatafieldComponent,
    GridsterDatafieldComponent,
    EnumerationFieldComponent,
    MultichoiceFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    DatetimeFieldComponent,
    FileFieldComponent,
    UserFieldComponent,
    TaskRefFieldComponent,
    FileListFieldComponent,
    InfoLabelComponent
  ],
  exports: [
    FormBuilderComponent
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    DragDropModule,
    GridsterModule,
    FormsModule,
    HttpClientModule,
    MaterialImportModule,
    FlexLayoutModule,
    AngularResizedEventModule,
    ResizableModule,
    ModelerModule,
    ReactiveFormsModule,
  ]
})
export class FormBuilderModule {
}
