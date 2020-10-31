/* tslint:disable:variable-name */
import {Injectable} from '@angular/core';
import {Point} from './classes/point';
import {Model} from './classes/model';
import {ExportService, XmlFormat} from './export.service';
import {ImportService} from './import.service';
import {ModelerConfig} from './modeler-config';
import {BehaviorSubject} from 'rxjs';
import {Place} from './classes/place';
import {Transition} from './classes/transition';
import {Arc} from './classes/arc';
@Injectable({
  providedIn: 'root'
})
export class ModelService {

  application;
  previousStatus;
  originFile;
  hranabymove;
  bod: Point;
  kresli_sa_hrana: number;
  source_hrany;
  pocetmousedown: number;
  sirkatextu: number;
  fontfamily: string;
  korekcia: number;
  vahaoffset: number;
  posuva_sa_hrana: number;
  pocetmousedownposuv: number;
  pocetmousedownposuvtran: number;
  pocetmousedownposuvplace: number;

  posuvanahrana: Arc;
  indexbodu: any;
  hybesaprechod: number;
  hybesamiesto: number;
  movedprechod: Transition;
  movedmiesto: Place;

  text: string;
  menofilu: string;
  appwidth: number;
  appheight: number;

  id: number;
  model: Model;
  transition: Transition;
  transitionOffset: number;
  whichButton: BehaviorSubject<string>;

  constructor(private exportService: ExportService, private importService: ImportService) {
    this.bod = new Point(0, 0);
    this.kresli_sa_hrana = 0;
    this.pocetmousedown = 0;
    this.sirkatextu = 0;
    this.fontfamily = 'verdana';
    this.korekcia = 0.75 * ModelerConfig.FONT_SIZE;
    this.vahaoffset = 10;
    this.posuva_sa_hrana = 0;
    this.pocetmousedownposuv = 0;
    this.pocetmousedownposuvtran = 0;
    this.pocetmousedownposuvplace = 0;
    this.hybesaprechod = 0;
    this.hybesamiesto = 0;

    this.text = '';
    this.menofilu = 'newmodel.xml';
    this.appwidth = 10000;
    this.appheight = 5000;
    ModelerConfig.GRID_STEP = 2 * ModelerConfig.COORDINATES_OFFSET;
    ModelerConfig.MAX_X = ModelerConfig.MAX_WIDTH - ModelerConfig.COORDINATES_OFFSET;
    ModelerConfig.MAX_Y = ModelerConfig.MAX_HEIGHT - ModelerConfig.COORDINATES_OFFSET;

    this.whichButton = new BehaviorSubject('select');
    this.id = 0;
    this.transitionOffset = 0;
  }

  getVariableIndexByID(dataId: number): number {
    for (let i = 0; i < this.model.processData.length; i++) {
      if (this.model.processData[i].id === dataId) {
        return i;
      }
    }
    return -1;
  }

  updatePreviousState() {
    this.previousStatus = this.exportService.generateXml(this.model, XmlFormat.Petriflow);
  }

  nextId(): number {
    this.id++;
    return this.id;
  }

  resetId(): void {
    this.id = 0;
  }
}
