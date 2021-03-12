import {Injectable} from '@angular/core';
import {Model} from './classes/model';
import {AssignPolicy, FinishPolicy, Transition} from './classes/transition';
import {RoleRef} from './classes/role-ref';
import {DataGroup} from './classes/datagroup';
import {Trigger} from './classes/trigger';
import {Event} from './classes/event';
import {Transaction} from './classes/transaction';
import {Role} from './classes/role';
import {DataVariable, DataView} from './classes/data-variable';
import {Place} from './classes/place';
import {Arc} from './classes/arc';
import {Point} from './classes/point';
import {Action} from './classes/action';
import {DataRef} from './classes/data-ref';
import {ModelerConfig} from './modeler-config';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {DatafieldTransformer} from '../form-builder/gridster/datafield.transformer';
import {I18nTranslations} from './classes/i18n-translations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HeatmapModeService} from "./heatmap-mode/heatmap-mode.service";

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private HeatMapService : HeatmapModeService) {
  }

  private originFile: string;
  private originLogFile: string;

  static correctMax(value: number, max: number) {
    return value > max ? max : value;
  }

  openFile(event, fileInputFieldId = 'openFileXml'): Promise<Model> {
    return new Promise(resolve => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.originFile = String(reader.result);

        const model = this.importFromXml(this.parseXml(this.originFile));
        // const fileInputField = document.getElementById(fileInputFieldId) as HTMLInputElement;
        // fileInputField.value = '';
        resolve(model);
      };
      reader.readAsText(file);
    });
  }
  openLogFile(event){
    const file = event.target.files[0];
    this.originLogFile = this.HeatMapService.loadFile(file);

  }

  parseXml(txt: string): Document {
    let xmlDoc;
    if (window.DOMParser) {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(txt, 'text/xml');
    }
    return xmlDoc;
  }


  importFromXml(xmlDoc): Model {
    const model = new Model();
    this.importModel(model, xmlDoc);
    this.importData(xmlDoc, model);
    this.importTransitions(xmlDoc, model);
    this.importDataRefs(model);
    this.importTransactions(xmlDoc, model);
    this.importRoles(xmlDoc, model);
    this.importPlaces(model, xmlDoc);
    this.importArcs(model, xmlDoc);
    this.importI18n(model, xmlDoc);
    return model;
  }
  renderFromLog(logDoc) : Model{
    const model = new Model();

    return model;
  }

  private importArcs(model: Model, xmlDoc) {
    model.arcs = [];
    let source;
    let target;
    const xmlArcs = xmlDoc.getElementsByTagName('arc');
    for (const arc of xmlArcs) {
      const ind = model.arcs.length;
      let sourceFound = 0;
      for (const place of model.places) {
        if (place.id === arc.getElementsByTagName('sourceId')[0].childNodes[0].nodeValue) {
          source = place;
          sourceFound = 1;
          break;
        }
      }
      if (sourceFound === 0) {
        for (const trans of model.transitions) {
          if (trans.id === arc.getElementsByTagName('sourceId')[0].childNodes[0].nodeValue) {
            source = trans;
            sourceFound = 2;
            break;
          }
        }
      }
      if (sourceFound === 2) {
        for (const place of model.places) {
          if (place.id === arc.getElementsByTagName('destinationId')[0].childNodes[0].nodeValue) {
            target = place;
            break;
          }
        }
      }
      if (sourceFound === 1) {
        for (const trans of model.transitions) {
          if (trans.id === arc.getElementsByTagName('destinationId')[0].childNodes[0].nodeValue) {
            target = trans;
            break;
          }
        }
      }

      let parsedArcType = 'regular';

      if (arc.getElementsByTagName('type').length > 0) {
        if (arc.getElementsByTagName('type')[0].childNodes.length !== 0) {
          parsedArcType = arc.getElementsByTagName('type')[0].childNodes[0].nodeValue;
        }
      }
      model.arcs[ind] = new Arc(source, target, parsedArcType, arc.getElementsByTagName('id')[0].childNodes[0].nodeValue);

      if (parsedArcType === 'variable') {
        const refhrany = arc.getElementsByTagName('multiplicity')[0].childNodes[0].nodeValue;
        this.checkVariability(model, ind, refhrany);
        if (model.arcs[ind].placeref) {
          model.arcs[ind].vaha = model.arcs[ind].placeref.marking;
        } else if (model.arcs[ind].dataref) {
          model.arcs[ind].vaha = parseInt(model.arcs[ind].dataref.value, 10);
        } else {
          model.arcs[ind].vaha = parseInt(arc.getElementsByTagName('multiplicity')[0].childNodes[0].nodeValue, 10);
        }
      } else {
        model.arcs[ind].vaha = parseInt(arc.getElementsByTagName('multiplicity')[0].childNodes[0].nodeValue, 10);
      }

      if (model.arcs[ind].vaha === 1) {
        model.arcs[ind].vahalabel = '';
      } else {
        model.arcs[ind].vahalabel = model.arcs[ind].vaha;
      }

      if (arc.getElementsByTagName('breakPoint').length > 0) {
        const bodyxml = arc.getElementsByTagName('breakPoint');
        let xx: number;
        let yy: number;
        let j: number;
        for (j = 0; j < bodyxml.length; j++) {
          xx = parseInt(bodyxml[j].getElementsByTagName('x')[0].childNodes[0].nodeValue, 10);
          yy = parseInt(bodyxml[j].getElementsByTagName('y')[0].childNodes[0].nodeValue, 10);
          xx = this.correctMaxX(xx);
          yy = this.correctMaxY(yy);
          model.arcs[ind].bodyhrany[j + 1] = new Point(xx, yy);
        }
        model.arcs[ind].bodyhrany[j + 1] = new Point(ModelerConfig.COORDINATES_OFFSET, ModelerConfig.COORDINATES_OFFSET);
      }

      if (arc.getElementsByTagName('reference').length > 0) {
        if (arc.getElementsByTagName('reference')[0].childNodes.length !== 0) {
          const refhrany = arc.getElementsByTagName('reference')[0].childNodes[0].nodeValue;
          this.checkVariability(model, ind, refhrany);
        }
      }
    }
  }

  private importPlaces(model: Model, xmlDoc) {
    model.places = [];
    const xmlPlaces = xmlDoc.getElementsByTagName('place');
    for (let i = 0; i < xmlPlaces.length; i++) {
      const point = this.parsePoint(xmlPlaces[i]);

      let isStatic = false;
      if (xmlPlaces[i].getElementsByTagName('isStatic').length > 0) {
        if (xmlPlaces[i].getElementsByTagName('isStatic')[0].childNodes.length !== 0) {
          isStatic = (xmlPlaces[i].getElementsByTagName('isStatic')[0].childNodes[0].nodeValue === 'true');
        }
      }
      if (xmlPlaces[i].getElementsByTagName('static').length > 0) {
        if (xmlPlaces[i].getElementsByTagName('static')[0].childNodes.length !== 0) {
          isStatic = (xmlPlaces[i].getElementsByTagName('static')[0].childNodes[0].nodeValue === 'true');
        }
      }

      model.places[i] = new Place(point.x, point.y, isStatic, xmlPlaces[i].getElementsByTagName('id')[0].childNodes[0].nodeValue);

      model.places[i].marking = parseInt(xmlPlaces[i].getElementsByTagName('tokens')[0].childNodes[0].nodeValue, 10);
      if (xmlPlaces[i].getElementsByTagName('label').length > 0) {
        if (xmlPlaces[i].getElementsByTagName('label')[0].childNodes.length !== 0) {
          model.places[i].label = xmlPlaces[i].getElementsByTagName('label')[0].childNodes[0].nodeValue;
        }
      }
    }
  }

  private importRoles(xmlDoc, model: Model) {
    const xmlRoles = xmlDoc.getElementsByTagName('role');
    for (let i = 0; i < xmlRoles.length; i++) {
      const xmlRole = xmlRoles[i];
      const role = new Role(this.tagValue(xmlRole, 'id'));
      let title = this.parseI18n(xmlRole, 'title');
      if (title === undefined || title === '') {
        title = this.parseI18n(xmlRole, 'name');
      }
      role.title = title;
      model.roles[i] = role;
    }
  }

  private importTransactions(xmlDoc, model: Model) {
    const xmlTransactions = xmlDoc.getElementsByTagName('transaction');
    for (let i = 0; i < xmlTransactions.length; i++) {
      const xmlTransaction = xmlTransactions[i];
      const title = this.parseI18n(xmlTransaction, 'title');
      model.transactions[i] = new Transaction(this.tagValue(xmlTransaction, 'id'), title);
    }
  }

  private importDataRefs(model: Model) {
    // TODO refactor code so that each transition is processed after it gets parsed (don't loop transitions twice)
    const dataFieldMap = new Map<string, DataVariable>();
    model.processData.forEach(dataField => dataFieldMap.set(dataField.id, dataField));
    model.transitions.forEach(transition => {
      let skipDataRefs = false; // either data groups or data refs are processed
      if (transition.dataGroups.length > 0) {
        skipDataRefs = true;
        let rowIndex = 0;
        transition.dataGroups.forEach(dataGroup => {
          let columnIndex = 0;
          let columnMod = 2;
          let width = 2;
          if (dataGroup.stretch === 'true') {
            columnMod = 1;
            width = 4;
          }
          dataGroup.dataRefs.forEach(dataRef => {
            if (!dataFieldMap.has(dataRef.id)) {
              // TODO referenced data field doesn't exist -> notify user
              return; // continue
            }
            const gridster = DatafieldTransformer.createGridsterWrapperObject(dataFieldMap.get(dataRef.id), dataRef, columnIndex * 2, rowIndex, width);
            if (gridster !== null && gridster.datafield !== undefined) {
              transition.data.push(gridster);
            }
            columnIndex = (columnIndex + 1) % columnMod;
            if (columnIndex === 0) {
              rowIndex++;
            }
          });
          if (columnIndex !== 0) {
            rowIndex++;
          }
        });
      }
      if (!skipDataRefs && transition.dataRefs.length > 0) {
        let rowIndex = 0;
        transition.dataRefs.forEach(dataRef => {
          if (!dataFieldMap.has(dataRef.id)) {
            // TODO same as above
            return; // continue
          }
          const gridster = DatafieldTransformer.createGridsterWrapperObject(dataFieldMap.get(dataRef.id), dataRef, 0, rowIndex, 4);
          if (gridster !== null && gridster.datafield !== undefined) {
            transition.data.push(gridster);
          }
          rowIndex++;
        });
      }
    });
  }

  private importTransitions(xmlDoc, model: Model) {
    // parse TRANSITION data from XML
    const xmlTransitions = xmlDoc.getElementsByTagName('transition');
    for (let i = 0; i < xmlTransitions.length; i++) {
      let xx = parseInt(xmlTransitions[i].getElementsByTagName('x')[0].childNodes[0].nodeValue, 10);
      let yy = parseInt(xmlTransitions[i].getElementsByTagName('y')[0].childNodes[0].nodeValue, 10);

      xx = this.correctMaxX(xx);
      yy = this.correctMaxY(yy);
      model.transitions[i] = new Transition(xx, yy, xmlTransitions[i].getElementsByTagName('id')[0].childNodes[0].nodeValue);

      const xmlLayout = xmlTransitions[i].getElementsByTagName('layout');
      if (xmlLayout.length !== 0 && xmlLayout.item(0).parentNode.isSameNode(xmlTransitions[i])) {
        if (xmlLayout[0].getElementsByTagName('cols').length !== 0 && xmlLayout[0].getElementsByTagName('cols')[0].childNodes.length !== 0) {
          model.transitions[i].cols = parseInt(xmlLayout[0].getElementsByTagName('cols')[0].childNodes[0].nodeValue, 10);
        }

        if (xmlLayout[0].getElementsByTagName('offset').length > 0 && xmlLayout[0].getElementsByTagName('offset')[0].childNodes.length !== 0) {
          model.transitions[i].offset = parseInt(xmlLayout[0].getElementsByTagName('offset')[0].childNodes[0].nodeValue, 10);
        } else {
          model.transitions[i].offset = 0;
        }
      }


      if (xmlTransitions[i].getElementsByTagName('label').length > 0) {
        if (xmlTransitions[i].getElementsByTagName('label')[0].childNodes.length !== 0) {
          model.transitions[i].label = this.parseI18n(xmlTransitions[i], 'label');
        }
      }

      model.transitions[i].icon = this.tagValue(xmlTransitions[i], 'icon');
      model.transitions[i].priority = this.tagValue(xmlTransitions[i], 'priority');
      const assignPolicy = this.tagValue(xmlTransitions[i], 'assignPolicy');
      if (assignPolicy === '') {
        model.transitions[i].assignPolicy = AssignPolicy.manual;
      } else {
        model.transitions[i].assignPolicy = assignPolicy;
      }
      model.transitions[i].dataFocusPolicy = this.tagValue(xmlTransitions[i], 'dataFocusPolicy');
      const finishPolicy = this.tagValue(xmlTransitions[i], 'finishPolicy');
      if (finishPolicy === '') {
        model.transitions[i].finishPolicy = FinishPolicy.manual;
      } else {
        model.transitions[i].finishPolicy = finishPolicy;
      }
      const xmlRoleRefs = xmlTransitions[i].getElementsByTagName('roleRef');
      for (let j = 0; j < xmlRoleRefs.length; j++) {
        const xmlRoleRef = xmlRoleRefs[j];
        const xmlRoleRefLogic = xmlRoleRef.getElementsByTagName('logic')[0];
        const roleRef = new RoleRef(this.tagValue(xmlRoleRef, 'id'));
        roleRef.logic.delegate = this.tagValue(xmlRoleRefLogic, 'delegate') === 'true';
        roleRef.logic.perform = this.tagValue(xmlRoleRefLogic, 'perform') === 'true';
        roleRef.logic.view = this.tagValue(xmlRoleRefLogic, 'view') === 'true';
        model.transitions[i].roleRefs[j] = roleRef;
      }

      const xmlDataRefs = xmlTransitions[i].getElementsByTagName('dataRef');
      for (let j = 0; j < xmlDataRefs.length; j++) {
        const xmlDataRef = xmlDataRefs[j];
        if (xmlDataRef.parentElement.tagName !== 'transition') {
          continue;
        }
        model.transitions[i].dataRefs[j] = this.parseDataRef(xmlDataRef);
      }

      const xmlDataGroups = xmlTransitions[i].getElementsByTagName('dataGroup');
      for (let j = 0; j < xmlDataGroups.length; j++) {
        const xmlDataGroup = xmlDataGroups[j];
        const dataGroup = new DataGroup(this.tagValue(xmlDataGroup, 'id'));
        dataGroup.alignment = this.tagValue(xmlDataGroup, 'alignment');
        dataGroup.stretch = this.tagValue(xmlDataGroup, 'stretch');
        dataGroup.title = this.parseI18n(xmlDataGroup, 'title');
        const xmlDataGroupDataRefs = xmlDataGroup.getElementsByTagName('dataRef');
        for (let k = 0; k < xmlDataGroupDataRefs.length; k++) {
          dataGroup.dataRefs[k] = this.parseDataRef(xmlDataGroupDataRefs[k]);
        }
        model.transitions[i].dataGroups[j] = dataGroup;
      }

      const xmlTriggers = xmlTransitions[i].getElementsByTagName('trigger');
      for (let j = 0; j < xmlTriggers.length; j++) {
        const xmlTrigger = xmlTriggers[j];
        const trigger = new Trigger();
        trigger.delay = this.tagValue(xmlTrigger, 'delay') === '' ? undefined : parseInt(this.tagValue(xmlTrigger, 'delay'), 10);
        trigger.exact = this.tagValue(xmlTrigger, 'exact') === '' ? undefined : new Date(this.tagValue(xmlTrigger, 'exact'));
        trigger.type = this.tagAttribute(xmlTrigger, 'type');
        model.transitions[i].triggers[j] = trigger;
      }

      const xmlEvents = xmlTransitions[i].getElementsByTagName('event');
      for (let j = 0; j < xmlEvents.length; j++) {
        const xmlEvent = xmlEvents[j];
        const event = new Event();
        event.id = this.tagValue(xmlEvent, 'id');
        event.type = this.tagAttribute(xmlEvent, 'type');

        const xmlActions = xmlEvent.getElementsByTagName('actions');
        for (const action of xmlActions) {
          const actionsPhase = this.tagAttribute(action, 'phase');
          const actions = this.parseActions(action);
          if (actionsPhase === 'pre') {
            event.preactions = event.preactions.concat(actions);
          } else {
            event.postactions = event.postactions.concat(actions);
          }
        }
        model.transitions[i].events[j] = event;
      }
    }
  }

  private importData(xmlDoc, model: Model) {
    // parse DATA data from XML
    const xmlDataVariables = Array.from(xmlDoc.getElementsByTagName('data'));
    xmlDataVariables.forEach((xmlDataVariable: any, index) => {
      const dataVariable = new DataVariable(this.tagValue(xmlDataVariable, 'id'));
      dataVariable.name = this.parseI18n(xmlDataVariable, 'title');
      dataVariable.placeholder = this.parseI18n(xmlDataVariable, 'placeholder');
      dataVariable.desc = this.parseI18n(xmlDataVariable, 'desc');
      dataVariable.type = this.tagAttribute(xmlDataVariable, 'type');
      dataVariable.immediate = this.tagAttribute(xmlDataVariable, 'immediate');
      dataVariable.remote = this.tagValue(xmlDataVariable, 'remote');
      dataVariable.actions = this.parseActions(xmlDataVariable);
      dataVariable.encryption = this.parseEncryption(xmlDataVariable, 'encryption');
      dataVariable.value = dataVariable.init = this.tagValue(xmlDataVariable, 'init');
      dataVariable.view = this.parseViewType(xmlDataVariable);
      if (xmlDataVariable.getElementsByTagName('remote').length > 0) {
        dataVariable.remote = true;
      }
      const xmlValues = xmlDataVariable.getElementsByTagName('values');
      for (let j = 0; j < xmlValues.length; j++) {
        if (xmlValues[j].childNodes[0] === undefined) {
          if (dataVariable.type === 'enumeration' || dataVariable.type === 'multichoice') {
            dataVariable.values[j] = {key: '', value: ''};
          } else {
            dataVariable.values[j] = '';
          }
        } else {
          if (dataVariable.type === 'enumeration' || dataVariable.type === 'multichoice') {
            dataVariable.values[j] = {key: xmlValues[j].childNodes[0].nodeValue, value: xmlValues[j].childNodes[0].nodeValue} ;
          } else {
            dataVariable.values[j] = xmlValues[j].childNodes[0].nodeValue;
          }
        }
      }
      // dataVariable.actionRef; TODO
      dataVariable.valid = this.tagValue(xmlDataVariable, 'valid');
      const xmlValidations = xmlDataVariable.getElementsByTagName('validation');
      for (const val of xmlValidations) {
        dataVariable.validations.push({expression: this.tagValue(val, 'expression'), message: this.tagValue(val, 'message')});
      }
      model.processData[index] = dataVariable;
    });
  }

  private importModel(model: Model, xmlDoc) {
    model.id = this.tagValue(xmlDoc, 'id');
    model.version = this.tagValue(xmlDoc, 'version');
    model.initials = this.tagValue(xmlDoc, 'initials');
    model.title = this.parseI18n(xmlDoc, 'title');
    model.icon = this.tagValue(xmlDoc, 'icon');
    model.defaultRole = this.tagValue(xmlDoc, 'defaultRole');
    model.transitionRole = this.tagValue(xmlDoc, 'transitionRole');
    model.caseName = this.parseI18n(xmlDoc, 'caseName');
    model.transitions = [];
  }

  private importI18n(model: Model, xmlDoc) {
    const importedI18ns: Array<I18nTranslations> = [];
    const xmlI18ns = xmlDoc.getElementsByTagName('i18n');
    for (const xmlI18n of xmlI18ns as any) {
      const locale = this.tagAttribute(xmlI18n, 'locale');
      const i18nNode = new I18nTranslations(locale, []);
      const xmlI18strings = xmlI18n.getElementsByTagName('i18nString');
      for (const xmlI18string of xmlI18strings) {
        const identifier = this.tagAttribute(xmlI18string, 'name');
        const translation = xmlI18string.innerHTML;
        i18nNode.i18n.push({id: identifier, trans: translation});
      }
      importedI18ns.push(i18nNode);
    }
    return model.i18ns = importedI18ns;
  }

  checkVariability(model: Model, ind, refhrany) {
    let musimeHladat = true;

    for (const place of model.places) {
      if (place.id === refhrany) {
        musimeHladat = false;
        this.attachReference(model.arcs[ind], place);
        break;
      }
    }

    if (musimeHladat) {
      for (const variable of model.processData) {
        if (variable.id === refhrany) {
          this.attachReference(model.arcs[ind], variable);
          break;
        }
      }
    }
  }

  attachReference(arc: Arc, reference: Place | DataVariable) {
    const vaha = reference instanceof Place ? reference.marking : parseInt(reference.value, 10);

    if (isNaN(vaha)) {
      alert('Not a number. Cannot change the value of arc weight.');
    }
    if (vaha < 0) {
      alert('A negative number. Cannot change the value of arc weight.');
    }

    if (!isNaN(vaha) && vaha >= 0) {
      arc.vaha = vaha;
      let varname;
      let variableVal;

      if (reference instanceof Place) {
        variableVal = reference.label.replace(/\s/g, '');
        if (!variableVal.length) { variableVal = reference.id; }
      } else {
        variableVal = reference.name;
      }
      varname = parseInt(variableVal, 10);

      if (!isNaN(varname)) {
        arc.vahalabel = '"' + variableVal + '": ';
      } else {
        arc.vahalabel = variableVal;
      }

      if (reference instanceof Place) {
        arc.placeref = reference;
      } else {
        arc.dataref = reference;
      }
    }
  }

  tagValue(xmlTag, child) {
    if (xmlTag.getElementsByTagName(child).length === 0 || xmlTag.getElementsByTagName(child)[0].childNodes.length === 0) {
      return '';
    }
    const parentNodeName = xmlTag.nodeName === '#document' ? 'document' : xmlTag.nodeName;
    const tags: any = Array.from(xmlTag.getElementsByTagName(child)).filter(tag => (tag as any).parentNode.nodeName === parentNodeName);
    if (tags === undefined || tags.length === 0) {
      return '';
    }
    return tags[0].childNodes[0].nodeValue;
  }

  tagAttribute(xmlTag, attribute) {
    const attr = xmlTag.attributes[attribute];
    if (attr === undefined) {
      return '';
    }
    return attr.value;
  }

  parseActions(xmlTag) {
    const actionTags = xmlTag.getElementsByTagName('action');
    if (actionTags.length === 0) {
      return [];
    }

    const actions = [];
    for (let i = 0; i < actionTags.length; i++) {
      const actionTag = actionTags[i];
      const actionTrigger = actionTag.getAttribute('trigger');
      const actionId = actionTag.getAttribute('id');
      let actionDefinition = '';
      for (const node of actionTag.childNodes) {
        if (node.nodeName === '#comment') {
          actionDefinition += '<!--' + node.nodeValue + '-->';
        } else {
          actionDefinition += node.nodeValue;
        }
      }
      actions[i] = new Action(actionId, actionTrigger, actionDefinition);
    }
    return actions;
  }

  parseI18n(xmlTag, child) {
    // let i18n = new I18nString();
    //
    // i18n.value = tagValue(xmlTag, child);
    // if (i18n.value !== "") {
    //     i18n.name = xmlTag.getElementsByTagName(child)[0].getAttribute("name");
    // }

    // return i18n;
    return this.tagValue(xmlTag, child);
  }

  parseEncryption(xmlTag, child) {
    let encryption = this.tagValue(xmlTag, child) === 'true';
    if (encryption) {
      const algorithm = xmlTag.getElementsByTagName(child)[0].getAttribute('algorithm');
      if (algorithm !== undefined && algorithm !== '') {
        encryption = algorithm;
      }
    }
    return encryption;
  }

  parseDataRef(xmlDataRef) {
    const xmlDataRefLogic = xmlDataRef.getElementsByTagName('logic')[0];
    const dataRef = new DataRef(this.tagValue(xmlDataRef, 'id'));
    dataRef.logic.actions = this.parseActions(xmlDataRefLogic);
    const xmlDataRefLogicBehaviors = xmlDataRefLogic.getElementsByTagName('behavior');
    for (const logic of xmlDataRefLogicBehaviors) {
      dataRef.logic.behaviors.push(logic.childNodes[0].nodeValue);
    }
    const xmlLayout = xmlDataRef.getElementsByTagName('layout');
    if (xmlLayout.length !== 0) {
      const x = parseInt(this.tagValue(xmlLayout[0], 'x'), 10);
      const y = parseInt(this.tagValue(xmlLayout[0], 'y'), 10);
      const rows = parseInt(this.tagValue(xmlLayout[0], 'rows'), 10);
      const cols = parseInt(this.tagValue(xmlLayout[0], 'cols'), 10);
      const offset = parseInt(this.tagValue(xmlLayout[0], 'offset'), 10);
      const template = this.tagValue(xmlLayout[0], 'template');
      const appearance = this.tagValue(xmlLayout[0], 'appearance');
      dataRef.layout = {x, y, cols, rows, offset, template, appearance};
    }
    return dataRef;
  }

  correctMaxX(x) {
    return ImportService.correctMax(x, ModelerConfig.MAX_X);
  }

  correctMaxY(y) {
    return ImportService.correctMax(y, ModelerConfig.MAX_Y);
  }

  parseViewType(xmlTag: HTMLElement): DataView {
    const xmlViewTag = xmlTag.getElementsByTagName('view')[0];
    if (xmlViewTag === undefined || xmlViewTag.firstChild === null) {
      return null;
    }
    switch (xmlViewTag.firstChild.nodeName) {
      case 'autocomplete':
        return DataView.AUTOCOMPLETE;
      case 'tree':
        return DataView.TREE;
      case 'image':
        return DataView.IMAGE;
      case 'editor':
        return DataView.EDITOR;
      case 'list':
        return DataView.LIST;
      default:
        // TODO notify user about invalid XML structure
        return null;
    }
  }

  parsePoint(element): Point {
    let xx = parseInt(element.getElementsByTagName('x')[0].childNodes[0].nodeValue, 10);
    let yy = parseInt(element.getElementsByTagName('y')[0].childNodes[0].nodeValue, 10);
    xx = this.correctMaxX(xx);
    yy = this.correctMaxY(yy);
    return new Point(xx, yy);
  }
}
