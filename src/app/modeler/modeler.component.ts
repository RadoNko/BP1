import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ModelService} from './model.service';
import {CanvasService} from './canvas.service';
import {Model} from './classes/model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ExportService} from './export.service';
import {Router} from '@angular/router';
import {SimulationModeService} from './simulation-mode/simulation-mode.service';
import {DataModeService} from './data-mode/data-mode.service';
import {RoleModeService} from './role-mode/role-mode.service';
import {ActionsModeService} from './actions-mode/actions-mode.service';
import {ResizeEvent} from 'angular-resizable-element';
import {MatDialog} from '@angular/material/dialog';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'nab-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss']
})
export class ModelerComponent implements AfterViewInit {
  selectedIndex = 0;
  width: number;

  @ViewChild('tabs') tabGroup: MatTabGroup;

  constructor(private modelService: ModelService, private canvasService: CanvasService, private router: Router,
              private simulService: SimulationModeService, private dataService: DataModeService, private roleService: RoleModeService,
              private actionsModeService: ActionsModeService, public dialog: MatDialog, private exportService: ExportService,
              private _hotkeysService: HotkeysService) {
    if (!this.modelService.model) {
      this.modelService.model = new Model();
    }

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
    this._hotkeysService.add(new Hotkey('shift+tab', (event: KeyboardEvent): boolean => {
      if (this.tabGroup.selectedIndex === this.tabGroup._tabs.length - 1) {
        this.tabGroup.selectedIndex = 0;
      } else {
        this.tabGroup.selectedIndex += 1;
      }
      return false;
    }));
  }

  ngAfterViewInit() {
  }

  reset(field: string) {
    this.modelService.whichButton.next(field);
    this.canvasService.reset();
  }

  onResizeEvent(event: ResizeEvent): void {
    if (event.rectangle.width > 450) {
      this.width = 450;
    } else if (event.rectangle.width < 200) {
      this.width = 200;
    } else {
      this.width = event.rectangle.width;
    }
  }
}
