import {Point} from './point';
import {Rect} from './rect';
import {Observable, Subject, Subscription} from 'rxjs';

export enum AttributeMode {
  NONE,         // All values can be set independently
  EIGHT_X_ONE,  // Only 2 values within an 8x1 area
  EIGHT_X_EIGHT // Only 2 values within an 8x8 area
}

export class Grid {

  private _width: number;
  private _height: number;
  private _attributeMode: AttributeMode;

  private data: number[][];

  private changeSubject: Subject<Rect> = new Subject<Rect>();
  private changeObservable: Observable<Rect> = this.changeSubject.asObservable();

  constructor(width: number, height: number, attributeMode: AttributeMode, initialValue: number) {
    this._width = width;
    this._height = height;
    this._attributeMode = attributeMode;
    this.data = [];
    for (let y = 0; y < this.height; y++) {
      this.data.push([]);
    }
    this.fill(initialValue);
  }

  clone(): Grid {
    const clone = new Grid(this.width, this.height, this.attributeMode, 0);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        clone.set(x, y, this.get(x, y));
      }
    }
    return clone;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get attributeMode(): AttributeMode {
    return this._attributeMode;
  }

  getSize(): Rect {
    return new Rect(0, 0, this.width, this.height);
  }

  getValue(point: Point): number {
    return this.get(point.x, point.y);
  }

  setValue(point: Point, value: number): void {
    switch (this.attributeMode) {
      case AttributeMode.NONE: {
        this.set(point.x, point.y, value);
        this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        break;
      }
      case AttributeMode.EIGHT_X_ONE: {
        const oldValue = this.getValue(point);
        this.set(point.x, point.y, value);
        const x0 = point.x - (point.x % 8);
        const y0 = point.y;
        const rect = new Rect(x0, y0, 8, 1);
        if (this.countValues(rect) <= 2) {
          this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        } else {
          this.change(rect, oldValue, value);
          this.notifyChanges(rect);
        }
        break;
      }
      case AttributeMode.EIGHT_X_EIGHT: {
        const oldValue = this.getValue(point);
        this.set(point.x, point.y, value);
        const x0 = point.x - (point.x % 8);
        const y0 = point.y - (point.y % 8);
        const rect = new Rect(x0, y0, 8, 8);
        if (this.countValues(rect) <= 2) {
          this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        } else {
          this.change(rect, oldValue, value);
          this.notifyChanges(rect);
        }
        break;
      }
    }
  }

  fill(value: number): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.set(x, y, value);
      }
    }
    this.notifyChanges(this.getSize());
  }

  shiftLeft(): void {
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const firstCell = row.shift();
      row.push(firstCell);
    }
    if (this.attributeMode !== AttributeMode.NONE) {
      this.applyAttributeMode();
    }
    this.notifyChanges(this.getSize());
  }

  shiftRight(): void {
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const lastCell = row.pop();
      row.unshift(lastCell);
    }
    if (this.attributeMode !== AttributeMode.NONE) {
      this.applyAttributeMode();
    }
    this.notifyChanges(this.getSize());
  }

  shiftUp(): void {
    const firstRow = this.data.shift();
    this.data.push(firstRow);
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
  }

  shiftDown(): void {
    const lastRow = this.data.pop();
    this.data.unshift(lastRow);
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
  }

  subscribeToChanges(handler: (Rect) => void): Subscription {
    return this.changeObservable.subscribe(handler);
  }

  private notifyChanges(rect: Rect): void {
    this.changeSubject.next(rect);
  }

  private get(x: number, y: number): number {
    return this.data[y][x];
  }

  private set(x: number, y: number, value: number): void {
    this.data[y][x] = value;
  }

  private countValues(rect: Rect): number {
    return this.getValueMap(rect).size;
  }

  private getValueMap(rect: Rect): Map<number, number> {
    const map = new Map<number, number>();
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        const value = this.get(x, y);
        map.set(value, map.get(value) ? map.get(value) + 1 : 1);
      }
    }
    return map;
  }

  private change(rect: Rect, oldValue: number, newValue): void {
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        if (this.get(x, y) === oldValue) {
          this.set(x, y, newValue);
        }
      }
    }
    this.notifyChanges(this.getSize());
  }

  private applyAttributeMode(): void {
    switch (this.attributeMode) {
      case AttributeMode.NONE:
        break;
      case AttributeMode.EIGHT_X_ONE:
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x += 8) {
            this.applyAttributeModeTo(new Rect(x, y, 8, 1));
          }
        }
        break;
      case AttributeMode.EIGHT_X_EIGHT:
        for (let y = 0; y < this.height; y += 8) {
          for (let x = 0; x < this.width; x += 8) {
            this.applyAttributeModeTo(new Rect(x, y, 8, 8));
          }
        }
        break;
    }
  }

  private applyAttributeModeTo(rect: Rect): void {
    const map = this.getValueMap(rect);
    const sortedEntries = [...map.entries()].sort((e1, e2) => e2[1] - e1[1]);
    for (let i = 2; i < sortedEntries.length; i++) {
      this.change(rect, sortedEntries[i][0], sortedEntries[0][0]);
    }

  }
}
