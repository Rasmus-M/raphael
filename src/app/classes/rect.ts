import {Point} from './point';

export class Rect implements Iterable<Point> {

  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  static fromPoints(point1: Point, point2: Point): Rect {
    const x1 = Math.min(point1.x, point2.x);
    const y1 = Math.min(point1.y, point2.y);
    const x2 = Math.max(point1.x, point2.x);
    const y2 = Math.max(point1.y, point2.y);
    return new Rect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
  }

  constructor(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  *[Symbol.iterator](): Iterator<Point> {
    for (let y = this.y; y < this.y + this.height; y++) {
      for (let x = this.x; x < this.x + this.width; x++) {
        yield new Point(x, y);
      }
    }

    return undefined;
  }

  clipTo(rect: Rect): Rect {
    if (this.x + this.width > rect.x + rect.width) {
      this.width = rect.x + rect.width - this.x;
    }
    if (this.y + this.height > rect.y + rect.height) {
      this.height = rect.y + rect.height - this.y;
    }
    return this;
  }
}
