import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CanvasService} from '../canvas.service';
import {ExportService} from '../export.service';
import {ModelService} from '../model.service';
import {ImportService} from '../import.service';
import {Router} from '@angular/router';
import {ActionsModeService} from '../actions-mode/actions-mode.service';
import {I18nModeService} from '../i18n-mode/i18n-mode.service';
import {DialogAddLanguageComponent} from './dialogs/dialog-add-language/dialog-add-language.component';
import {I18nTranslations} from '../classes/i18n-translations';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'nab-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {
  @Input() nav: MatSidenav;
  @Output() importModel: EventEmitter<void>;

  whichButton: string;
  modeSelect;

  selectedDatas = 'dataVariable';

  constructor(private canvasService: CanvasService, private exportService: ExportService, private modelService: ModelService,
              private importService: ImportService, public dialog: MatDialog, private dialogAddLanguageComponent: MatDialog,
              private router: Router, private actionsModeService: ActionsModeService, private i18nModeService: I18nModeService) {
    this.importModel = new EventEmitter<void>();
    this.modelService.whichButton.subscribe(obj => this.whichButton = obj);
    this.router.events.subscribe(() => {
      if (this.router.url.includes('/modeler')) {
        if (this.router.url === '/modeler') {
          this.modeSelect = 'modeler';
        } else {
          this.modeSelect = this.router.url.substring(9);
        }
      }
    });
    this.actionsModeService.eventData.subscribe(eventData => {
      this.selectedDatas = eventData;
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (this.modelService.whichButton.getValue() === 'select') {
      this.sideNav();
    }
  }

  undo() {
    // TODO: use event sourcing
    // this.canvasService.undo();
  }

  openModel(event: any) {
    this.importService.openFile(event).then(model => {
      this.modelService.model = model;
      this.canvasService.renderModel(this.modelService.model);
      this.importModel.emit();
    });
  }

  exportAsXML(num: number) {
    this.exportService.exportXml(this.modelService.model, num);
  }

  exportAsSVG() {
    this.exportService.exportSvg(this.modelService.model, this.canvasService.canvas.svg);
  }

  clearModel() {
    this.canvasService.clearmodel();
  }

  setDimension() {
    this.canvasService.setDimension();
  }

  alignElements() {
    this.canvasService.alignElements();
  }

  propertiesM() {
    this.canvasService.propertiesM();
  }

  about() {
    this.canvasService.about();
  }

  reset(field: string) {
    this.modelService.whichButton.next(field);
    this.canvasService.reset();
  }

  isActive(button: string) {
    return this.modelService.whichButton.getValue() === button;
  }

  sideNav() {
    this.reset('select');
    this.canvasService.editSideNav = this.nav;
  }

  changeData(item: string) {
    this.selectedDatas = item;
    this.actionsModeService.eventData.next(item);
  }

  isActiveView(edit: string) {
    return edit === this.modeSelect;
  }

  isSelected(item: string) {
    return item === this.selectedDatas;
  }

  openAddLanguageDialog() {
    const dialogRef = this.dialogAddLanguageComponent.open(DialogAddLanguageComponent);

    dialogRef.afterClosed().subscribe(data => {
      if (!this.i18nModeService.activeLanguages.some(language => language.code === data)) {
        const tempName = this.i18nModeService.languageCodes.find(tempCode => tempCode.code === data).name;
        this.i18nModeService.activeLanguages.push({code: data, name: tempName});
        this.i18nModeService.language = data;
        this.modelService.model.i18ns.push(new I18nTranslations(data, []));
        this.i18nModeService.activeLocale = this.modelService.model.i18ns.find(i18nNode => i18nNode.locale === data);
      }
    });
  }

  setActiveLocale() {
    this.i18nModeService.activeLocale = this.modelService.model.i18ns.find(i18nNode => i18nNode.locale === this.i18nModeService.language);
  }
}
