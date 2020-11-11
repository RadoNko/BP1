import {Injectable} from '@angular/core';
import {ModelService} from './model.service';
import {ObjectArcMove} from './classes/object-arc-move';
import {ObjectArc} from './classes/object-arc';
import {Point} from './classes/point';
import {ObjectPlace} from './classes/object-place';
import {Arc} from './classes/arc';
import {ObjectElement} from './classes/object-element';
import {Transition} from './classes/transition';
import {Place} from './classes/place';
import {ImportService} from './import.service';
import {ModelerConfig} from './modeler-config';
import {Model} from './classes/model';
import {BehaviorSubject} from 'rxjs';
import {Canvas} from './classes/canvas';
import {DialogArcAttachComponent} from './control-panel/dialogs/dialog-arc-attach/dialog-arc-attach.component';
import {DataVariable} from './classes/data-variable';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  public static svgNamespace = 'http://www.w3.org/2000/svg';
  selectedTransition: BehaviorSubject<Transition>;
  private _editSideNav: MatSidenav;
  private fireModes: string[] = ['fire', 'fire-task'];
  canvas: Canvas;
  hranaForPlaceref: Arc;
  hranaForPlacerefClicked = false;

  constructor(private modelService: ModelService, public dialog: MatDialog) {
    this.selectedTransition = new BehaviorSubject<Transition>(new Transition(0, 0, ''));
  }

  renderModel(model: Model) {
    this.deleteAll();
    model.transitions.forEach(t => {
      this.renderTransition(t);
      const intId = parseInt(t.id, 10);
      if (!isNaN(intId) && this.modelService.id < intId) {
        this.modelService.id = intId;
      }
    });
    model.places.forEach(place => {
      this.renderPlace(place);
      const intId = parseInt(place.id, 10);
      if (!isNaN(intId) && this.modelService.id <= intId) {
        this.modelService.id = intId;
      }
    });
    model.arcs.forEach(arc => {
      this.renderArc(arc);
      const intId = parseInt(arc.id, 10);
      if (!isNaN(intId) && this.modelService.id < intId) {
        this.modelService.id = intId;
      }
    });
    this.elementypredhrany(model);
    this.labelypredhranyprve(model);
    model.transitions.filter(t => t.icon !== undefined && t.icon.length > 0).forEach(t => {
      this.renderIcon(t);
    });
  }

  private renderArc(arc: Arc) {
    arc.objektyhrany = this.novy_svg_arc(arc, arc.bodyhrany[0], arc.bodyhrany[1]);
    if (arc.placeref) {
      if (arc.placeref.marking !== arc.vaha) {
        this.updatePlaceRefVahuHrany();
      }
      arc.objektyhrany.vaha.nodeValue = `${arc.placeref.label === '' ? '""' : arc.placeref.label} ${'(' + arc.vaha + ')'}`;
    } else if (arc.dataref) {
      if (arc.dataref.value !== arc.vaha) {
        this.updateDataRefVahuHrany();
      }
      arc.objektyhrany.vaha.nodeValue = `${arc.dataref.name === '' ? '""' : arc.dataref.name} ${'(' + arc.vaha + ')'}`;
    } else {
      arc.objektyhrany.vaha.nodeValue = arc.vahalabel;
    }
    this.updatehranusvg(arc);
  }

  private renderTransition(t: Transition) {
    t.objektyelementu = this.novy_svg_transition(t, t.x, t.y, t.velkost);
    t.objektyelementu.meno.nodeValue = t.label;
  }

  private renderPlace(place: Place) {
    place.objektymiesta = this.novy_svg_place(place, place.x, place.y, place.polomer);
    place.objektymiesta.meno.nodeValue = place.label;
    this.updatetokeny(place);
  }

  elementypredhrany(model: Model) {
    for (const place of model.places) {
      this.canvas.add(place.objektymiesta.element);
      place.deactivate();
      for (const markToken of place.markingtokens) {
        this.canvas.add(markToken);
      }
      place.objektymiesta.svgmarking.appendChild(place.objektymiesta.markingnode);
      this.canvas.add(place.objektymiesta.svgmarking);
    }
    this.updatemarkings();
    for (const transition of model.transitions) {
      this.canvas.add(transition.objektyelementu.element);
      transition.deactivate();
    }
  }

  novy_svg_temp_arc( zaciatok, koniec, arctype) {
    const dx = koniec.x - zaciatok.x;
    const dy = koniec.y - zaciatok.y;
    const dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    const dlzkaskratena = dlzkahrany - ModelerConfig.ARROW_HEAD_SIZE + 2;
    const pomer = dlzkaskratena / dlzkahrany;
    const nx = zaciatok.x + dx * pomer;
    const ny = zaciatok.y + dy * pomer;

    const polyciara = document.createElementNS(CanvasService.svgNamespace, 'polyline');

    polyciara.setAttributeNS(null, 'points', zaciatok.x + ',' + zaciatok.y + ' ' + nx + ',' + ny);
    polyciara.setAttributeNS(null, 'fill', 'none');
    polyciara.setAttributeNS(null, 'stroke-width', '2');
    polyciara.setAttributeNS(null, 'class', 'svg-active-stroke');

    this.canvas.add(polyciara);

    let sipka;
    if (arctype === 'inhibitor') {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'circle');
      sipka.setAttributeNS(null, 'cx', String(this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).x));
      sipka.setAttributeNS(null, 'cy', String(this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).y));
      sipka.setAttributeNS(null, 'r', `${ModelerConfig.ARROW_HEAD_SIZE / 2}`);
      sipka.setAttributeNS(null, 'class', 'svg-active-stroke svg-invisible-fill');
      sipka.setAttributeNS(null, 'stroke-width', '2');
    } else if (arctype === 'read') {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'circle');
      sipka.setAttributeNS(null, 'cx', String(this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).x));
      sipka.setAttributeNS(null, 'cy', String(this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).y));
      sipka.setAttributeNS(null, 'r', `${ModelerConfig.ARROW_HEAD_SIZE / 2}`);
      sipka.setAttributeNS(null, 'class', 'svg-active-stroke svg-active-fill');
      sipka.setAttributeNS(null, 'stroke-width', '2');
    } else {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'polygon');
      sipka.setAttributeNS(null, 'points', this.bodySipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y, arctype));
      sipka.setAttributeNS(null, 'class', 'svg-active-fill svg-active-stroke');
    }

    this.canvas.add(sipka);

    return new ObjectArcMove(polyciara, sipka, arctype);
  }

  novy_svg_arc(arc: Arc, zaciatok, koniec) {
    const dx = koniec.x - zaciatok.x;
    const dy = koniec.y - zaciatok.y;
    const dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    const dlzkaskratena = dlzkahrany - ModelerConfig.ARROW_HEAD_SIZE + 2;
    const pomer = dlzkaskratena / dlzkahrany;
    const nx = zaciatok.x + dx * pomer;
    const ny = zaciatok.y + dy * pomer;

    const polyciarapod = document.createElementNS(CanvasService.svgNamespace, 'polyline') as HTMLElement;

    polyciarapod.setAttributeNS(null, 'points', zaciatok.x + ',' + zaciatok.y + ' ' + nx + ',' + ny);
    polyciarapod.setAttributeNS(null, 'fill', 'none');
    polyciarapod.setAttributeNS(null, 'stroke-width', '4');
    polyciarapod.setAttributeNS(null, 'stroke', 'white');

    this.canvas.add(polyciarapod);
    const polyciara = document.createElementNS(CanvasService.svgNamespace, 'polyline') as HTMLElement;

    polyciara.setAttributeNS(null, 'points', zaciatok.x + ',' + zaciatok.y + ' ' + nx + ',' + ny);
    polyciara.setAttributeNS(null, 'fill', 'none');
    polyciara.setAttributeNS(null, 'stroke-width', '2');

    this.canvas.add(polyciara);
    let sipka;
    if (arc.arctype === 'inhibitor') {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'circle') as HTMLElement;

      sipka.setAttributeNS(null, 'cx', this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).x);
      sipka.setAttributeNS(null, 'cy', this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).y);
      sipka.setAttributeNS(null, 'r', `${ModelerConfig.ARROW_HEAD_SIZE / 2}`);
      sipka.setAttributeNS(null, 'fill', 'white');
      sipka.setAttributeNS(null, 'class', 'svg-inactive-stroke');
      sipka.setAttributeNS(null, 'stroke-width', '2');
    } else if (arc.arctype === 'read') {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'circle') as HTMLElement;

      sipka.setAttributeNS(null, 'cx', this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).x);
      sipka.setAttributeNS(null, 'cy', this.bodInhibitorSipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y).y);
      sipka.setAttributeNS(null, 'r', `${ModelerConfig.ARROW_HEAD_SIZE / 2}`);
      sipka.setAttributeNS(null, 'fill', 'black');
      sipka.setAttributeNS(null, 'class', 'svg-inactive-stroke');
      sipka.setAttributeNS(null, 'stroke-width', '2');
    } else {
      sipka = document.createElementNS(CanvasService.svgNamespace, 'polygon') as HTMLElement;
      sipka.setAttributeNS(null, 'points', this.bodySipky(zaciatok.x, zaciatok.y, koniec.x, koniec.y, arc.arctype));
      sipka.setAttributeNS(null, 'class', 'svg-inactive-stroke');
      sipka.setAttributeNS(null, 'stroke', 'black');
    }

    this.canvas.add(sipka);

    const vahaelem = document.createElementNS(CanvasService.svgNamespace, 'text') as HTMLElement;
    const bodvaha = this.bodvahy(zaciatok, koniec);
    vahaelem.setAttributeNS(null, 'x', String(bodvaha.x));
    vahaelem.setAttributeNS(null, 'y', String(bodvaha.y));
    vahaelem.setAttributeNS(null, 'font-size', ModelerConfig.FONT_SIZE.toString());
    vahaelem.setAttributeNS(null, 'font-family', this.modelService.fontfamily);
    const vaha = document.createTextNode(arc.vahalabel);
    vahaelem.appendChild(vaha);
    this.canvas.add(vahaelem);

    vahaelem.setAttributeNS(null, 'x', `${bodvaha.x - this.modelService.vahaoffset / 3}`);
    vahaelem.setAttributeNS(null, 'y', `${bodvaha.y + this.modelService.vahaoffset / 2}`);

    polyciarapod.onmouseover = polyciara.onmouseover = sipka.onmouseover = vahaelem.onmouseover = () => {
      if (!this.isFireMode()) {
        arc.activate();
      }
    };
    polyciarapod.onmouseout = polyciara.onmouseout = sipka.onmouseout = vahaelem.onmouseout = () => {
      if (!this.isFireMode() && !(this.hranaForPlaceref && this.hranaForPlaceref.id === arc.id)) {
        arc.deactivate();
      }
    };
    polyciarapod.onmousedown = polyciara.onmousedown = (event) => {
      this.mysdownnahrane(event, arc, polyciarapod, polyciara, sipka, vaha, vahaelem);
    };

    sipka.onmousedown = () => {
      if (this.modelService.whichButton.getValue() === 'delete') {
        this.canvas.remove(polyciarapod);
        this.canvas.remove(polyciara);
        this.canvas.remove(sipka);
        vahaelem.removeChild(vaha);
        this.canvas.remove(vahaelem);

        const i = this.modelService.model.arcs.indexOf(arc);
        this.modelService.model.arcs.splice(i, 1);
      }
    };

    vahaelem.onmousedown = () => {
      if (this.modelService.whichButton.getValue() === 'arc_weight' && (arc.arctype !== 'reset')) {

        let arcVaha = arc.vaha;
        const zadane = prompt('Please enter positive arc weight', arc.vaha);

        if (zadane != null) {
          arcVaha = parseInt(zadane, 10);

          if (isNaN(arcVaha)) {
            alert('Not a number');
          }
          if (arcVaha <= 0) {
            alert('Not positive number');
          }
          if (!isNaN(arcVaha) && arcVaha > 0) {
            arc.vaha = arcVaha;
            arc.dataref = false;
            if (arcVaha === 1) {
              arc.vahalabel = '';
            } else {
              arc.vahalabel = arcVaha;
            }
            arcVaha.nodeValue = arc.vahalabel;
          }
        }
      }
    };

    return new ObjectArc(polyciarapod, polyciara, sipka, vahaelem, vaha);
  }

  mysdownnahrane(event, element, svgelement, svgelement1, svgelement2, labelnode, svgMeno) {

    if (this.modelService.whichButton.getValue() === 'delete') {
      const novyBod = new Point(0, 0);

      novyBod.x = this.getMousePositionX(event);
      novyBod.y = this.getMousePositionY(event);

      let deletujembod = 0;

      for (let i = 1; i < element.bodyhrany.length - 1; i++) {
        if (Math.abs(element.bodyhrany[i].x - novyBod.x) <= 5 && Math.abs(element.bodyhrany[i].y - novyBod.y) <= 5) {
          element.bodyhrany.splice(i, 1);
          this.updatehranusvg(element);
          deletujembod = 1;
          break;
        }
      }

      if (deletujembod === 0) {
        this.canvas.remove(svgelement);
        this.canvas.remove(svgelement1);
        this.canvas.remove(svgelement2);
        svgMeno.removeChild(labelnode);
        this.canvas.remove(svgMeno);

        const i = this.modelService.model.arcs.indexOf(element);
        this.modelService.model.arcs.splice(i, 1);
      }
    }


    if (this.modelService.whichButton.getValue() === 'position') {
      const novyBod = new Point(0, 0);

      novyBod.x = this.getMousePositionX(event);
      novyBod.y = this.getMousePositionY(event);

      for (let i = 1; i < element.bodyhrany.length - 1; i++) {
        if (Math.abs(element.bodyhrany[i].x - novyBod.x) <= 5 && Math.abs(element.bodyhrany[i].y - novyBod.y) <= 5) {
          this.modelService.indexbodu = i;
          let doit = false;
          let novex = element.bodyhrany[i].x;
          let novey = element.bodyhrany[i].y;
          const a = prompt('Please enter x-coordinate of the point (not smaller than ' + ModelerConfig.COORDINATES_OFFSET +
            ' and not greater than ' + ModelerConfig.MAX_X + ' ):', element.bodyhrany[i].x);
          if (a != null) {
            const x = parseInt(a, 10);
            if (isNaN(x)) {
              alert('x is not a number');
            } else {
              if (x <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_X <= x) {
                alert('x is out of dimension');
              } else {
                novex = x;
                doit = true;
              }
            }
          }
          const b = prompt('Please enter y-coordinate of the point (not smaller than ' + ModelerConfig.COORDINATES_OFFSET +
            ' and not greater than ' + ModelerConfig.MAX_Y + ' ):', element.bodyhrany[i].y);
          if (b != null) {
            const y = parseInt(b, 10);
            if (isNaN(y)) {
              alert('y is not a number');
            } else {
              if (y <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_Y <= y) {
                alert('y is out of dimension');
              } else {
                novey = y;
                doit = true;
              }
            }
          }
          if (doit) {
            element.bodyhrany[i].x = novex;
            element.bodyhrany[i].y = novey;
            this.updatehranusvg(element);
          }
          break;
        }
      }
    }

    if (this.modelService.whichButton.getValue() === 'move') {
      if (this.modelService.posuva_sa_hrana === 0) {
        const novyBod = new Point(0, 0);

        novyBod.x = this.getMousePositionX(event);
        novyBod.y = this.getMousePositionY(event);

        for (let i = 1; i < element.bodyhrany.length - 1; i++) {
          if (Math.abs(element.bodyhrany[i].x - novyBod.x) <= 5 && Math.abs(element.bodyhrany[i].y - novyBod.y) <= 5) {
            this.modelService.indexbodu = i;
            this.modelService.posuvanahrana = element;
            this.modelService.posuva_sa_hrana = 1;
            this.updatehranusvg(element);
            break;
          }
        }

        if (this.modelService.posuva_sa_hrana === 0) {
          for (let i = 0; i < element.bodyhrany.length - 1; i++) {
            const dx = element.bodyhrany[i + 1].x - element.bodyhrany[i].x;
            const dy = element.bodyhrany[i + 1].y - element.bodyhrany[i].y;
            const dxn = novyBod.x - element.bodyhrany[i].x;
            const dyn = novyBod.y - element.bodyhrany[i].y;
            const dlzkahrany = Math.sqrt(dx * dx + dy * dy);
            const dlzkapomys = Math.sqrt(dxn * dxn + dyn * dyn);
            const pomer = dlzkapomys / dlzkahrany;
            const nx = element.bodyhrany[i].x + dx * pomer;
            const ny = element.bodyhrany[i].y + dy * pomer;

            if (Math.abs(nx - novyBod.x) <= 2 && Math.abs(ny - novyBod.y) <= 2) {
              element.bodyhrany.splice(i + 1, 0, novyBod);
              this.modelService.indexbodu = i + 1;
              this.modelService.posuvanahrana = element;
              this.modelService.posuva_sa_hrana = 1;
              this.updatehranusvg(element);
              break;
            }
          }
        }
      }
    }

    if (this.modelService.whichButton.getValue() === 'arc_weight' && (element.arctype !== 'reset')) {
      let vaha = element.vaha;
      const zadane = prompt('Please enter positive arc weight', element.vaha);

      if (zadane != null) {
        vaha = parseInt(zadane, 10);
        if (isNaN(vaha)) {
          alert('Not a number');
        }

        if (vaha <= 0) {
          alert('Not positive number');
        }

        if (!isNaN(vaha) && vaha > 0) {
          element.vaha = vaha;
          element.dataref = false;
          if (vaha === 1) {
            element.vahalabel = '';
          } else {
            element.vahalabel = vaha;
          }
          labelnode.nodeValue = element.vahalabel;
        }
      }
    }

    if (this.modelService.whichButton.getValue() === 'arc_dataref' && (element.arctype !== 'reset')) {
      this.openAttachDialog(element);
    }

    if (this.modelService.whichButton.getValue() === 'arc_placeref' && (element.arctype !== 'reset')) {
      this.hranaForPlacerefClicked = true;
      this.deletePlaceReferenceData(element.id);
      if (this.hranaForPlaceref !== undefined) {
        this.hranaForPlaceref.deactivate();
      }
      this.hranaForPlaceref = element;
      element.activate();
    }
  }

  skrathranu(element) {
    const i = element.bodyhrany.length - 2;
    const dx = element.bodyhrany[i + 1].x - element.bodyhrany[i].x;
    const dy = element.bodyhrany[i + 1].y - element.bodyhrany[i].y;
    const dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    const dlzkaskratena = dlzkahrany - ModelerConfig.ARROW_HEAD_SIZE + 2;
    const pomer = dlzkaskratena / dlzkahrany;
    const nx = element.bodyhrany[i].x + dx * pomer;
    const ny = element.bodyhrany[i].y + dy * pomer;

    return new Point(nx, ny);
  }

  updatehranusvg(hrana) {
    let text = '';
    const last = hrana.bodyhrany.length - 1;
    const stred = parseInt(String(last / 2), 10);

    if (hrana.bodyhrany.length > 2) {
      hrana.bodyhrany[0] = Arc.zaciatok_hrany(hrana.source, hrana.bodyhrany[1]);
      hrana.bodyhrany[last] = Arc.koniec_hrany(hrana.bodyhrany[last - 1], hrana.target);
    } else {
      hrana.bodyhrany[0] = Arc.zaciatok_hrany(hrana.source, hrana.target);
      hrana.bodyhrany[last] = Arc.koniec_hrany(hrana.source, hrana.target);
    }

    const bodvaha = this.bodvahy(hrana.bodyhrany[stred], hrana.bodyhrany[stred + 1]);
    for (let i = 0; i < hrana.bodyhrany.length - 1; i++) {
      text = text + hrana.bodyhrany[i].x + ',' + hrana.bodyhrany[i].y + ' ';
    }

    const skratenykoniec = this.skrathranu(hrana);
    text = text + skratenykoniec.x + ',' + skratenykoniec.y;

    if (this.modelService.posuva_sa_hrana === 1) {
      hrana.activate();
    } else {
      hrana.deactivate();
    }
    hrana.objektyhrany.polyciarapod.setAttributeNS(null, 'points', text);
    hrana.objektyhrany.polyciara.setAttributeNS(null, 'points', text);

    if (hrana.arctype === 'inhibitor' || hrana.arctype === 'read') {
      hrana.objektyhrany.sipka.setAttributeNS(null, 'cx', this.bodInhibitorSipky(hrana.bodyhrany[last - 1].x,
        hrana.bodyhrany[last - 1].y, hrana.bodyhrany[last].x, hrana.bodyhrany[last].y).x);
      hrana.objektyhrany.sipka.setAttributeNS(null, 'cy', this.bodInhibitorSipky(hrana.bodyhrany[last - 1].x,
        hrana.bodyhrany[last - 1].y, hrana.bodyhrany[last].x, hrana.bodyhrany[last].y).y);
    } else {
      hrana.objektyhrany.sipka.setAttributeNS(null, 'points', this.bodySipky(hrana.bodyhrany[last - 1].x,
        hrana.bodyhrany[last - 1].y, hrana.bodyhrany[last].x, hrana.bodyhrany[last].y, hrana.arctype));
    }

    hrana.objektyhrany.vahaelem.setAttributeNS(null, 'x', `${bodvaha.x - this.modelService.vahaoffset / 3}`);
    hrana.objektyhrany.vahaelem.setAttributeNS(null, 'y', `${bodvaha.y + this.modelService.vahaoffset / 2}`);
  }

  bodvahy(startbod, endbod) {
    const startPointX = startbod.x;
    const startPointY = startbod.y;
    const endPointX = endbod.x;
    const endPointY = endbod.y;

    const dx = (endPointX - startPointX) / 2;
    const dy = (endPointY - startPointY) / 2;

    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;
    let x;
    let y;

    if (dx >= 0 && dy >= 0) {
      x = (endPointX - dx + unitDy * this.modelService.vahaoffset);
      y = (endPointY - dy - unitDx * this.modelService.vahaoffset);
    }
    if (dx >= 0 && dy < 0) {
      x = (endPointX - dx - unitDy * this.modelService.vahaoffset);
      y = (endPointY - dy + unitDx * this.modelService.vahaoffset);
    }
    if (dx < 0 && dy > 0) {
      x = (endPointX - dx + unitDy * this.modelService.vahaoffset);
      y = (endPointY - dy - unitDx * this.modelService.vahaoffset);
    }
    if (dx < 0 && dy <= 0) {
      x = (endPointX - dx - unitDy * this.modelService.vahaoffset);
      y = (endPointY - dy + unitDx * this.modelService.vahaoffset);
    }

    return new Point(x, y);
  }

  bodInhibitorSipky(startPointX, startPointY, endPointX, endPointY) {
    const dx = endPointX - startPointX;
    const dy = endPointY - startPointY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;

    const inhibitorPointX = (endPointX - unitDx * ModelerConfig.ARROW_HEAD_SIZE / 2);
    const inhibitorPointY = (endPointY - unitDy * ModelerConfig.ARROW_HEAD_SIZE / 2);

    return new Point(inhibitorPointX, inhibitorPointY);
  }

  bodySipky(startPointX, startPointY, endPointX, endPointY, arctype) {
    const dx = endPointX - startPointX;
    const dy = endPointY - startPointY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;

    const arrowPoint1X = (endPointX - unitDx * ModelerConfig.ARROW_HEAD_SIZE - 0.5 * unitDy * ModelerConfig.ARROW_HEAD_SIZE);
    const arrowPoint1Y = (endPointY - unitDy * ModelerConfig.ARROW_HEAD_SIZE + 0.5 * unitDx * ModelerConfig.ARROW_HEAD_SIZE);

    const arrowPoint2X = (endPointX - unitDx * ModelerConfig.ARROW_HEAD_SIZE + 0.5 * unitDy * ModelerConfig.ARROW_HEAD_SIZE);
    const arrowPoint2Y = (endPointY - unitDy * ModelerConfig.ARROW_HEAD_SIZE - 0.5 * unitDx * ModelerConfig.ARROW_HEAD_SIZE);

    if (arctype === 'reset') {
      const arrowPoint3X = (endPointX - unitDx * ModelerConfig.ARROW_HEAD_SIZE);
      const arrowPoint3Y = (endPointY - unitDy * ModelerConfig.ARROW_HEAD_SIZE);
      const arrowPoint4X = (arrowPoint3X - unitDx * ModelerConfig.ARROW_HEAD_SIZE - 0.5 * unitDy * ModelerConfig.ARROW_HEAD_SIZE);
      const arrowPoint4Y = (arrowPoint3Y - unitDy * ModelerConfig.ARROW_HEAD_SIZE + 0.5 * unitDx * ModelerConfig.ARROW_HEAD_SIZE);

      const arrowPoint5X = (arrowPoint3X - unitDx * ModelerConfig.ARROW_HEAD_SIZE + 0.5 * unitDy * ModelerConfig.ARROW_HEAD_SIZE);
      const arrowPoint5Y = (arrowPoint3Y - unitDy * ModelerConfig.ARROW_HEAD_SIZE - 0.5 * unitDx * ModelerConfig.ARROW_HEAD_SIZE);

      return (endPointX + ',' + endPointY + ' ' + arrowPoint1X + ',' + arrowPoint1Y + ' ' + arrowPoint3X + ',' + arrowPoint3Y + ' ' +
        arrowPoint4X + ',' + arrowPoint4Y + ' ' + arrowPoint5X + ',' + arrowPoint5Y + ' ' + arrowPoint3X + ',' + arrowPoint3Y + ' ' +
        arrowPoint2X + ',' + arrowPoint2Y + ' ');

    }

    return (endPointX + ',' + endPointY + ' ' + arrowPoint1X + ',' + arrowPoint1Y + ' ' + arrowPoint2X + ',' + arrowPoint2Y + ' ');
  }

  reset() {
    this.reset_hranu();
    for (const transition of this.modelService.model.transitions) {
      if (this.isFireMode()) {
        if (transition.firing) {
          this.cancel(transition);
          this.updatemarkings();
        }
        if (this.enabled(transition)) {
          transition.enable();
        } else {
          transition.disable();
        }
      } else {
        transition.deactivate();
      }
    }
  }

  reset_hranu() {
    if (this.modelService.posuva_sa_hrana === 1) {
      this.modelService.posuvanahrana.deactivate();
      this.modelService.pocetmousedownposuv = 0;
      this.modelService.posuva_sa_hrana = 0;
    }
    if (this.modelService.kresli_sa_hrana === 1) {
      this.canvas.remove(this.modelService.hranabymove.polyciara);
      this.canvas.remove(this.modelService.hranabymove.sipka);

      this.modelService.pocetmousedown = 0;
      this.modelService.kresli_sa_hrana = 0;
    }
  }

  labelypredhranyprve(model: Model) {
    for (const item of model.places) {
      this.canvas.add(item.objektymiesta.zamenom);
      this.canvas.add(item.objektymiesta.menoelem);

      this.modelService.sirkatextu = item.objektymiesta.menoelem.getComputedTextLength();
      item.objektymiesta.zamenom.setAttributeNS(null, 'x', item.x - this.modelService.sirkatextu / 2);
      item.objektymiesta.zamenom.setAttributeNS(null, 'width', this.modelService.sirkatextu);
      item.objektymiesta.menoelem.setAttributeNS(null, 'x', item.x - this.modelService.sirkatextu / 2);

    }
    for (const item of model.transitions) {
      this.canvas.add(item.objektyelementu.zamenom);
      this.canvas.add(item.objektyelementu.menoelem);

      this.modelService.sirkatextu = item.objektyelementu.menoelem.getComputedTextLength();

      item.objektyelementu.zamenom.setAttributeNS(null, 'x', item.x - this.modelService.sirkatextu / 2);
      item.objektyelementu.zamenom.setAttributeNS(null, 'width', this.modelService.sirkatextu);
      item.objektyelementu.menoelem.setAttributeNS(null, 'x', item.x - this.modelService.sirkatextu / 2);
    }
  }


  /**
   * PLACE
   */

  updatemarkings() {
    for (const item of this.modelService.model.places) {
      this.updatetokeny(item);
    }
  }

  updatetokeny(place) {
    if (place.marking >= 0 && place.marking <= 9) {
      place.markinglabel = '';
    } else {
      place.markinglabel = place.marking;
    }

    for (let i = 0; i < 9; i++) {
      place.markingtokens[i].setAttributeNS(null, 'fill', Place.layouts[place.marking] !== undefined ? (Place.layouts[place.marking][i] === 1 ? 'black' : 'white') : 'white');
    }

    place.objektymiesta.markingnode.nodeValue = place.markinglabel;
    this.modelService.sirkatextu = place.objektymiesta.svgmarking.getComputedTextLength();
    place.objektymiesta.svgmarking.setAttributeNS(null, 'x', place.x - this.modelService.sirkatextu / 2);
  }

  novy_svg_place(place: Place, x, y, polomer) {
    const svgelement = document.createElementNS(CanvasService.svgNamespace, 'circle') as HTMLElement;

    svgelement.setAttributeNS(null, 'cx', x);
    svgelement.setAttributeNS(null, 'cy', y);
    svgelement.setAttributeNS(null, 'r', polomer);
    place.deactivate();
    this.canvas.add(svgelement);

    this.tokeny(place);

    const svgzamenom = document.createElementNS(CanvasService.svgNamespace, 'rect') as HTMLElement;

    svgzamenom.setAttributeNS(null, 'x', x);
    svgzamenom.setAttributeNS(null, 'y', String(y + polomer + ModelerConfig.FONTSIZE_OFFSET - this.modelService.korekcia));
    svgzamenom.setAttributeNS(null, 'width', String(0));
    svgzamenom.setAttributeNS(null, 'height', String(ModelerConfig.FONT_SIZE));
    svgzamenom.setAttributeNS(null, 'fill-opacity', '0.7');
    svgzamenom.setAttributeNS(null, 'fill', 'white');
    this.canvas.add(svgzamenom);

    const svgmeno = (document.createElementNS(CanvasService.svgNamespace, 'text') as unknown) as SVGTextContentElement;
    svgmeno.setAttributeNS(null, 'x', x);
    svgmeno.setAttributeNS(null, 'y', y + polomer + ModelerConfig.FONTSIZE_OFFSET);
    svgmeno.setAttributeNS(null, 'font-size', String(ModelerConfig.FONT_SIZE));
    svgmeno.setAttributeNS(null, 'font-family', this.modelService.fontfamily);

    const labelnode = document.createTextNode(!place.label ? '#' + place.id : place.label);
    svgmeno.appendChild(labelnode);
    this.canvas.add(svgmeno);
    this.modelService.sirkatextu = svgmeno.getComputedTextLength();

    svgzamenom.setAttributeNS(null, 'x', String(x - this.modelService.sirkatextu / 2));
    svgmeno.setAttributeNS(null, 'x', String(x - this.modelService.sirkatextu / 2));

    const svgmarking = (document.createElementNS(CanvasService.svgNamespace, 'text') as unknown) as SVGTextContentElement;
    svgmarking.setAttributeNS(null, 'x', x);
    svgmarking.setAttributeNS(null, 'y', y + ModelerConfig.FONT_SIZE / 2);
    svgmarking.setAttributeNS(null, 'font-size', String(ModelerConfig.FONT_SIZE));
    svgmarking.setAttributeNS(null, 'font-family', this.modelService.fontfamily);

    const markingnode = document.createTextNode(place.markinglabel);
    svgmarking.appendChild(markingnode);
    this.canvas.add(svgmarking);
    this.modelService.sirkatextu = svgmarking.getComputedTextLength();

    svgmarking.setAttributeNS(null, 'x', String(x - this.modelService.sirkatextu / 2));

    svgelement.onmouseover = svgmarking.onmouseover = svgmeno.onmouseover = () => {
      if (!this.isFireMode()) {
        place.activate();
      }
    };
    svgelement.onmouseout = svgmarking.onmouseout = svgmeno.onmouseout = () => {
      if (!this.isFireMode()) {
        place.deactivate();
      }
    };
    svgelement.onmousedown = svgmarking.onmousedown = () => {
      this.onplacedown(place, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom);
    };

    for (const markToken of place.markingtokens) {
      // @ts-ignore
      markToken.onmouseover = () => {
        if (!this.isFireMode()) {
          place.activate();
        }
      };
      // @ts-ignore
      markToken.onmouseout = () => {
        if (!this.isFireMode()) {
          place.deactivate();
        }
      };
      // @ts-ignore
      markToken.onmousedown = () => {
        this.onplacedown(place, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom);
      };
    }
    svgmeno.onmousedown = () => {
      if (this.modelService.whichButton.getValue() === 'label') {
        const label = prompt('Please enter place label', place.label);
        if (label != null) {
          place.label = label;
          labelnode.nodeValue = place.label;
          this.modelService.sirkatextu = svgmeno.getComputedTextLength();
          svgzamenom.setAttributeNS(null, 'x', String(place.x - this.modelService.sirkatextu / 2));
          svgzamenom.setAttributeNS(null, 'width', String(this.modelService.sirkatextu));
          svgmeno.setAttributeNS(null, 'x', String(place.x - this.modelService.sirkatextu / 2));
        }
      }
    };

    return new ObjectPlace(svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom);
  }

  onplacedown(element, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom) {
    if (this.modelService.whichButton.getValue() === 'delete') {
      this.modelService.updatePreviousState();
      for (let i = 0; i < this.modelService.model.arcs.length; i++) {
        if (element === this.modelService.model.arcs[i].source || element === this.modelService.model.arcs[i].target) {
          this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.polyciarapod);
          this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.polyciara);
          this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.sipka);
          this.modelService.model.arcs[i].objektyhrany.vahaelem.removeChild(this.modelService.model.arcs[i].objektyhrany.vaha);
          this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.vahaelem);
          this.modelService.model.arcs.splice(i, 1);
          i--;
        }
      }

      this.canvas.remove(svgelement);
      this.canvas.remove(svgzamenom);
      svgmeno.removeChild(labelnode);
      this.canvas.remove(svgmeno);
      for (const token of element.markingtokens) {
        this.canvas.remove(token);
      }
      svgmarking.removeChild(markingnode);
      this.canvas.remove(svgmarking);

      const j = this.modelService.model.places.indexOf(element);
      this.modelService.model.places.splice(j, 1);
    }

    if (this.modelService.whichButton.getValue() === 'arc') {
      if (this.modelService.kresli_sa_hrana === 0) {
        this.modelService.source_hrany = element;
        this.modelService.kresli_sa_hrana = 1;
        this.modelService.bod.x = element.x + ModelerConfig.ARROW_HEAD_SIZE; // event.pageX - canvas.getBoundingClientRect().left;
        this.modelService.bod.y = element.y; // event.pageY - canvas.getBoundingClientRect().top;
        this.modelService.hranabymove = this.novy_svg_temp_arc(element, this.modelService.bod, 'regular');
      } else {
        if (this.modelService.source_hrany.type !== element.type) {
          const actual = this.modelService.model.arcs.length;
          this.modelService.model.arcs[actual] = new Arc(this.modelService.source_hrany, element, 'regular', String(this.modelService.nextId()));
          this.renderArc(this.modelService.model.arcs[actual]);
          this.elementypredhrany(this.modelService.model);
          this.labelypredhranyprve(this.modelService.model);
        }
      }
    }

    if (this.modelService.whichButton.getValue() === 'resetarc') {
      if (this.modelService.kresli_sa_hrana === 0) {
        this.modelService.source_hrany = element;
        this.modelService.kresli_sa_hrana = 1;
        this.modelService.bod.x = element.x + ModelerConfig.ARROW_HEAD_SIZE; // event.pageX - canvas.getBoundingClientRect().left;
        this.modelService.bod.y = element.y; // event.pageY - canvas.getBoundingClientRect().top;
        this.modelService.hranabymove = this.novy_svg_temp_arc(element, this.modelService.bod, 'reset');
      }
    }

    if (this.modelService.whichButton.getValue() === 'inhibitorarc') {
      if (this.modelService.kresli_sa_hrana === 0) {
        this.modelService.source_hrany = element;
        this.modelService.kresli_sa_hrana = 1;
        this.modelService.bod.x = element.x + ModelerConfig.ARROW_HEAD_SIZE; // event.pageX - canvas.getBoundingClientRect().left;
        this.modelService.bod.y = element.y; // event.pageY - canvas.getBoundingClientRect().top;
        this.modelService.hranabymove = this.novy_svg_temp_arc(element, this.modelService.bod, 'inhibitor');
      }
    }

    if (this.modelService.whichButton.getValue() === 'readarc') {
      if (this.modelService.kresli_sa_hrana === 0) {
        this.modelService.source_hrany = element;
        this.modelService.kresli_sa_hrana = 1;
        this.modelService.bod.x = element.x + ModelerConfig.ARROW_HEAD_SIZE; // event.pageX - canvas.getBoundingClientRect().left;
        this.modelService.bod.y = element.y; // event.pageY - canvas.getBoundingClientRect().top;
        this.modelService.hranabymove = this.novy_svg_temp_arc(element, this.modelService.bod, 'read');
      }
    }

    if (this.modelService.whichButton.getValue() === 'label') {
      this.modelService.updatePreviousState();
      const label = prompt('Please enter place label', element.label);
      if (label != null) {
        element.label = label;
        labelnode.nodeValue = element.label;
        this.modelService.sirkatextu = svgmeno.getComputedTextLength();
        svgzamenom.setAttributeNS(null, 'x', element.x - this.modelService.sirkatextu / 2);
        svgzamenom.setAttributeNS(null, 'width', this.modelService.sirkatextu);
        svgmeno.setAttributeNS(null, 'x', element.x - this.modelService.sirkatextu / 2);
      }
    }

    if (this.modelService.whichButton.getValue() === 'marking') {
      this.modelService.updatePreviousState();
      this.updatemarkingsvg(element);
      this.updatePlaceRefVahuHrany();
    }

    if (this.modelService.whichButton.getValue() === 'addtoken') {
      this.modelService.updatePreviousState();
      element.marking++;
      this.updatetokeny(element);
      this.updatePlaceRefVahuHrany();
    }

    if (this.modelService.whichButton.getValue() === 'removetoken') {
      this.modelService.updatePreviousState();
      if (element.marking > 0) {
        element.marking--;
        this.updatetokeny(element);
        this.updatePlaceRefVahuHrany();
      }
    }

    if (this.modelService.whichButton.getValue() === 'position') {
      let doit = false;
      let novex = element.x;
      let novey = element.y;
      const a = prompt('Please enter x-coordinate of the place (not smaller than ' + ModelerConfig.COORDINATES_OFFSET +
        ' and not greater than ' + ModelerConfig.MAX_X + ' ):', element.x);
      if (a != null) {
        const x = parseInt(a, 10);
        if (isNaN(x)) {
          alert('x is not a number');
        } else {
          if (x <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_X <= x) {
            alert('x is out of dimension');
          } else {
            novex = x;
            doit = true;
          }
        }
      }

      const b = prompt('Please enter y-coordinate of the place (not smaller than ' +
        ModelerConfig.COORDINATES_OFFSET + ' and not greater than ' + ModelerConfig.MAX_Y + ' ):', element.y);
      if (b != null) {
        const y = parseInt(b, 10);
        if (isNaN(y)) {
          alert('y is not a number');
        } else {
          if (y <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_Y <= y) {
            alert('y is out of dimension');
          } else {
            novey = y;
            doit = true;
          }
        }
      }

      if (doit) {
        this.movemiesto(element, novex, novey);
      }
    }

    if (this.modelService.whichButton.getValue() === 'move') {
      if (this.modelService.hybesamiesto === 0) {
        this.modelService.hybesamiesto = 1;
        this.modelService.movedmiesto = element;
      }
    }

    if (this.modelService.whichButton.getValue() === 'arc_placeref' && this.hranaForPlaceref !== undefined) {
      this.attachPlaceToArc(element);
      this.hranaForPlaceref.deactivate();
      this.hranaForPlaceref = undefined;
    }
  }

  movemiesto(miesto, x, y) {
    miesto.x = x;
    miesto.y = y;

    miesto.objektymiesta.element.setAttributeNS(null, 'cx', x);
    miesto.objektymiesta.element.setAttributeNS(null, 'cy', y);
    miesto.objektymiesta.element.setAttributeNS(null, 'stroke', 'red');

    this.modelService.sirkatextu = miesto.objektymiesta.menoelem.getComputedTextLength();

    miesto.objektymiesta.zamenom.setAttributeNS(null, 'x', x - this.modelService.sirkatextu / 2);
    miesto.objektymiesta.zamenom.setAttributeNS(null, 'y', y + ModelerConfig.RADIUS + ModelerConfig.FONTSIZE_OFFSET - this.modelService.korekcia);


    miesto.objektymiesta.menoelem.setAttributeNS(null, 'x', x - this.modelService.sirkatextu / 2);
    miesto.objektymiesta.menoelem.setAttributeNS(null, 'y', y + ModelerConfig.RADIUS + ModelerConfig.FONTSIZE_OFFSET);

    this.updatepositionmarking(miesto);

    this.modelService.sirkatextu = miesto.objektymiesta.svgmarking.getComputedTextLength();
    miesto.objektymiesta.svgmarking.setAttributeNS(null, 'x', x - this.modelService.sirkatextu / 2);
    miesto.objektymiesta.svgmarking.setAttributeNS(null, 'y', y + ModelerConfig.FONT_SIZE / 2);

    for (const arc of this.modelService.model.arcs) {
      if (miesto === arc.source || miesto === arc.target) {
        this.updatehranusvg(arc);
      }
    }
  }

  updatepositionmarking(place) {
    const x = place.x;
    const y = place.y;

    place.markingtokens[0].setAttributeNS(null, 'cx', x);
    place.markingtokens[0].setAttributeNS(null, 'cy', y);

    place.markingtokens[1].setAttributeNS(null, 'cx', x + ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[1].setAttributeNS(null, 'cy', y + ModelerConfig.TOKEN_OFFSET);

    place.markingtokens[2].setAttributeNS(null, 'cx', x - ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[2].setAttributeNS(null, 'cy', y + ModelerConfig.TOKEN_OFFSET);

    place.markingtokens[3].setAttributeNS(null, 'cx', x + ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[3].setAttributeNS(null, 'cy', y - ModelerConfig.TOKEN_OFFSET);

    place.markingtokens[4].setAttributeNS(null, 'cx', x - ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[4].setAttributeNS(null, 'cy', y - ModelerConfig.TOKEN_OFFSET);

    place.markingtokens[5].setAttributeNS(null, 'cx', x - ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[5].setAttributeNS(null, 'cy', y);

    place.markingtokens[6].setAttributeNS(null, 'cx', x + ModelerConfig.TOKEN_OFFSET);
    place.markingtokens[6].setAttributeNS(null, 'cy', y);

    place.markingtokens[7].setAttributeNS(null, 'cx', x);
    place.markingtokens[7].setAttributeNS(null, 'cy', y - ModelerConfig.TOKEN_OFFSET);

    place.markingtokens[8].setAttributeNS(null, 'cx', x);
    place.markingtokens[8].setAttributeNS(null, 'cy', y + ModelerConfig.TOKEN_OFFSET);
  }

  tokeny(place) {
    const x = place.x;
    const y = place.y;
    const offsets = [[0, 0], [1, 1], [-1, 1], [1, -1], [-1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < 9; i++) {
      const offset = offsets[i];
      place.markingtokens[i] = document.createElementNS(CanvasService.svgNamespace, 'circle');
      place.markingtokens[i].setAttributeNS(null, 'cx', x + offset[0] * ModelerConfig.TOKEN_OFFSET);
      place.markingtokens[i].setAttributeNS(null, 'cy', y + offset[1] * ModelerConfig.TOKEN_OFFSET);
      place.markingtokens[i].setAttributeNS(null, 'r', ModelerConfig.TOKEN_RADIUS);
      place.markingtokens[i].setAttributeNS(null, 'fill', 'white');
      this.canvas.add(place.markingtokens[i]);
    }
  }

  updatemarkingsvg(place) {
    place.objektymiesta.markingnode.nodeValue = place.markinglabel;
    let marking = place.marking;
    const zadane = prompt('Please enter a nonnegative place marking', place.marking);

    if (zadane != null) {
      marking = parseInt(zadane, 10);
      if (isNaN(marking)) {
        alert('Not a number');
      }

      if (marking < 0) {
        alert('Negative number');
      }

      if (!isNaN(marking) && marking >= 0) {
        place.marking = marking;
        this.updatetokeny(place);

      }
    }
  }

  renderIcon(t: Transition) {
    const icon = document.createElementNS(CanvasService.svgNamespace, 'text') as HTMLElement;
    console.log(t);
    icon.setAttributeNS(null, 'x', String(t.x - ModelerConfig.ICON_SIZE / 2));
    icon.setAttributeNS(null, 'y', String(t.y + ModelerConfig.ICON_SIZE / 2));
    icon.setAttributeNS(null, 'style', `font-family: Material Icons;font-size:${ModelerConfig.ICON_SIZE}`);
    icon.appendChild(document.createTextNode(t.icon));
    this.canvas.add(icon);
    icon.onmouseover = t.objektyelementu.element.onmouseover;
    icon.onmouseout = t.objektyelementu.element.onmouseout;
    icon.onmousedown = t.objektyelementu.element.onmousedown;
    icon.oncontextmenu = t.objektyelementu.element.oncontextmenu;
    t.objektyelementu.icon = icon;
  }

  novy_svg_transition(transition: Transition, x, y, velkost) {
    const cancelArrow = document.createElementNS(CanvasService.svgNamespace, 'polygon') as HTMLElement;
    cancelArrow.setAttributeNS(null, 'points', this.bodycancelsipky(x, y));
    cancelArrow.setAttributeNS(null, 'fill', 'white');
    cancelArrow.setAttributeNS(null, 'stroke', 'white');
    cancelArrow.setAttributeNS(null, 'stroke-width', '2');
    this.canvas.add(cancelArrow);

    const finishArrow = document.createElementNS(CanvasService.svgNamespace, 'polygon') as HTMLElement;
    finishArrow.setAttributeNS(null, 'points', this.bodyfinishsipky(x, y));
    finishArrow.setAttributeNS(null, 'fill', 'white');
    finishArrow.setAttributeNS(null, 'stroke', 'white');
    finishArrow.setAttributeNS(null, 'stroke-width', '2');
    this.canvas.add(finishArrow);

    const element = document.createElementNS(CanvasService.svgNamespace, 'rect') as HTMLElement;
    element.setAttributeNS(null, 'x', String(x - velkost / 2));
    element.setAttributeNS(null, 'y', String(y - velkost / 2));
    element.setAttributeNS(null, 'width', velkost);
    element.setAttributeNS(null, 'height', velkost);
    transition.deactivate();
    this.canvas.add(element);

    const zamenom = document.createElementNS(CanvasService.svgNamespace, 'rect') as HTMLElement;
    zamenom.setAttributeNS(null, 'x', x);
    zamenom.setAttributeNS(null, 'y', String(y + velkost / 2 + ModelerConfig.FONTSIZE_OFFSET - this.modelService.korekcia));
    zamenom.setAttributeNS(null, 'width', String(0));
    zamenom.setAttributeNS(null, 'height', String(ModelerConfig.FONT_SIZE));
    zamenom.setAttributeNS(null, 'fill-opacity', '0.7');
    zamenom.setAttributeNS(null, 'fill', 'white');
    this.canvas.add(zamenom);

    const menoelem = (document.createElementNS(CanvasService.svgNamespace, 'text') as unknown) as SVGTextContentElement;
    menoelem.setAttributeNS(null, 'x', x);
    menoelem.setAttributeNS(null, 'y', y + velkost / 2 + ModelerConfig.FONTSIZE_OFFSET);
    menoelem.setAttributeNS(null, 'font-size', String(ModelerConfig.FONT_SIZE));
    menoelem.setAttributeNS(null, 'font-family', this.modelService.fontfamily);
    const meno = document.createTextNode(transition.label);
    menoelem.appendChild(meno);
    this.canvas.add(menoelem);

    this.modelService.sirkatextu = menoelem.getComputedTextLength();

    zamenom.setAttributeNS(null, 'x', String(x - this.modelService.sirkatextu / 2));
    menoelem.setAttributeNS(null, 'x', String(x - this.modelService.sirkatextu / 2));


    element.onmouseover = menoelem.onmouseover = finishArrow.onmouseover = cancelArrow.onmouseover = () => {
      if (!this.isFireMode()) {
        transition.activate();
      }
    };
    element.onmouseout = menoelem.onmouseout = finishArrow.onmouseout = cancelArrow.onmouseout = () => {
      if (!this.isFireMode()) {
        transition.deactivate();
      }
    };

    element.onmousedown = this.transitionOnMouseDown(transition, () => {
      if (this.modelService.whichButton.getValue() === 'fire') {
        if (this.enabled(transition)) {
          this.consume(transition);
          this.produce(transition);
          this.updatePlaceRefVahuHrany();
          this.updatemarkings();
          if (this.modelService.whichButton.getValue() === 'fire') {
            for (const trans of this.modelService.model.transitions) {
              if (this.enabled(trans)) {
                trans.enable();
              } else {
                trans.disable();
              }
            }
          }
        }
      }
    }, () => {
      if (this.modelService.whichButton.getValue() === 'fire-task') {
        if (this.enabled(transition) || transition.firing) {
          if (!transition.firing) {
            this.consume(transition);
          }
          this.updatemarkings();
          if (this.modelService.whichButton.getValue() === 'fire-task') {
            for (const trans of this.modelService.model.transitions) {
              if (this.enabled(trans)) {
                trans.enable();
              } else {
                trans.disable();
              }
            }
          }
        }
      }
    });
    cancelArrow.onmousedown = this.transitionOnMouseDown(transition, () => {}, () => {
      if (this.modelService.whichButton.getValue() === 'fire-task') {
        if (this.enabled(transition) || transition.firing) {
          if (transition.firing) {
            this.cancel(transition);
          } else {
            this.consume(transition);
          }
          this.updatemarkings();
          if (this.modelService.whichButton.getValue() === 'fire-task') {
            for (const trans of this.modelService.model.transitions) {
              if (this.enabled(trans)) {
                trans.enable();
              } else {
                trans.disable();
              }
            }
          }
        }
      }
    });

    finishArrow.onmousedown = this.transitionOnMouseDown(transition, () => {}, () => {
      if (this.modelService.whichButton.getValue() === 'fire-task') {
        if (this.enabled(transition) || transition.firing) {
          if (transition.firing) {
            this.produce(transition);
          } else {
            this.consume(transition);
          }
          this.updatemarkings();
          if (this.modelService.whichButton.getValue() === 'fire-task') {
            for (const trans of this.modelService.model.transitions) {
              if (this.enabled(trans)) {
                trans.enable();
              } else {
                trans.disable();
              }
            }
          }
        }
      }
    });

    element.oncontextmenu = (event) => {
      if (document.getElementById('ctxMenu') !== null) {
        const i = document.getElementById('ctxMenu').style;
        i.top = event.clientY + 'px';
        i.left = event.clientX + 'px';
        i.visibility = 'visible';
        i.opacity = '1';
        localStorage.setItem('TransitionId', transition.id);
        event.preventDefault();
      }
    };

    menoelem.onmousedown = () => {
      if (this.modelService.whichButton.getValue() === 'label') {
        // this.modelService.previousStatus = this.exportService.generujXML(1);
        const label = prompt('Please enter transition label', transition.label);
        if (label != null) {
          transition.label = label;
          meno.nodeValue = transition.label;
          this.modelService.sirkatextu = menoelem.getComputedTextLength();
          zamenom.setAttributeNS(null, 'x', String(transition.x - this.modelService.sirkatextu / 2));
          zamenom.setAttributeNS(null, 'width', String(this.modelService.sirkatextu));
          menoelem.setAttributeNS(null, 'x', String(transition.x - this.modelService.sirkatextu / 2));
        }
      }
    };

    return new ObjectElement(element, menoelem, meno, zamenom, finishArrow, cancelArrow);
  }

  moveprechod(prechod, x, y) {
    prechod.x = x;
    prechod.y = y;
    prechod.objektyelementu.element.setAttributeNS(null, 'x', x - ModelerConfig.SIZE / 2);

    prechod.objektyelementu.element.setAttributeNS(null, 'y', y - ModelerConfig.SIZE / 2);
    prechod.objektyelementu.element.setAttributeNS(null, 'stroke', 'red');
    prechod.objektyelementu.cancelArrow.setAttributeNS(null, 'points', this.bodycancelsipky(x, y));
    prechod.objektyelementu.finishArrow.setAttributeNS(null, 'points', this.bodyfinishsipky(x, y));

    this.modelService.sirkatextu = prechod.objektyelementu.menoelem.getComputedTextLength();

    prechod.objektyelementu.zamenom.setAttributeNS(null, 'x', x - this.modelService.sirkatextu / 2);
    prechod.objektyelementu.zamenom.setAttributeNS(null, 'y', y + ModelerConfig.SIZE / 2 + ModelerConfig.FONTSIZE_OFFSET - this.modelService.korekcia);

    prechod.objektyelementu.menoelem.setAttributeNS(null, 'x', x - this.modelService.sirkatextu / 2);
    prechod.objektyelementu.menoelem.setAttributeNS(null, 'y', y + ModelerConfig.SIZE / 2 + ModelerConfig.FONTSIZE_OFFSET);

    for (const arc of this.modelService.model.arcs) {
      if (prechod === arc.source || prechod === arc.target) {
        this.updatehranusvg(arc);
      }
    }
  }

  enabled(t) {
    for (const place of this.modelService.model.places) {
      place.testmarking = place.marking;
    }

    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && (arc.arctype === 'inhibitor') && (arc.source.testmarking >= arc.vaha)) {
        return false;
      }
    }

    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && (arc.arctype === 'read') && (arc.source.testmarking < arc.vaha)) {
        return false;
      }
    }

    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && arc.arctype === 'regular' || arc.target === t && arc.arctype === 'variable') {
        arc.source.testmarking = arc.source.testmarking - arc.vaha;
      }
    }

    for (const place of this.modelService.model.places) {
      if (place.testmarking < 0) {
        return false;
      }
    }

    return true;
  }

  consume(t) {
    t.firing = true;
    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && (arc.arctype === 'regular' || arc.target === t && arc.arctype === 'variable')) {
        arc.source.marking -= arc.vaha;
        arc.cancel = arc.vaha;
      }
    }

    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && (arc.arctype === 'reset')) {
        arc.cancel = arc.source.marking;
        arc.source.marking = 0;
      }
    }
  }

  produce(t) {
    t.firing = false;
    for (const arc of this.modelService.model.arcs) {
      if (arc.source === t) {
        arc.target.marking += arc.vaha;
      }
    }
  }

  cancel(t) {
    t.firing = false;
    for (const arc of this.modelService.model.arcs) {
      if (arc.target === t && (arc.arctype === 'regular' || arc.arctype === 'reset')) {
        arc.source.marking += arc.cancel;
        arc.cancel = 0;
      }
    }
  }

  doMouseMove(event) {
    let mysX = this.getMousePositionX(event);
    let mysY = this.getMousePositionY(event);
    let posun;

    if (this.modelService.kresli_sa_hrana === 1 && (this.modelService.whichButton.getValue() === 'arc' ||
      this.modelService.whichButton.getValue() === 'resetarc' || this.modelService.whichButton.getValue() === 'inhibitorarc' ||
      this.modelService.whichButton.getValue() === 'readarc')) {

      let nx;
      let ny;
      let start: Point;
      if (this.modelService.source_hrany.type === 'place') {
        posun = ModelerConfig.RADIUS + 2;
      } else {
        posun = ModelerConfig.SIZE / 2 + 2;
      }
      if (Math.abs(this.modelService.source_hrany.x - mysX) > posun || Math.abs(this.modelService.source_hrany.y - mysY) > posun) {
        if (this.modelService.source_hrany.x > mysX) {
          mysX = mysX + 2;
        }
        if (this.modelService.source_hrany.x < mysX) {
          mysX = mysX - 2;
        }
        if (this.modelService.source_hrany.y > mysY) {
          mysY = mysY + 2;
        }
        if (this.modelService.source_hrany.y < mysY) {
          mysY = mysY - 2;
        }
        const koniech = new Point(mysX, mysY);
        const dx = koniech.x - this.modelService.source_hrany.x;
        const dy = koniech.y - this.modelService.source_hrany.y;
        const dlzkahrany = Math.sqrt(dx * dx + dy * dy);
        const dlzkaskratena = dlzkahrany - ModelerConfig.ARROW_HEAD_SIZE + 2;
        const pomer = dlzkaskratena / dlzkahrany;
        nx = this.modelService.source_hrany.x + dx * pomer;
        ny = this.modelService.source_hrany.y + dy * pomer;
        start = Arc.zaciatok_hrany(this.modelService.source_hrany, koniech);
        this.modelService.hranabymove.polyciara.setAttributeNS(null, 'points', start.x + ',' + start.y + ' ' + nx + ',' + ny);
        if (this.modelService.whichButton.getValue() === 'inhibitorarc' || this.modelService.whichButton.getValue() === 'readarc') {
          this.modelService.hranabymove.sipka.setAttributeNS(null, 'cx', this.bodInhibitorSipky(start.x, start.y, mysX, mysY).x);
          this.modelService.hranabymove.sipka.setAttributeNS(null, 'cy', this.bodInhibitorSipky(start.x, start.y, mysX, mysY).y);
        } else {
          this.modelService.hranabymove.sipka.setAttributeNS(null, 'points', this.bodySipky(start.x, start.y, mysX, mysY, this.modelService.hranabymove.arctype));
        }
      }
    }

    if (this.modelService.posuva_sa_hrana === 1 && this.modelService.whichButton.getValue() === 'move') {
      this.modelService.posuvanahrana.bodyhrany[this.modelService.indexbodu].x = mysX;
      this.modelService.posuvanahrana.bodyhrany[this.modelService.indexbodu].y = mysY;

      this.updatehranusvg(this.modelService.posuvanahrana);
    }

    if (this.modelService.hybesaprechod === 1 && this.modelService.whichButton.getValue() === 'move') {
      this.moveprechod(this.modelService.movedprechod, mysX, mysY);
    }

    if (this.modelService.hybesamiesto === 1 && this.modelService.whichButton.getValue() === 'move') {
      this.movemiesto(this.modelService.movedmiesto, mysX, mysY);
    }
  }

  korekcia_x(x) {
    let xx = x;
    if (xx < ModelerConfig.COORDINATES_OFFSET) {
      xx = ModelerConfig.COORDINATES_OFFSET;
    }

    if (xx > this.modelService.appwidth - ModelerConfig.COORDINATES_OFFSET) {
      xx = this.modelService.appwidth - ModelerConfig.COORDINATES_OFFSET;
    }

    return xx;
  }

  korekcia_y(y) {
    let yy = y;
    if (yy < ModelerConfig.COORDINATES_OFFSET) {
      yy = ModelerConfig.COORDINATES_OFFSET;
    }

    if (yy > this.modelService.appheight - ModelerConfig.COORDINATES_OFFSET) {
      yy = this.modelService.appheight - ModelerConfig.COORDINATES_OFFSET;
    }

    return yy;
  }

  doMouseDown(event) {
    if (event.button === 0) {
      if (document.getElementById('ctxMenu') && document.getElementById('ctxMenu').style.visibility === 'visible') {
        document.getElementById('ctxMenu').style.visibility = 'hidden';
      } else {
        let mysX = this.getMousePositionX(event);
        let mysY = this.getMousePositionY(event);

        mysX = this.korekcia_x(mysX);
        mysY = this.korekcia_y(mysY);

        if (this.modelService.kresli_sa_hrana === 1) {
          this.modelService.pocetmousedown++;
          if (!(this.modelService.pocetmousedown === 2 && this.modelService.kresli_sa_hrana === 1)) {
            this.modelService.updatePreviousState();
          }
        }
        if (this.modelService.pocetmousedown === 2 && this.modelService.kresli_sa_hrana === 1) {
          this.canvas.remove(this.modelService.hranabymove.polyciara);
          this.canvas.remove(this.modelService.hranabymove.sipka);
          this.modelService.pocetmousedown = 0;
          this.modelService.kresli_sa_hrana = 0;
        }

        if (this.modelService.posuva_sa_hrana === 1) {
          this.modelService.pocetmousedownposuv++;
          if (!(this.modelService.pocetmousedownposuv === 2 && this.modelService.posuva_sa_hrana === 1)) {
            this.modelService.updatePreviousState();
          }
        }
        if (this.modelService.pocetmousedownposuv === 2 && this.modelService.posuva_sa_hrana === 1) {
          this.modelService.posuvanahrana.bodyhrany[this.modelService.indexbodu].x = mysX;
          this.modelService.posuvanahrana.bodyhrany[this.modelService.indexbodu].y = mysY;
          this.modelService.pocetmousedownposuv = 0;
          this.modelService.posuva_sa_hrana = 0;
          this.updatehranusvg(this.modelService.posuvanahrana);
        }
        if (this.modelService.hybesaprechod === 1) {
          this.modelService.pocetmousedownposuvtran++;
          if (!(this.modelService.pocetmousedownposuvtran === 2 && this.modelService.hybesaprechod === 1)) {
            this.modelService.updatePreviousState();
          }
        }

        if (this.modelService.pocetmousedownposuvtran === 2 && this.modelService.hybesaprechod === 1) {
          this.modelService.pocetmousedownposuvtran = 0;
          this.modelService.hybesaprechod = 0;
          this.moveprechod(this.modelService.movedprechod, mysX, mysY);
          this.modelService.movedprechod.activate();
        }

        if (this.modelService.hybesamiesto === 1) {
          this.modelService.pocetmousedownposuvplace++;
          if (!(this.modelService.pocetmousedownposuvplace === 2 && this.modelService.hybesamiesto === 1)) {
            this.modelService.updatePreviousState();
          }
        }

        if (this.modelService.pocetmousedownposuvplace === 2 && this.modelService.hybesamiesto === 1) {
          this.modelService.pocetmousedownposuvplace = 0;
          this.modelService.hybesamiesto = 0;
          this.movemiesto(this.modelService.movedmiesto, mysX, mysY);
          this.modelService.movedmiesto.activate();
        }


        if (this.modelService.whichButton.getValue() === 'transition') {
          this.modelService.updatePreviousState();
          const actual = this.modelService.model.transitions.length;
          this.modelService.model.transitions[actual] = new Transition(mysX, mysY, String(this.modelService.nextId()));
          this.renderTransition(this.modelService.model.transitions[actual]);
          this.elementypredhrany(this.modelService.model);
          this.labelypredhranyprve(this.modelService.model);
        }

        if (this.modelService.whichButton.getValue() === 'place') {
          this.modelService.updatePreviousState();
          const placesActual = this.modelService.model.places.length;
          this.modelService.model.places[placesActual] = new Place(mysX, mysY, false, String(this.modelService.nextId()));
          this.renderPlace(this.modelService.model.places[placesActual]);
          this.elementypredhrany(this.modelService.model);
          this.labelypredhranyprve(this.modelService.model);
        }

        if (this.modelService.whichButton.getValue() === 'staticplace') {
          this.modelService.updatePreviousState();
          const placesActual = this.modelService.model.places.length;
          this.modelService.model.places[placesActual] = new Place(mysX, mysY, true, String(this.modelService.nextId()));
          this.renderPlace(this.modelService.model.places[placesActual]);
          this.elementypredhrany(this.modelService.model);
          this.labelypredhranyprve(this.modelService.model);
        }

        if (this.modelService.whichButton.getValue() === 'arc_placeref' && this.hranaForPlaceref !== undefined) {
          if (this.hranaForPlacerefClicked) {
            this.hranaForPlacerefClicked = false;
          } else {
            this.hranaForPlaceref.deactivate();
            this.hranaForPlaceref = undefined;
          }
        }
      }
    }
  }

  undo() {
    // TODO: use event sourcing
    // if (this.modelService.previousStatus != null) {
    //   this.importService.importFromXml(this.importService.parseXml(this.modelService.previousStatus));
    //   this.modelService.previousStatus = null;
    // }
  }

  deleteAll() {
    this.canvas.removeAll();
    this.modelService.resetId();
  }

  /**
   * GUI
   */

  clearmodel() {
    if (this.modelService.model.places.length > 0 || this.modelService.model.transitions.length > 0) {
      const c = confirm('Are you sure to clear? Any unsaved changes will be lost.');
      if (c) {
        this.deleteModel();
        // TODO document.getElementById('menofilu').innerHTML = this.modelService.menofilu;
      }
    } else {
      this.deleteModel();
      // TODO document.getElementById('menofilu').innerHTML = this.modelService.menofilu;
    }
  }

  deleteModel() {
    this.deleteAll();
    this.modelService.menofilu = 'newmodel.xml';
    this.modelService.model = new Model();
    this.modelService.model.title = 'New Model';
    this.modelService.model.description = 'New Model';
    this.modelService.model.icon = 'home';
    this.modelService.model.version = '1.0.0';
    this.modelService.model.identifier = 'new_model';
    this.modelService.model.initials = 'NEW';
  }

  setDimension() {
    let doit = false;
    const a = prompt('Please enter width (min width is ' + ModelerConfig.MIN_WIDTH + ', max width is ' +
      ModelerConfig.MAX_WIDTH + '):', String(this.modelService.appwidth));
    if (a != null) {
      const x = parseInt(a, 10);
      if (isNaN(x)) {
        alert('x is not a number');
      } else {
        if (x < ModelerConfig.MIN_WIDTH || ModelerConfig.MAX_WIDTH < x) { // || y < minheight || maxheight < y
          alert('x is out of dimension');
        } else {
          this.modelService.appwidth = x;
          doit = true;
        }
      }
    }
    const b = prompt('Please enter height (min height is ' + ModelerConfig.MIN_HEIGHT + ', max height is ' +
      ModelerConfig.MAX_HEIGHT + ':', String(this.modelService.appheight));
    if (b != null) {
      const y = parseInt(b, 10);
      if (isNaN(y)) {
        alert('y is not a number');
      } else {
        if (y < ModelerConfig.MIN_HEIGHT || ModelerConfig.MAX_HEIGHT < y) {
          alert('y is out of dimension');
        } else {
          this.modelService.appheight = y;
          doit = true;
        }
      }
    }

    if (doit) {
      this.canvas.resize(this.modelService.appwidth, this.modelService.appheight);
    }
  }

  alignElements() {
    for (const t of this.modelService.model.transitions) {
      let x = t.x;
      x = this.korekcia_x(Math.floor(x / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
      let y = t.y;
      y = this.korekcia_y(Math.floor(y / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
      this.moveprechod(t, x, y);
      t.deactivate();
    }

    for (const place of this.modelService.model.places) {
      let x = place.x;
      x = this.korekcia_x(Math.floor(x / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
      let y = place.y;
      y = this.korekcia_y(Math.floor(y / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
      this.movemiesto(place, x, y);
      place.deactivate();
    }

    for (const arc of this.modelService.model.arcs) {
      for (const bodHrany of arc.bodyhrany) {
        const x = bodHrany.x;
        bodHrany.x = this.korekcia_x(Math.floor(x / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
        const y = bodHrany.y;
        bodHrany.y = this.korekcia_y(Math.floor(y / ModelerConfig.GRID_STEP) * ModelerConfig.GRID_STEP + ModelerConfig.GRID_STEP / 2);
      }
      this.updatehranusvg(arc);
    }

    this.reset();
  }

  propertiesM() {
    const spolu = this.modelService.model.places.length + this.modelService.model.transitions.length + this.modelService.model.arcs.length;
    alert('Number of places: ' + this.modelService.model.places.length + '\nNumber of transitions: ' + this.modelService.model.transitions.length +
      '\nNumber of arcs: ' + this.modelService.model.arcs.length + '\nNumber of elements: ' + spolu);
  }

  about() {
    alert('Copyright © 2020 Interes GROUP \n' +
        'prof. RNDr. Gabriel Juhás, PhD.\n' +
        'Ing. Milan Mladoniczky\n' +
        'Ing. Juraj Mažári\n' +
        'Ing. Tomáš Kováčik\n' +
        'Ing. Jakub Kovář\n' +
        'Ing. Martin Kranec');
  }

  getMousePositionY(event) {
    if (ModelerConfig.VERTICAL_OFFSET === undefined) {
      return event.offsetY;
    }
    return event.offsetY - ModelerConfig.VERTICAL_OFFSET;
  }

  getMousePositionX(event) {
    if (ModelerConfig.HORIZONTAL_OFFSET === undefined) {
      return event.offsetX;
    }
    return event.offsetX - ModelerConfig.HORIZONTAL_OFFSET;
  }

  deletePlaceReferenceData(arcId) {
    const arc = this.modelService.model.arcs.find(it => it.id === arcId);
    if (arc !== undefined) {
      arc.placeref = false;
      arc.vaha = 1;
      arc.vahalabel = '';
      arc.objektyhrany.vaha.nodeValue = arc.vahalabel;
      this.updatehranusvg(arc);
    }
  }

  deleteArcReferenceData(arcId) {
    const arc = this.modelService.model.arcs.find(it => it.id === arcId);
    if (arc !== undefined) {
      arc.dataref = false;
      arc.vaha = 1;
      arc.vahalabel = '';
      arc.objektyhrany.vaha.nodeValue = arc.vahalabel;
      this.updatehranusvg(arc);
    }
  }

  attachDataToArc(data: DataVariable) {
    const i = this.modelService.getVariableIndexByID(data.id);

    const vaha = parseInt(this.modelService.model.processData[i].value, 10);

    if (isNaN(vaha)) {
      alert('Not a number. Cannot change the value of arc weight.');
    }
    if (vaha < 0) {
      alert('A negative number. Cannot change the value of arc weight.');
    }

    if (!isNaN(vaha) && vaha >= 0) {

      this.modelService.model.arc_for_data.vaha = vaha;

      const varname = parseInt(this.modelService.model.processData[i].name, 10);
      if (!isNaN(varname)) {
        alert('Warning. Variable name starts with a number. Apostrophes added.');
      }
      if (!this.modelService.model.processData[i].name.replace(/\s/g, '').length) {
        alert('Warning. Variable name only containes whitespaces. Apostrophes added.');
      }

      if (!isNaN(varname) || !this.modelService.model.processData[i].name.replace(/\s/g, '').length) {
        this.modelService.model.arc_for_data.vahalabel = '"' + this.modelService.model.processData[i].name + '"';
      } else {
        this.modelService.model.arc_for_data.vahalabel = this.modelService.model.processData[i].name;
      }
      this.modelService.model.arc_for_data.dataref = this.modelService.model.processData[i];

      this.modelService.model.arc_for_data.objektyhrany.vaha.nodeValue = `${this.modelService.model.arc_for_data.vahalabel} (${vaha})`;
      this.updatehranusvg(this.modelService.model.arc_for_data);

    }
  }

  attachPlaceToArc(place: Place) {
    const vaha = place.marking;

    if (isNaN(vaha)) {
      alert('Not a number. Cannot change the value of arc weight.');
    }
    if (vaha < 0) {
      alert('A negative number. Cannot change the value of arc weight.');
    }

    if (!isNaN(vaha) && vaha >= 0) {
      this.hranaForPlaceref.vaha = vaha;

      const varname = parseInt(place.label, 10);
      if (!isNaN(varname)) {
        alert('Warning. Place label starts with a number. Apostrophes added.');
      }
      if (!place.label.replace(/\s/g, '').length) {
        alert('Warning. Place label only containes whitespaces. Apostrophes added.');
      }

      if (!isNaN(varname) || !place.label.replace(/\s/g, '').length) {
        this.hranaForPlaceref.vahalabel = '"' + place.label + '"';
      } else {
        this.hranaForPlaceref.vahalabel = place.label;
      }
      this.hranaForPlaceref.placeref = place;

      this.hranaForPlaceref.objektyhrany.vaha.nodeValue = `${this.hranaForPlaceref.vahalabel} (${vaha})`;
      this.updatehranusvg(this.hranaForPlaceref);
    }
  }

  set editSideNav(value: MatSidenav) {
    this._editSideNav = value;
  }

  bodycancelsipky(x: number, y: number) {
    const x1 = x - 0.1 * ModelerConfig.SIZE / 2;
    const y1 = y - 0.8 * ModelerConfig.SIZE / 2;
    const x2 = x - 0.1 * ModelerConfig.SIZE / 2;
    const y2 = y + 0.8 * ModelerConfig.SIZE / 2;
    const x3 = x - 0.85 * ModelerConfig.SIZE / 2;
    return x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y + ' ';
  }

  bodyfinishsipky(x: number, y: number) {
    const x1 = x + 0.1 * ModelerConfig.SIZE / 2;
    const y1 = y - 0.8 * ModelerConfig.SIZE / 2;
    const x2 = x + 0.1 * ModelerConfig.SIZE / 2;
    const y2 = y + 0.8 * ModelerConfig.SIZE / 2;
    const x3 = x + 0.85 * ModelerConfig.SIZE / 2;
    return x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y + ' ';
  }

  isFireMode(): boolean {
    return this.fireModes.includes(this.modelService.whichButton.getValue());
  }

  transitionOnMouseDown(transition: Transition, onFireMode, onTaskFireMode) {
    return (event) => {
      if (event.button === 0) {
        if (this.modelService.whichButton.getValue() === 'select') {
          this.selectedTransition.next(transition);
          this._editSideNav.open();
        }
        if (this.modelService.whichButton.getValue() === 'delete') {
          for (let i = 0; i < this.modelService.model.arcs.length; i++) {
            if (transition === this.modelService.model.arcs[i].source || transition === this.modelService.model.arcs[i].target) {
              this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.polyciarapod);
              this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.polyciara);
              this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.sipka);
              this.modelService.model.arcs[i].objektyhrany.vahaelem.removeChild(this.modelService.model.arcs[i].objektyhrany.vaha);
              this.canvas.remove(this.modelService.model.arcs[i].objektyhrany.vahaelem);
              this.modelService.model.arcs.splice(i, 1);
              i--;
            }
          }

          this.canvas.remove(transition.objektyelementu.element);
          this.canvas.remove(transition.objektyelementu.zamenom);
          this.canvas.remove(transition.objektyelementu.cancelArrow);
          this.canvas.remove(transition.objektyelementu.finishArrow);

          transition.objektyelementu.menoelem.removeChild(transition.objektyelementu.meno);
          this.canvas.remove(transition.objektyelementu.menoelem);
          const j = this.modelService.model.transitions.indexOf(transition);
          this.modelService.model.transitions.splice(j, 1);
        }
        if (this.modelService.whichButton.getValue() === 'arc') {
          if (this.modelService.kresli_sa_hrana === 0) {
            this.modelService.source_hrany = transition;
            this.modelService.kresli_sa_hrana = 1;
            this.modelService.bod.x = transition.x + ModelerConfig.ARROW_HEAD_SIZE; // event.pageX - HORIZONTAL_OFFSET;
            this.modelService.bod.y = transition.y; // event.pageY - VERTICAL_OFFSET;
            this.modelService.hranabymove = this.novy_svg_temp_arc(transition, this.modelService.bod, 'regular');
          } else {
            if (this.modelService.source_hrany.type !== transition.type) {
              const actual = this.modelService.model.arcs.length;
              this.modelService.model.arcs[actual] = new Arc(this.modelService.source_hrany, transition, 'regular', String(this.modelService.nextId()));
              this.renderArc(this.modelService.model.arcs[actual]);
              this.elementypredhrany(this.modelService.model);
              this.labelypredhranyprve(this.modelService.model);
            }
          }
        }

        if (this.modelService.whichButton.getValue() === 'resetarc') {
          if (this.modelService.kresli_sa_hrana !== 0) {
            if (this.modelService.source_hrany.type !== transition.type) {
              const actual = this.modelService.model.arcs.length;
              this.modelService.model.arcs[actual] = new Arc(this.modelService.source_hrany, transition, 'reset', String(this.modelService.nextId()));
              this.renderArc(this.modelService.model.arcs[actual]);
              this.elementypredhrany(this.modelService.model);
              this.labelypredhranyprve(this.modelService.model);
            }
          }
        }

        if (this.modelService.whichButton.getValue() === 'inhibitorarc') {
          if (this.modelService.kresli_sa_hrana !== 0) {
            if (this.modelService.source_hrany.type !== transition.type) {
              const actual = this.modelService.model.arcs.length;
              this.modelService.model.arcs[actual] = new Arc(this.modelService.source_hrany, transition, 'inhibitor', String(this.modelService.nextId()));
              this.renderArc(this.modelService.model.arcs[actual]);
              this.elementypredhrany(this.modelService.model);
              this.labelypredhranyprve(this.modelService.model);
            }
          }
        }

        if (this.modelService.whichButton.getValue() === 'readarc') {
          if (this.modelService.kresli_sa_hrana !== 0) {
            if (this.modelService.source_hrany.type !== transition.type) {
              const actual = this.modelService.model.arcs.length;
              this.modelService.model.arcs[actual] = new Arc(this.modelService.source_hrany, transition, 'read', String(this.modelService.nextId()));
              this.renderArc(this.modelService.model.arcs[actual]);
              this.elementypredhrany(this.modelService.model);
              this.labelypredhranyprve(this.modelService.model);
            }
          }
        }

        if (this.modelService.whichButton.getValue() === 'position') {
          let doit = false;
          let novex = transition.x;
          let novey = transition.y;
          const a = prompt('Please enter x-coordinate of the transition (not smaller than ' +
            ModelerConfig.COORDINATES_OFFSET + ' and not greater than ' + ModelerConfig.MAX_X + ' ):', transition.stringX);
          if (a != null) {
            const xx = parseInt(a, 10);
            if (isNaN(xx)) {
              alert('x is not a number');
            } else {
              if (xx <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_X <= xx) {
                alert('x is out of dimension');
              } else {
                novex = xx;
                doit = true;
              }
            }
          }
          const b = prompt('Please enter y-coordinate of the transition (not smaller than ' +
            ModelerConfig.COORDINATES_OFFSET + ' and not greater than ' + ModelerConfig.MAX_Y + ' ):', transition.stringY);
          if (b != null) {
            const yy = parseInt(b, 10);
            if (isNaN(yy)) {
              alert('y is not a number');
            } else {
              if (yy <= ModelerConfig.COORDINATES_OFFSET || ModelerConfig.MAX_Y <= yy) {
                alert('y is out of dimension');
              } else {
                novey = yy;
                doit = true;
              }
            }
          }
          if (doit) {
            this.moveprechod(transition, novex, novey);
          }
        }

        if (this.modelService.whichButton.getValue() === 'move') {
          if (this.modelService.hybesaprechod === 0) {
            this.modelService.hybesaprechod = 1;
            this.modelService.movedprechod = transition;
          }
        }

        if (this.modelService.whichButton.getValue() === 'label') {
          this.modelService.updatePreviousState();
          const label = prompt('Please enter transition label', transition.label);
          if (label != null) {
            transition.label = label;
            transition.objektyelementu.meno.nodeValue = transition.label;
            this.modelService.sirkatextu = transition.objektyelementu.menoelem.getComputedTextLength();
            transition.objektyelementu.zamenom.setAttributeNS(null, 'x', String(transition.x - this.modelService.sirkatextu / 2));
            transition.objektyelementu.zamenom.setAttributeNS(null, 'width', String(this.modelService.sirkatextu));
            transition.objektyelementu.menoelem.setAttributeNS(null, 'x', String(transition.x - this.modelService.sirkatextu / 2));
          }
        }

        if (this.modelService.whichButton.getValue() === 'arc_placeref' && this.hranaForPlaceref !== undefined) {
          alert('It is not possible to choose transition as reference');
          this.hranaForPlaceref.deactivate();
          this.hranaForPlaceref = undefined;
        }

        onFireMode();
        onTaskFireMode();
      }
    };
  }

  private openAttachDialog(element) {
    this.modelService.model.arc_for_data = element;
    const dialogRef = this.dialog.open(DialogArcAttachComponent, {
      width: '75%',
      data: element
    });

    dialogRef.afterClosed().subscribe(dataVariable => {
      if (dataVariable === undefined) {
        if (this.modelService.model.arc_for_data.dataref) {
          this.deleteArcReferenceData(element.id);
        }
      } else {
        this.attachDataToArc(dataVariable);
      }
      this.modelService.model.arc_for_data = undefined;
    });
  }

  updatePlaceRefVahuHrany() {
    for (const arc of this.modelService.model.arcs) {
      if (arc.placeref) {
        arc.vaha = arc.placeref.marking;
        arc.objektyhrany.vaha.nodeValue = `${arc.placeref.label === '' ? '""' : arc.placeref.label} ${'(' + arc.vaha + ')'}`;
      }
    }
  }

  updateDataRefVahuHrany() {
    for (const arc of this.modelService.model.arcs) {
      if (arc.dataref) {
        const vaha = arc.dataref.value;
        if (isNaN(vaha)) {
          alert('Not a number. Cannot change the value of arc weight. Dataref - ' + arc.dataref.id);
        }
        if (vaha < 0) {
          alert('A negative number. Cannot change the value of arc weight. Dataref - ' + arc.dataref.id);
        }
        if (!isNaN(vaha) && vaha >= 0) {
          arc.vaha = vaha;
        }
      }
    }
  }

}
