import {Point} from "../Bounds";

export class Grid {
  get gutter () {
    return this.gutterWidth || this.gutterHeight;
  }

  get columnWidth () {
    return (this.width - this.gutterWidth * (this.columns - 1)) / this.columns;
  }

  get rowHeight () {
    return (this.height - this.gutterHeight * (this.rows - 1)) / this.rows;
  }

  get aspectRatio () {
    return this.width / this.height;
  }

  get center (): Point {
    return {
      x: this.width / 2,
      y: this.height / 2
    };
  }

  constructor (
    public width: number,
    public height: number,
    public columns: number,
    public rows: number,
    public gutterWidth: number = 0,
    public gutterHeight: number = gutterWidth
  ) {}

  fontSize (rows: number) {
    return this.rowHeight * rows * 0.7893;
  }

  xParts (n: number, gutter = this.gutterWidth) {
    return (this.width - (n - 1) * gutter) / n;
  }

  yParts (n: number, gutter = this.gutterHeight) {
    return (this.height - (n - 1) * gutter) / n;
  }

  xSpan (n: number, gutter = this.gutterWidth) {
    return this.columnWidth * n + gutter * (n - 1);
  }

  ySpan (n: number, gutter = this.gutterHeight) {
    return this.rowHeight * n + gutter * (n - 1);
  }

  vw (n: number) {
    return this.width * (n / 100);
  }

  vh (n: number) {
    return this.height * (n / 100);
  }
}

export const grid: Grid = new Grid(1280, 720, 16, 16, 10);
