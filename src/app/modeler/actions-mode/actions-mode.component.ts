import {Component, OnInit, ViewChild} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {LeafNode, TreeNode} from '../action-editor/classes/leaf-node';
import {ActionChangedEvent} from '../action-editor/action-editor-list/action-editor-list.component';
import {ActionEditorTreeService} from '../action-editor/action-editor-tree.service';
import {DataVariable} from '../classes/data-variable';
import {Model} from '../classes/model';
import {ModelService} from '../model.service';
import {ActionsModeService} from './actions-mode.service';
import {Transition} from '../classes/transition';
import {ActionEditorService} from '../action-editor/action-editor.service';
import {ActionType, ChangeType} from '../action-editor/classes/editable-action';
import {timer} from 'rxjs';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MatSelectionListChange} from '@angular/material/list';

@Component({
  selector: 'nab-actions-mode',
  templateUrl: './actions-mode.component.html',
  styleUrls: ['./actions-mode.component.scss']
})
export class ActionsModeComponent implements OnInit {
  // LIST
  dataSourceList: DataVariable[] | Transition[];
  lengthList: number;
  pageSizeList: number;
  pageIndexList: number;
  pageSizeOptionsList: number[] = [10, 20, 50];
  dataArray: DataVariable[] | Transition[];
  selected: Transition | DataVariable;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // TREE
  public treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(private modelService: ModelService, private actionsModeService: ActionsModeService,
              private actionEditorService: ActionEditorService, private actionEditorTreeService: ActionEditorTreeService) {
    // MODEL
    setTimeout(() => {
      if (this.modelService.model === undefined) {
        this.modelService.model = new Model();
      }
      // DATA VARIABLES
      this.actionsModeService.eventData.subscribe(item => {
        this.pageSizeList = 20;
        this.pageIndexList = 0;
        if (item === 'dataVariable') {
          this.dataArray = [...this.modelService.model.processData];
          this.lengthList = this.dataArray.length;
          this.dataSourceList = [...this.modelService.model.processData.slice(0, this.pageSizeList)];
        } else if (item === 'transition') {
          this.dataArray = [...this.modelService.model.transitions];
          this.lengthList = this.dataArray.length;
          this.dataSourceList = [...this.modelService.model.transitions.slice(0, this.pageSizeList)];
        }
        this.sort.direction = '';
      });

      timer().subscribe(_ => {
        const fromCtxMenu = localStorage.getItem('ctxMenu');
        if (fromCtxMenu) {
          const obj = JSON.parse(fromCtxMenu);
          if (obj && obj.actionsMode && obj.actionsMode.transition) {
            this.actionsModeService.eventData.next('transition');
            timer(100).subscribe(__ => {
              let foundTransition;
              this.dataSourceList.forEach(item => {
                if (item instanceof Transition && item.id === obj.actionsMode.transition) {
                  foundTransition = item;
                }
              });
              if (foundTransition) {
                this.setData(foundTransition);
              }
            });
          }
          localStorage.removeItem('ctxMenu');
        }
      });
    });
  }

  ngOnInit(): void {
  }

  // LIST
  onPageChanged(e) {
    this.pageIndexList = e.pageIndex;
    this.pageSizeList = e.pageSize;
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    if (this.actionsModeService.eventData.getValue() === 'dataVariable') {
      this.dataSourceList = this.dataArray.slice(firstCut, secondCut);
    } else if (this.actionsModeService.eventData.getValue() === 'transition') {
      this.dataSourceList = this.dataArray.slice(firstCut, secondCut);
    }
  }

  setData(item: Transition | DataVariable) {
    this.selected = item;
    if (item instanceof Transition) {
      const transition = this.modelService.model.transitions.find(it => it.id === item.id);
      this.actionEditorService.populateEditedActionsFromTransition(transition);
      this.dataSource.data = this.actionEditorTreeService.createTransitionTreeStructure(this.actionEditorService.editedActions, (leaf: TreeNode, actionCount: number) => this.collapseParentCallback(leaf, actionCount));
    } else if (item instanceof DataVariable) {
      const dataVar = this.modelService.model.processData.find(it => it.id === item.id);
      this.actionEditorService.populateEditedActionsFromDataVariable(dataVar);
      const hiddenParent = {
        type: ActionType.DATA,
        actionCount: undefined, // attribute is required but the hiddenParent doesn't use it
        children: this.actionEditorTreeService.createDatafieldTreeStructure(this.actionEditorService.editedActions[0].editableActions, ActionType.DATA, (leaf: TreeNode, actionCount: number) => this.collapseParentCallback(leaf, actionCount))
      };
      hiddenParent.children.forEach(child => {
        child.parent = hiddenParent;
      });
      this.dataSource.data = hiddenParent.children;
    }
  }

  // TREE

  newAction(node: TreeNode): void {
    const newAction = (node.children[0] as LeafNode).addAction(node.type, node.id, node.transitionEvent);
    this.treeControl.expand(node);

    newAction.changeType = ChangeType.CREATED;
    this.actionEditorService.saveActionChange(newAction);
  }

  actionChangedListener(changeEvent: ActionChangedEvent, emittingNode: TreeNode): void {
    if (changeEvent.action.changeType === ChangeType.MOVED) {
      this.moveNodeInTree(changeEvent, emittingNode);
    }

    this.actionEditorService.saveActionChange(changeEvent.action);
  }

  moveNodeInTree(changeEvent: ActionChangedEvent, emittingNode: TreeNode): void {
    let node = emittingNode;
    // emitting node is the leaf node and thus we need to traverse up one extra node to reach the desired ancestor node
    for (let i = 0; i < changeEvent.triggerPath.length + 1; i++) {
      node = node.parent;
    }
    for (const key of changeEvent.triggerPath) {
      node = node.children.find(it => it.id === key);
    }
    // same as above, we need to dive one node deeper to reach our desired leaf
    node = node.children[0];

    if (node instanceof LeafNode) {
      node.pushAction(changeEvent.action);
    }
  }

  isInnerNode(_: number, node: TreeNode): boolean {
    return !!node.children && node.children.length > 0 && !node.canAdd;
  }

  isAddNode(_: number, node: TreeNode): boolean {
    return !!node.canAdd;
  }

  isLeafNode(_: number, node: TreeNode): boolean {
    return node instanceof LeafNode;
  }

  actionsExpandable(parentNode: TreeNode): boolean {
    const child = parentNode.children[0];
    return child instanceof LeafNode && child.hasDisplayableActions();
  }

  collapseParentCallback(leaf: TreeNode, actionCount: number) {
    if (actionCount === 0) {
      this.treeControl.collapse(leaf.parent);
    }
  }

  sortData(sort: Sort) {
    const firstCut = this.pageIndexList * this.pageSizeList;
    const secondCut = firstCut + this.pageSizeList;

    if (!sort.active || sort.direction === '') {
      if (this.actionsModeService.eventData.getValue() === 'dataVariable') {
        this.dataArray = [...this.modelService.model.processData];
        this.dataSourceList = this.dataArray.slice(firstCut, secondCut);
      } else if (this.actionsModeService.eventData.getValue() === 'transition') {
        this.dataArray = [...this.modelService.model.transitions];
        this.dataSourceList = this.dataArray.slice(firstCut, secondCut);
      }
      return;
    }

    this.dataArray.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareId(a.id, b.id, isAsc);
        case 'name':
          if (a.name === undefined) {
            return this.compare(a.label, b.label, isAsc);
          } else {
            return this.compare(a.name, b.name, isAsc);
          }
      }
    });
    this.dataSourceList = this.dataArray.slice(firstCut, secondCut);
  }

  selectionChanged(listChange: MatSelectionListChange) {
    listChange.source.selectedOptions.selected
      .filter(option => option.value.id !== listChange.option.value.id)
      .forEach(option => option.selected = false);
  }

  compareId(a: number | string, b: number | string, isAsc: boolean) {
    const parseda = parseInt(String(a), 10);
    const parsedb = parseInt(String(b), 10);
    if (isNaN(parseda) || isNaN(parsedb)) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    } else {
      return (parseda < parsedb ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
