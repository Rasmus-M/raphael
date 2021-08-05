export class Point {

  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
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

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  toString(): string {
    return '(' + this.x + ', '  + this.y + ')';
  }
}
