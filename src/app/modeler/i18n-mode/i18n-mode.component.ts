import { Component, OnDestroy, OnInit} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import {ModelService} from '../model.service';
import {Model} from '../classes/model';
import {I18nModeService} from './i18n-mode.service';
import {TreeNode} from './classes/leaf-node';
import {TreeChildInterface, eventSubscriber} from './classes/tree-child.interface';
import {MatTreeNestedDataSource} from '@angular/material/tree';

@Component({
  selector: 'nab-i18n-mode',
  templateUrl: './i18n-mode.component.html',
  styleUrls: ['./i18n-mode.component.scss']
})
export class I18nModeComponent implements OnInit, TreeChildInterface, OnDestroy {

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(private modelService: ModelService, private i18nModeService: I18nModeService) {
    this.updateTree = this.updateTree.bind(this);
    eventSubscriber(i18nModeService.treeSubscription, this.updateTree);
    setTimeout(() => {
      if (this.modelService.model === undefined) {
        this.modelService.model = new Model();
      }
      this.i18nModeService.importLanguages(this.modelService.model);
      this.i18nModeService.language = undefined;
      this.i18nModeService.importDataSource(this.modelService.model);
      this.dataSource.data = this.i18nModeService.activeSource;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    eventSubscriber(this.i18nModeService.treeSubscription, this.updateTree, true);
  }

  updateTree() {
    this.dataSource.data = this.i18nModeService.activeSource;
  }

  hasChild(_: number, node: TreeNode) {
    return node.identifier === undefined;
  }
}
