import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ModelService} from '../model.service';
import {CanvasService} from '../canvas.service';
import {Canvas} from '../classes/canvas';
import {ModelerConfig} from '../modeler-config';
import {SimulationModeService} from './simulation-mode.service';
import {Model} from '../classes/model';

@Component({
  selector: 'nab-simulation-mode',
  templateUrl: './simulation-mode.component.html',
  styleUrls: ['./simulation-mode.component.scss']
})
export class SimulationModeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;

  constructor(private modelService: ModelService, private canvasService: CanvasService, private simulService: SimulationModeService) {
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
      this.simulService.modelClone();
      this.canvasService.renderModel(this.modelService.model);
      this.reset('fire');
    });
  }

  ngOnDestroy(): void {
    this.simulService.modelOnDestroy();
  }

  doMouseDown($event: MouseEvent) {
    this.canvasService.doMouseDown($event);
  }

  doMouseMove($event: MouseEvent) {
    this.canvasService.doMouseMove($event);
  }

  reset(field: string) {
    this.modelService.whichButton.next(field);
    this.canvasService.reset();
  }
}
