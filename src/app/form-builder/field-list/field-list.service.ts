import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {GridsterExistingFieldEvent} from './classes/gridster-existing-field-event';
import {DataFieldObject} from '../data-field/classes/data-field-object';

export enum FieldType {
  Text = 'text',
  Boolean = 'boolean',
  Enumeration = 'enumeration',
  Multichoice = 'multichoice',
  Number = 'number',
  Date = 'date',
  Datetime = 'dateTime',
  File = 'file',
  FileList = 'fileList',
  User = 'user',
  TaskRef = 'taskRef',
  CaseRef = 'caseRef'
}

@Injectable({
  providedIn: 'root'
})
export class FieldListService {

  fieldListArray: any = [
    {
      title: 'Text field',
      type: FieldType.Text,
      views: [
        {title: 'Simple'},
        {title: 'Area'}
      ]
    },
    {
      title: 'Enumeration field',
      type: FieldType.Enumeration,
      views: [
        {title: 'Select'},
        {title: 'List'}
      ]
    },
    {
      title: 'Multichoice field',
      type: FieldType.Multichoice,
      views: [
        {title: 'Select'},
        {title: 'List'}
      ]
    },
    {
      title: 'Boolean field',
      type: FieldType.Boolean,
      views: [
        {title: 'Slide'}
      ]
    },
    {
      title: 'Number field',
      type: FieldType.Number,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'Date field',
      type: FieldType.Date,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'Datetime field',
      type: FieldType.Datetime,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'File field',
      type: FieldType.File,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'File list field',
      type: FieldType.FileList,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'User field',
      type: FieldType.User,
      views: [
        {title: 'Simple'}
      ]
    },
    {
      title: 'TaskRef field',
      type: FieldType.TaskRef,
      views: [
        {title: 'Simple'}
      ]
    },
  ];

  emptyCustomFieldList: any[];

  public existingFieldEvents: Subject<GridsterExistingFieldEvent>;

  public draggedObjectsStream: Subject<DataFieldObject<any>>;

  constructor() {
    this.existingFieldEvents = new Subject();
    this.draggedObjectsStream = new Subject();
    this.emptyCustomFieldList = JSON.parse(JSON.stringify(this.fieldListArray));
    this.emptyCustomFieldList.forEach(type => {
      type.views = [];
    });
  }
}
