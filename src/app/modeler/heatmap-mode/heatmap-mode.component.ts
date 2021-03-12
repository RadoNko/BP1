import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ModelService} from "../model.service";
import {HeatmapModeService} from "./heatmap-mode.service";
import {CanvasService} from "../canvas.service";
import {Canvas} from "../classes/canvas";
import {ModelerConfig} from "../modeler-config";
import {Model} from "../classes/model";
import {ElasticsearchService} from "./elasticsearch/elasticsearch.service";

@Component({
  selector: 'nab-heatmap-mode',
  templateUrl: './heatmap-mode.component.html',
  styleUrls: ['./heatmap-mode.component.scss']
})
export class HeatmapModeComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private modelService : ModelService, private heatService : HeatmapModeService, private canvasService : CanvasService,private es :ElasticsearchService) { }

  ngOnInit(): void {

  }

  doMouseMove($event: MouseEvent) {
    this.canvasService.doMouseDown($event);
  }

  doMouseDown($event: MouseEvent) {
    this.canvasService.doMouseDown($event);
  }

  ngAfterViewInit(): void {
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
    this.heatService.writeDataState();
  }


  private reset(field: string) {
    this.modelService.whichButton.next(field);
    this.canvasService.reset();
  }
}
