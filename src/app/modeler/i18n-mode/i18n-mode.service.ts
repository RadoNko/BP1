import {EventEmitter, Injectable} from '@angular/core';
import {LeafNode, TreeNode} from './classes/leaf-node';
import {Model} from '../classes/model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as langCodes from '../../../assets/language_codes.json';

@Injectable({
  providedIn: 'root'
})
export class I18nModeService {

  event: EventEmitter<void>;

  language: any;
  activeLanguages: any[];
  activeLocale: any;
  activeSource: TreeNode[];

  languageCodes: any;

  treeSubscription = new Subject();

  refreshTree() {
    this.treeSubscription.next();
  }

  constructor(private http: HttpClient) {
    this.event = new EventEmitter();
    this.languageCodes = langCodes.codes;
  }

  loadLanguageCodes() {
    return this.http.get('assets/language_codes.json', {responseType: 'text'});
  }

  loadTranslation(model: Model) {
    this.importLanguages(model);
    this.language = undefined;
    this.importDataSource(model);
    this.refreshTree();
  }

  importDataSource(model: Model): void {
    this.activeSource = null;
    const document = this.importDocument(model);
    const transaction = this.importTransaction(model.transactions);
    const data = this.importData(model.processData);
    const role = this.importRole(model.roles);
    const transition = this.importTransition(model.transitions);

    this.activeSource = [];
    this.activeSource.push(document, transaction, data, role, transition);
  }

  importLanguages(model: Model): void {
    this.activeLanguages = [];
    for (const lang of model.i18ns) {
      const localeCode = lang.locale;
      const localeName = this.languageCodes.find(languageCode => languageCode.code === localeCode).name;
      this.activeLanguages.push({code: localeCode, name: localeName});
    }
  }

  importDocument(model: Model): TreeNode {
    const treeNode = this.createTopNode('Document');
    const childNodeTitle = this.createInnerNode('Title', 'doc_title', model.title);
    const childNodeCaseName = this.createInnerNode('Case name', 'doc_caseName', model.caseName);
    (treeNode as TreeNode).children.push(childNodeTitle, childNodeCaseName);
    return treeNode;
  }

  importTransaction(transactions): TreeNode {
    const treeNode = this.createTopNode('Transaction');
    for (const transaction of transactions) {
      const transactionChild = this.getTitleNodes(transaction, 'transaction');
      (treeNode as TreeNode).children.push(transactionChild);
    }
    return treeNode;
  }

  importData(processData): TreeNode {
    const treeNode = this.createTopNode('Data');
    for (const data of processData) {
      const dataChild = this.createTopNode(data.id);
      const prefix = 'data_' + (dataChild as TreeNode).treeNodeName;
      const titleChild = this.createInnerNode('Title', prefix + '_title', data.name);
      const placeholderChild = this.createInnerNode('Placeholder', prefix + '_placeholder', data.placeholder);
      const descChild = this.createInnerNode('Desc', prefix + '_desc', data.desc);
      (dataChild as TreeNode).children.push(titleChild, placeholderChild, descChild);
      if (data.type === 'enumeration' || data.type === 'multichoice') {
        const valuesChild = new LeafNode();
        (valuesChild as TreeNode).treeNodeName = 'Values';
        (valuesChild as TreeNode).identifier = 'values';
        (valuesChild as TreeNode).values = [];
        for (const value of data.values) {
          (valuesChild as TreeNode).values.push({identifier: prefix + '_values_' + value.key, original: value.value});
        }
        (dataChild as TreeNode).children.push(valuesChild);
      }
      (treeNode as TreeNode).children.push(dataChild);
    }
    return treeNode;
  }

  importRole(roles): TreeNode {
    const treeNode = this.createTopNode('Role');
    for (const role of roles) {
      const roleChild = this.getTitleNodes(role, 'role');
      (treeNode as TreeNode).children.push(roleChild);
    }
    return treeNode;
  }

  importTransition(transitions): TreeNode {
    const treeNode = this.createTopNode('Transition');
    for (const transition of transitions) {
      const transitionChild = this.createTopNode(transition.id);
      const prefix = 'transition_' + (transitionChild as TreeNode).treeNodeName;
      const labelChild = this.createInnerNode('Label', prefix + '_label', transition.label);
      const eventNode = this.createTopNode('Event');
      for (const eventPart of transition.events) {
        const eventChild = this.createTopNode(eventPart.id);
        const eventTitleChild = this.createInnerNode('Title', prefix + '_event_' + (eventChild as TreeNode).treeNodeName + '_title', eventPart.title);
        const eventMessageChild = this.createInnerNode('Message', prefix + '_event_' + (eventChild as TreeNode).treeNodeName + '_message', eventPart.message);
        (eventChild as TreeNode).children.push(eventTitleChild, eventMessageChild);
        (eventNode as TreeNode).children.push(eventChild);
      }
      const dataGroupNode = this.createTopNode('DataGroup');
      for (const dataGroupPart of transition.dataGroups) {
        const dataGroupChild = this.createTopNode(dataGroupPart.id);
        const dataGroupTitleChild = this.createInnerNode('Title', prefix + '_dataGroup_' + (dataGroupChild as TreeNode).treeNodeName + '_title', dataGroupPart.title);
        (dataGroupChild as TreeNode).children.push(dataGroupTitleChild);
        (dataGroupNode as TreeNode).children.push(dataGroupChild);
      }
      (transitionChild as TreeNode).children.push(labelChild, eventNode, dataGroupNode);
      (treeNode as TreeNode).children.push(transitionChild);
    }
    return treeNode;
  }

  private createTopNode(nodeName: string): TreeNode {
    const treeNode = new LeafNode();
    (treeNode as TreeNode).treeNodeName = nodeName;
    (treeNode as TreeNode).children = [];
    return treeNode;
  }

  private createInnerNode(treeNodeName: string, identifier: string, original: string): TreeNode {
    const treeNode = new LeafNode();
    (treeNode as TreeNode).treeNodeName = treeNodeName;
    (treeNode as TreeNode).identifier = identifier;
    (treeNode as TreeNode).original = original;
    return treeNode;
  }

  private getTitleNodes(part: any, identifierPrefix: string): TreeNode {
    const child = new LeafNode();
    (child as TreeNode).treeNodeName = part.id;
    (child as TreeNode).children = [];
    const titleChild = this.createInnerNode('Title', identifierPrefix + '_' + (child as TreeNode).treeNodeName + '_title', part.title);
    (child as TreeNode).children.push(titleChild);
    return child;
  }
}
