import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ModelService} from '../model.service';
import {CanvasService} from '../canvas.service';
import {ImportService} from '../import.service';
import {GridsterService} from '../../form-builder/gridster/gridster.service';
import {Router} from '@angular/router';
import {Canvas} from '../classes/canvas';
import {ModelerConfig} from '../modeler-config';
import {DialogManageRolesComponent} from '../control-panel/dialogs/dialog.manage-roles/dialog.manage-roles.component';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ExportService} from '../export.service';
import {Model} from '../classes/model';
import {DialogTransitionSettingsComponent} from '../control-panel/dialogs/dialog-transition-settings/dialog-transition-settings.component';
import {MatTabGroup} from '@angular/material/tabs';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'nab-edit-mode',
  templateUrl: './edit-mode.component.html',
  styleUrls: ['./edit-mode.component.scss']
})
export class EditModeComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('ctxMenu') contextMenu: ElementRef;
  @Input() tabGroup: MatTabGroup;

  constructor(private modelService: ModelService, private canvasService: CanvasService, private importService: ImportService,
              private gService: GridsterService, private router: Router, public dialog: MatDialog,
              private _hotkeysService: HotkeysService, private exportService: ExportService) {
    this._hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.exportService.exportXml(this.modelService.model, 1);
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+u', (event: KeyboardEvent): boolean => {
      this.canvasService.undo();
      return false;
    }));
    this._hotkeysService.add(new Hotkey('del', (event: KeyboardEvent): boolean => {
      this.modelService.whichButton.next('delete');
      this.canvasService.reset();
      return false;
    }));
  }

  ngAfterViewInit() {
    this.canvasService.canvas = new Canvas(this.canvas.nativeElement);
    this.canvasService.canvas.resize(this.modelService.appwidth, this.modelService.appheight);

    // LEGACY PART
    ModelerConfig.VERTICAL_OFFSET = this.canvas.nativeElement.offsetTop;
    ModelerConfig.HORIZONTAL_OFFSET = this.canvas.nativeElement.offsetLeft;

    setTimeout(() => {
      if (this.modelService.model === undefined) {
        this.modelService.model = new Model();
      }
      this.canvasService.renderModel(this.modelService.model);
      this.reset('select');
    });
  }

  doMouseDown($event: MouseEvent) {
    this.canvasService.doMouseDown($event);
  }

  doMouseMove($event: MouseEvent) {
    this.canvasService.doMouseMove($event);
  }

  openFormBuilder() {
    this.closeContextMenu();
    this.gService.placedDataFields = [];
    this.router.navigate(['/form']);
    const id = localStorage.getItem('TransitionId');
    this.modelService.transition = this.modelService.model.transitions.find((item) => item.id === id);
  }

  editFormBuilder() {
    this.closeContextMenu();
    const id = localStorage.getItem('TransitionId');
    this.modelService.transition = this.modelService.model.transitions.find((item) => item.id === id);
    if (id === null) {
      // TODO implement failure branch
      console.log('chyba');
    } else {
      this.gService.placedDataFields = [...this.modelService.model.transitions.find((item) => item.id === id).data];
    }
    this.router.navigate(['/form']);
  }

  isEdit(): boolean {
    const id = localStorage.getItem('TransitionId');
    if (id === null) {
      return false;
    } else {
      try {
        return this.modelService.model.transitions.find((item) => item.id === id).data.length !== 0;
      } catch (e) {
        return false;
      }
    }
  }

  manageRoles() {
    this.closeContextMenu();
    const id = localStorage.getItem('TransitionId');
    if (id === null) {
      return false;
    } else {
      this.dialog.open(DialogManageRolesComponent, {
        width: '60%',
        data: {
          roles: this.modelService.model.roles,
          rolesRefs: this.modelService.model.transitions.find(item => item.id === id).roleRefs
        }
      });
    }
  }

  manageActions(): boolean {
    this.closeContextMenu();
    const id = localStorage.getItem('TransitionId');
    if (!id) {
      console.warn('No transition was selected! Aborting navigation to /modeler/actions');
      return false;
    } else {
      // console.log('Transition: ' + id);
      localStorage.setItem('ctxMenu', JSON.stringify({
        actionsMode: {
          transition: id
        }
      }));
      this.router.navigateByUrl('modeler/actions').then(r => null);
      return true;
    }
  }

  private closeContextMenu() {
    this.contextMenu.nativeElement.style.visibility = 'hidden';
  }

  reset(field: string) {
    this.modelService.whichButton.next(field);
    this.canvasService.reset();
  }

  openTaskConfigDialog() {
    this.closeContextMenu();
    const id = localStorage.getItem('TransitionId');
    if (id === null) {
      return false;
    } else {
      this.dialog.open(DialogTransitionSettingsComponent, {
        width: '60%'
      });
    }
  }
}
