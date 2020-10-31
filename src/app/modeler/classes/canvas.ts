export class Canvas {

  _svg: any;

  /**
   * Canvas object to draw the model's components.
   * @param svg - canvas element
   */
  constructor(svg: any) {
    this._svg = svg;
    this._svg.onselectstart = () => false;
  }

  /**
   * Add element to be drawn in the canvas.
   * @param element - Element to add.
   */
  add(element) {
    this._svg.appendChild(element);
  }

  /**
   * Remove element from the canvas.
   * Removed element will no longer be visible in the canvas.
   * @param element - Element to remove.
   */
  remove(element) {
    this._svg.removeChild(element);
  }

  removeAll() {
    while (this._svg.lastChild) {
      this._svg.removeChild(this._svg.lastChild);
    }
  }

  /**
   * Register callback to the event type (i.e. click, mouseover etc.).
   * @param event - Name of the event to be handled.
   * @param callback - Callback function that will be call when specified event of the canvas occurs.
   */
  on(event, callback) {
    this._svg.addEventListener(event, callback, false);
  }

  /**
   * Change dimensions of the canvas.
   * @param width - width
   * @param height - height
   */
  resize(width, height) {
    this._svg.setAttribute('style', `width:${width}px;height:${height}px;`);
  }

  get svg(): any {
    return this._svg;
  }
}
