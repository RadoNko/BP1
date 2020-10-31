import {Component, Input, OnInit} from '@angular/core';
import { TreeNode } from '../classes/leaf-node';
import {I18nModeService} from '../i18n-mode.service';

@Component({
  selector: 'nab-i18n-editor',
  templateUrl: './i18n-editor.component.html',
  styleUrls: ['./i18n-editor.component.scss']
})
export class I18nEditorComponent implements OnInit {
  @Input() public leafNode: TreeNode;

  constructor(private i18nModeService: I18nModeService) {
  }

  ngOnInit(): void {
  }



  getTranslation(index = -1) {
    if (this.i18nModeService.activeLocale.i18n
      .find(item => item.id === (index === -1 ? this.leafNode.identifier : this.leafNode.values[index].identifier)) !== undefined) {
      return this.i18nModeService.activeLocale.i18n
        .find(item => item.id === (index === -1 ? this.leafNode.identifier : this.leafNode.values[index].identifier)).trans;
    }
    return '';
  }

  setTranslation(e, index = -1) {
    if (e.target.value !== '') {
      if (this.i18nModeService.activeLocale.i18n
        .find(item => item.id === (index === -1 ? this.leafNode.identifier : this.leafNode.values[index].identifier)) === undefined) {
        this.i18nModeService.activeLocale.i18n.push({id: (index === -1 ? this.leafNode.identifier : this.leafNode.values[index].identifier), trans: e.target.value});
      } else {
        this.i18nModeService.activeLocale.i18n
          .find(item => item.id === (index === -1 ? this.leafNode.identifier : this.leafNode.values[index].identifier)).trans = e.target.value;
      }
    }
  }
}
