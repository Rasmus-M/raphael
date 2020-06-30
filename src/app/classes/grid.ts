import {Point} from './point';

export class Grid {

  private _width: number;
  private _height: number;
  private data: number[][];

  constructor(width: number, height: number, value: number) {
    this._width = width;
    this._height = height;
    this.clear(value);
  }

  clear(value: number): void {
    this.data = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row[x] = 0;
      }
      this.data.push(row);
    }
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get(point: Point): number {
    return this.data[point.y][point.x];
  }

  set(point: Point, value: number): void {
    this.data[point.y][point.x] = value;
  }
}
