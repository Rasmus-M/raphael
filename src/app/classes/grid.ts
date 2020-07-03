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

  clear(value: number): void {
    this.data = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row[x] = value;
      }
      this.data.push(row);
    }
  }

  clone(): Grid {
    const clone = new Grid(this.width, this.height, 0);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        clone.data[y][x] = this.data[y][x];
      }
    }
    return clone;
  }

  shiftLeft(): void {
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const firstCell = row.shift();
      row.push(firstCell);
    }
  }

  shiftRight(): void {
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const lastCell = row.pop();
      row.unshift(lastCell);
    }
  }

  shiftUp(): void {
    const firstRow = this.data.shift();
    this.data.push(firstRow);
  }

  shiftDown(): void {
    const lastRow = this.data.pop();
    this.data.unshift(lastRow);
  }
}
