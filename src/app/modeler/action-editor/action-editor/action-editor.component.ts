import {Component, Input} from '@angular/core';
import {ChangeType, EditableAction} from '../classes/editable-action';
import {ActionEditorService} from '../action-editor.service';

@Component({
  selector: 'nab-action-editor',
  templateUrl: './action-editor.component.html',
  styleUrls: ['./action-editor.component.scss']
})
export class ActionEditorComponent {
  @Input() name: string;
  // covalent code editor component source: https://github.com/Teradata/covalent/blob/develop/src/platform/code-editor/code-editor.component.ts

  @Input() public action: EditableAction;

  // options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
  editorOptions = {
    theme: 'vs',
    language: 'java',
    scrollBeyondLastLine: false,
    automaticLayout: true
  };

  constructor(private actionEditorService: ActionEditorService) {
  }

  onDefinitionChange(): void {
    this.action.changeType = ChangeType.EDITED;
    this.actionEditorService.saveActionChange(this.action);
  }

  // monarch playground: https://microsoft.github.io/monaco-editor/monarch.html
  // monaco playground: https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

}
