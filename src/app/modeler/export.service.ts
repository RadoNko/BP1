import {Injectable} from '@angular/core';
import {I18nString} from './classes/i18n-string';
import {Model} from './classes/model';
import {AssignPolicy, FinishPolicy} from './classes/transition';
import {DataRef} from './classes/data-ref';

export enum XmlFormat {
  Petriflow = 1,
  Pflow = 2,
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private xmlText: string;
  private downloadLink: HTMLAnchorElement;

  constructor() {
  }

  exportXml(model: Model, format: XmlFormat) {
    const xmlText = this.generateXml(model, format);
    let fileName;
    if (format === XmlFormat.Petriflow) {
      fileName = prompt('Please enter the file name', model.fileName);
    }
    if (format === XmlFormat.Pflow) {
      fileName = prompt('Please enter the file name', model.fileName + '.pflow');
    }

    if (fileName != null) {
      model.fileName = fileName;
      let xmlBlob = null;
      if (window.Blob) {
        xmlBlob = new Blob([xmlText], {type: 'text/plain;charset=utf-8'});
      }

      if (xmlBlob != null) {
        if (window.navigator.msSaveBlob !== undefined) {
          window.navigator.msSaveBlob(xmlBlob, model.fileName);
        } else {
          this.downloadLink = document.createElement('a');
          this.downloadLink.download = model.fileName;
          this.downloadLink.innerHTML = 'Download Model' + model.fileName;
          if (window.webkitURL !== undefined) {
            this.downloadLink.href = window.webkitURL.createObjectURL(xmlBlob);
          } else {
            if (window.URL.createObjectURL !== undefined) {
              this.downloadLink.href = window.URL.createObjectURL(xmlBlob);
              this.downloadLink.onclick = this.closeOnClick;
              this.downloadLink.style.display = 'none';
              document.body.appendChild(this.downloadLink);
            }
          }
          this.downloadLink.click();
        }
        // document.getElementById('menofilu').innerHTML = model.fileName;
      }
    }
  }

  exportSvg(model: Model, svg) {
    const prevodnik = new XMLSerializer();
    const textnazapis = prevodnik.serializeToString(svg);
    const menosuboru = prompt('Please enter the file name', model.fileName + '.svg');
    if (menosuboru != null) {
      let xmlakoBlob = null;
      if (window.Blob) {
        xmlakoBlob = new Blob([textnazapis], {type: 'text/plain;charset=utf-8'});
      }

      if (xmlakoBlob != null) {
        if (window.navigator.msSaveBlob !== undefined) {
          window.navigator.msSaveBlob(xmlakoBlob, menosuboru);
        } else {
          this.downloadLink = document.createElement('a');
          this.downloadLink.download = menosuboru;
          this.downloadLink.innerHTML = 'Download Model' + menosuboru;
          if (window.webkitURL !== undefined) {
            this.downloadLink.href = window.webkitURL.createObjectURL(xmlakoBlob);
          } else {
            if (window.URL.createObjectURL !== undefined) {
              this.downloadLink.href = window.URL.createObjectURL(xmlakoBlob);
              this.downloadLink.onclick = this.closeOnClick;
              this.downloadLink.style.display = 'none';
              document.body.appendChild(this.downloadLink);
            }
          }
          this.downloadLink.click();
        }
      }
    }
  }

  generateXml(model: Model, format: XmlFormat) {
    this.xmlText = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<document xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"' + '>\n';
    if (format === 2) {
      this.complexStart(0, 'subnet');
    }

    this.exportDocument(model);
    this.exportTransactions(model);
    this.exportRoles(model);
    this.exportData(model);
    this.exportI18n(model);
    this.exportTransitions(model);
    this.exportPlaces(model, format);
    this.exportArcs(model);

    if (format === 2) {
      this.complexEnd(0, 'subnet');
    }
    this.complexEnd(0, 'document');
    return this.xmlText;
  }

  private exportDocument(model: Model) {
    if (model.id === undefined || model.id === '') {
      this.appendIfPresent(1, 'id', 'new_model');
    } else {
      this.appendIfPresent(1, 'id', model.id);
    }
    this.appendIfPresent(1, 'version', model.version);
    if (model.initials === undefined || model.initials === '') {
      this.appendIfPresent(1, 'initials', 'NEW');
    } else {
      this.appendIfPresent(1, 'initials', model.initials);
    }
    if (model.title === undefined || model.title === '') {
      this.appendIfPresent(1, 'title', 'New Model');
    } else {
      this.appendIfPresent(1, 'title', model.title);
    }
    this.appendIfPresent(1, 'icon', model.icon);
    this.appendIfPresent(1, 'defaultRole', model.defaultRole);
    this.appendIfPresent(1, 'transitionRole', model.transitionRole);
    this.appendIfPresent(1, 'caseName', model.caseName);
  }

  private exportTransactions(model: Model) {
    this.comment(1, 'transactions');
    for (const item of model.transactions) {
      this.complexStart(1, 'transaction');
      this.append(2, 'id', item.id);
      this.append(2, 'title', item.title);
      this.complexEnd(1, 'transaction');
    }
  }

  private exportRoles(model: Model) {
    this.comment(1, 'roles');
    for (const item of model.roles) {
      this.complexStart(1, 'role');
      this.append(2, 'id', item.id);
      this.append(2, 'title', item.title);
      this.complexEnd(1, 'role');
    }
  }

  private exportData(model: Model) {
    this.comment(1, 'data');
    for (const dataVariable of model.processData) {
      this.xmlText = this.xmlText + '\t<data type=\"' + dataVariable.type + '\"';
      if (dataVariable.immediate !== '') {
        this.xmlText = this.xmlText + ' immediate=\"' + dataVariable.immediate + '\"';
      }
      this.xmlText = this.xmlText + '>\n';
      this.append(2, 'id', dataVariable.id);
      this.append(2, 'title', dataVariable.name);
      this.appendIfPresent(2, 'placeholder', dataVariable.placeholder);
      this.appendIfPresent(2, 'desc', dataVariable.desc);
      for (const item of dataVariable.values) {
        this.append(2, 'values', item);
      }
      if (dataVariable.view) {
        this.complexStart(2, 'view');
        this.space(3);
        this.xmlText = this.xmlText + '<' + dataVariable.view + '/>\n';
        this.complexEnd(2, 'view');
      }
      this.appendIfPresent(2, 'valid', dataVariable.valid);
      if (dataVariable.validations !== undefined && dataVariable.validations.length) {
        this.complexStart(2, 'validations');
        dataVariable.validations.forEach(item => {
          if (item.expression !== '') {
            this.complexStart(3, 'validation');
            this.append(4, 'expression', item.expression);
            this.append(4, 'message', item.message);
            this.complexEnd(3, 'validation');
          }
        });
        this.complexEnd(2, 'validations');
      }
      if (dataVariable.value) {
        this.appendIfPresent(2, 'init', dataVariable.value);
      } else {
        this.appendIfPresent(2, 'init', dataVariable.init);
      }
      if (dataVariable.encryption !== undefined && dataVariable.encryption !== false) {
        this.xmlText += '\t\t' + dataVariable.getEncryption();
      }
      for (const action of dataVariable.actions) {
        this.xmlText += '\t\t' + action.toXml();
      }
      // TODO: actionRefs
      // for (var j = 0; j < dataVariable.values.length; j++) {}
      if (dataVariable.remote) {
        this.xmlText += '\t\t<remote/>\n';
      }
      this.xmlText = this.xmlText + '\t</data>\n';
    }
  }

  exportTransitions(model: Model) {
    this.comment(1, 'transitions');
    for (const transition of model.transitions) {
      this.complexStart(1, 'transition');
      this.append(2, 'id', transition.id);
      this.append(2, 'x', transition.x);
      this.append(2, 'y', transition.y);
      this.complexStart(2, 'layout');
      if (transition.cols !== undefined) {
        this.append(3, 'cols', transition.cols);
      }
      this.append(3, 'offset', transition.offset);
      this.complexEnd(2, 'layout');
      this.append(2, 'label', transition.label);
      this.appendIfPresent(2, 'icon', transition.icon);
      this.appendIfPresent(2, 'priority', transition.priority);
      if (transition.assignPolicy !== AssignPolicy.manual) {
        this.appendIfPresent(2, 'assignPolicy', transition.assignPolicy);
      }
      this.appendIfPresent(2, 'dataFocusPolicy', transition.dataFocusPolicy);
      if (transition.finishPolicy !== FinishPolicy.manual) {
        this.appendIfPresent(2, 'finishPolicy', transition.finishPolicy);
      }
      for (const trigger of transition.triggers) {
        if (trigger.type === 'auto') {
          this.xmlText += '\t\t<trigger type=\"auto\"/>\n';
        } else if (trigger.type === 'user') {
          this.xmlText += '\t\t<trigger type=\"user\"/>\n';
        } else {
          this.xmlText += '\t\t<trigger type=\"' + trigger.type + '\">\n';
          if (trigger.delay !== undefined && trigger.delay !== 0) {
            this.xmlText += '\t\t\t<delay>' + trigger.delay + '</delay>\n';
          }
          if (trigger.exact !== undefined) {
            this.xmlText += '\t\t\t<exact>' + trigger.exact + '</exact>\n';
          }
          this.xmlText += '\t\t</trigger>\n';
        }
      }
      for (const roleRef of transition.roleRefs) {
        this.complexStart(2, 'roleRef');
        this.append(3, 'id', roleRef.id);
        this.complexStart(3, 'logic');
        if (roleRef.logic.perform) {
          this.append(4, 'perform', 'true');
        }
        if (roleRef.logic.delegate) {
          this.append(4, 'delegate', 'true');
        }
        if (roleRef.logic.view) {
          this.append(4, 'view', 'true');
        }
        this.complexEnd(3, 'logic');
        this.complexEnd(2, 'roleRef');
      }
      // KUBO FIX FOR NEW LAYOUT
      this.complexStart(2, 'dataGroup');
      this.append(3, 'id', 'initialDataGroup');
      this.append(3, 'layout', 'grid');
      for (const dataRef of transition.dataRefs) {
        this.appendDataRef(3, dataRef);
      }
      this.complexEnd(2, 'dataGroup');

      for (const dataGroup of transition.dataGroups) {
        this.complexStart(2, 'dataGroup');
        this.append(3, 'id', dataGroup.id);
        this.appendIfPresent(3, 'title', dataGroup.title);
        this.appendIfPresent(3, 'alignment', dataGroup.alignment);
        this.appendIfPresent(3, 'stretch', dataGroup.stretch);
        for (const dataRef of dataGroup.dataRefs) {
          this.appendDataRef(3, dataRef);
        }
        this.complexEnd(2, 'dataGroup');
      }
      for (const event of transition.events) {
        this.complexStart(2, 'event', {type: event.type});
        this.append(3, 'id', event.id);
        if (event.preactions.length > 0) {
          this.complexStart(3, 'actions', {phase: 'pre'});
          for (const preaction of event.preactions) {
            this.xmlText += '\t\t\t\t' + preaction.toXml();
          }
          this.complexEnd(3, 'actions');
        }
        if (event.postactions.length > 0) {
          this.complexStart(3, 'actions', {phase: 'post'});
          for (const postaction of event.postactions) {
            this.xmlText += '\t\t\t\t' + postaction.toXml();
          }
          this.complexEnd(3, 'actions');
        }
        this.complexEnd(2, 'event');
      }
      this.complexEnd(1, 'transition');
    }
  }

  private exportArcs(model: Model) {
    this.comment(1, 'arcs');
    for (const arc of model.arcs) {
      this.complexStart(1, 'arc');
      this.append(2, 'id', arc.id);
      if (arc.arctype === 'variable') {
        arc.arctype = 'regular';
        let musimeHladat = true;

        for (const place of model.places) {
          if (place.id === String(arc.vaha)) {
            musimeHladat = false;
            arc.placeref = place;
            break;
          }
        }
        if (musimeHladat) {
          for (const variable of model.processData) {
            if (variable.id === String(arc.vaha)) {
              musimeHladat = false;
              arc.dataref = variable;
              break;
            }
          }
        }
        if (!musimeHladat) {
          arc.arctype = 'regular';
        }
      }
      this.append(2, 'type', arc.arctype);
      this.append(2, 'sourceId', arc.source.id);
      this.append(2, 'destinationId', arc.target.id);
      if (arc.placeref) {
        this.append(2, 'multiplicity', arc.placeref.marking);
        this.append(2, 'reference', arc.placeref.id);
      } else if (arc.dataref) {
        this.append(2, 'multiplicity', arc.dataref.value);
        this.append(2, 'reference', arc.dataref.id);
      } else {
        this.append(2, 'multiplicity', arc.vaha);
      }
      if (arc.bodyhrany !== undefined) {
        for (let j = 1; j < arc.bodyhrany.length - 1; j++) {
          this.xmlText = this.xmlText + '\t\t<breakPoint><x>' + arc.bodyhrany[j].x + '</x><y>' + arc.bodyhrany[j].y + '</y></breakPoint>\n';
        }
      }
      this.complexEnd(1, 'arc');
    }
  }

  private exportPlaces(model: Model, format: XmlFormat) {
    this.comment(1, 'places');
    for (const place of model.places) {
      this.complexStart(1, 'place');
      this.append(2, 'id', place.id);
      this.append(2, 'x', place.x);
      this.append(2, 'y', place.y);
      this.append(2, 'label', place.label);
      this.append(2, 'tokens', place.marking);
      if (format === 1) {
        this.append(2, 'static', place.static);
      }
      if (format === 2) {
        this.append(2, 'isStatice', place.static);
      }
      this.complexEnd(1, 'place');
    }
  }

  private exportI18n(model: Model) {
    this.comment(1, 'i18ns');
    for (const i18n of model.i18ns) {
      this.complexStart(1, 'i18n', {locale: i18n.locale});
      for (const i18nChild of i18n.i18n) {
        this.xmlText += '\t\t<i18nString name="' + i18nChild.id + '">' + i18nChild.trans + '</i18nString>\n';
      }
      this.complexEnd(1, 'i18n');
    }
  }

  append(level, tagName, tagValue) {
    if (tagValue instanceof I18nString) {
      this.space(level);
      this.xmlText += tagValue.toXml(tagName);
    } else {
      this.simpleStart(level, tagName);
      this.xmlText += tagValue;
      this.simpleEnd(tagName);
    }
  }

  appendIfPresent(level, tagName, tagValue) {
    if (tagValue === undefined || tagValue === '') {
      return;
    }
    // if (tagValue instanceof I18nString) {
    //     if (tagValue.value === undefined || tagValue.value === '') {
    //         return;
    //     }
    // }
    this.append(level, tagName, tagValue);
  }

  simpleStart(level, tagName) {
    this.space(level);
    this.xmlText += '<' + tagName + '>';
  }

  complexStart(level, tagName, attributess?) {
    this.space(level);
    this.xmlText += '<' + tagName;
    if (attributess !== undefined) {
      Object.entries(attributess).forEach(key => {
        this.xmlText += ' ' + key[0] + '=\"' + key[1] + '\"';
      });
    }
    this.xmlText += '>\n';
  }

  complexEnd(level, tagName) {
    this.space(level);
    this.xmlText += '</' + tagName + '>\n';
  }

  simpleEnd(tagName) {
    this.xmlText += '</' + tagName + '>\n';
  }

  comment(level, content) {
    this.space(level);
    this.xmlText += '<!-- ' + content.toUpperCase() + ' -->\n';
  }

  space(level) {
    for (let i = 0; i < level; i++) {
      this.xmlText = this.xmlText + '\t';
    }
  }

  appendDataRef(level, dataRef: DataRef) {
    this.complexStart(level, 'dataRef');
    this.append(level + 1, 'id', dataRef.id);
    this.complexStart(level + 1, 'logic');
    for (const behavior of dataRef.logic.behaviors) {
      this.append(level + 2, 'behavior', behavior);
    }
    for (const action of dataRef.logic.actions) {
      for (let x = 0; x < level + 2; x++) {
        this.xmlText += '\t';
      }
      this.xmlText += action.toXml();
    }
    // TODO: actionRef
    this.complexEnd(level + 1, 'logic');
    if (dataRef.layout !== undefined) {
      this.complexStart(level + 1, 'layout');
      this.append(level + 2, 'x', dataRef.layout.x);
      this.append(level + 2, 'y', dataRef.layout.y);
      this.append(level + 2, 'rows', dataRef.layout.rows);
      this.append(level + 2, 'cols', dataRef.layout.cols);
      this.append(level + 2, 'offset', dataRef.layout.offset);
      if (dataRef.layout.template !== undefined) {
        this.append(level + 2, 'template', dataRef.layout.template);
      }
      if (dataRef.layout.appearance !== undefined) {
        this.append(level + 2, 'appearance', dataRef.layout.appearance);
      }
      this.complexEnd(level + 1, 'layout');
    }
    this.complexEnd(level, 'dataRef');
  }

  closeOnClick(event) {
    document.body.removeChild(event.target);
  }
}
