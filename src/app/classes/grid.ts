import {Point} from './point';
import {Rect} from './rect';
import {Observable, Subject, Subscription} from 'rxjs';

export class Grid {

  private _width: number;
  private _height: number;
  private data: number[][];

  private changeSubject: Subject<Rect> = new Subject<Rect>();
  private changeObservable: Observable<Rect> = this.changeSubject.asObservable();


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

  getSize(): Rect {
    return new Rect(0, 0, this.width, this.height);
  }

  get(point: Point): number {
    return this.data[point.y][point.x];
  }

  set(point: Point, value: number): void {
    this.data[point.y][point.x] = value;
    this.notifyChanges(new Rect(point.x, point.y, 1, 1));
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
    this.notifyChanges(this.getSize());
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
    this.notifyChanges(this.getSize());
  }

  shiftRight(): void {
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const lastCell = row.pop();
      row.unshift(lastCell);
    }
    this.notifyChanges(this.getSize());
  }

  shiftUp(): void {
    const firstRow = this.data.shift();
    this.data.push(firstRow);
    this.notifyChanges(this.getSize());
  }

  shiftDown(): void {
    const lastRow = this.data.pop();
    this.data.unshift(lastRow);
    this.notifyChanges(this.getSize());
  }

  subscribeToChanges(handler: (Rect) => void): Subscription {
    return this.changeObservable.subscribe(handler);
  }

  private notifyChanges(rect: Rect): void {
    this.changeSubject.next(rect);
  }
}
