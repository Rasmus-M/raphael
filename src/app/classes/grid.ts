import {Point} from './point';
import {Rect} from './rect';
import {Observable, Subject, Subscription} from 'rxjs';
import {UndoableEdit} from '../interfaces/undoable-edit.js';
import {GridUndoableEdit} from './gridUndoableEdit';
import {AttributeMode} from '../enums/attribute-mode';
import {PixelRenderer} from './pixelRenderer';

export class Grid {

  private _width: number;
  private _height: number;
  private _attributeMode = AttributeMode.NONE;

  private data: number[][];

  private changeSubject: Subject<Rect> = new Subject<Rect>();
  private changeObservable: Observable<Rect> = this.changeSubject.asObservable();

  constructor() {
    this.setSize(1, 1, 0);
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

  set attributeMode(attributeMode: AttributeMode) {
    this._attributeMode = attributeMode;
  }

  getData(): number[][] {
    return this.data;
  }

  setData(data: number[][]): void {
    this.data = data;
  }

  getSize(): Rect {
    return new Rect(0, 0, this.width, this.height);
  }

  setSize(width: number, height: number, initialValue: number): void {
    this._width = width;
    this._height = height;
    this.data = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row[x] = initialValue;
      }
      this.data[y] = row;
    }
  }

  getArea(rect: Rect): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < rect.height; i++) {
      data.push([]);
    }
    for (const point of rect) {
      data[point.y - rect.y][point.x - rect.x] = this.get(point);
    }
    return data;
  }

  setArea(rect: Rect, data: number[][], transparentIndexZero?: boolean): UndoableEdit {
    rect.clipTo(this.getSize());
    const oldData = this.getArea(rect);
    for (const point of rect) {
      const value = data[point.y - rect.y][point.x - rect.x];
      if (!transparentIndexZero || value !== 0) {
        this.set(point, value);
      }
    }
    this.applyAttributeMode();
    this.notifyChanges(rect);
    return new GridUndoableEdit(this, rect, oldData);
  }

  getValue(point: Point): number {
    return this.get(point);
  }

  setValue(point: Point, value: number): UndoableEdit {
    let undoableEdit: UndoableEdit;
    const oldValue = this.getValue(point);
    const pixelRect = new Rect(point.x, point.y, 1, 1);
    switch (this.attributeMode) {
      case AttributeMode.NONE: {
        const oldData = this.getArea(pixelRect);
        this.set(point, value);
        this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        undoableEdit = new GridUndoableEdit(this, pixelRect, oldData);
        break;
      }
      case AttributeMode.EIGHT_X_ONE: {
        const x0 = point.x - (point.x % 8);
        const y0 = point.y;
        const rect = new Rect(x0, y0, 8, 1);
        const oldData = this.getArea(rect);
        this.set(point, value);
        const valueMap = this.getValueMap(rect);
        if (valueMap.size <= 2) {
          this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        // } else if (valueMap.get(oldValue) > 4) {
        //   for (const key of valueMap.keys()) {
        //     if (key !== value && key !== oldValue) {
        //       this.change(rect, key, value);
        //     }
        //   }
        } else {
          this.change(rect, oldValue, value);
        }
        undoableEdit = new GridUndoableEdit(this, rect, oldData);
        break;
      }
      case AttributeMode.EIGHT_X_EIGHT: {
        const x0 = point.x - (point.x % 8);
        const y0 = point.y - (point.y % 8);
        const rect = new Rect(x0, y0, 8, 8);
        const oldData = this.getArea(rect);
        this.set(point, value);
        const valueMap = this.getValueMap(rect);
        if (valueMap.size <= 2) {
          this.notifyChanges(new Rect(point.x, point.y, 1, 1));
        // } else if (valueMap.get(oldValue) > 32) {
        //   for (const key of valueMap.keys()) {
        //     if (key !== value && key !== oldValue) {
        //       this.change(rect, key, value);
        //     }
        //   }
        } else {
          this.change(rect, oldValue, value);
        }
        undoableEdit = new GridUndoableEdit(this, rect, oldData);
        break;
      }
    }
    return undoableEdit;
  }

  fill(value: number): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    for (const point of this.getSize()) {
      this.set(point, value);
    }
    this.notifyChanges(this.getSize());
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  floodFill(point: Point, newValue: number): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    const oldValue = this.getValue(point);
    this.floodFillValue(point.x, point.y, newValue, oldValue);
    this.applyAttributeMode();
    this.notifyChanges(this.getSize());
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  drawLine(point1: Point, point2: Point, value: number): UndoableEdit {
    const rect = Rect.fromPoints(point1, point2);
    const oldData = this.getArea(rect);
    PixelRenderer.drawLine(point1, point2, (point: Point) => {
      this.set(point, value);
    });
    this.applyAttributeMode();
    this.notifyChanges(rect);
    return new GridUndoableEdit(this, rect, oldData);
  }

  drawRectangle(point1: Point, point2: Point, value: number): UndoableEdit {
    const rect = Rect.fromPoints(point1, point2);
    const oldData = this.getArea(rect);
    PixelRenderer.drawRectangle(point1, point2, (point: Point) => {
      this.set(point, value);
    });
    this.applyAttributeMode();
    this.notifyChanges(rect);
    return new GridUndoableEdit(this, rect, oldData);
  }

  drawCircle(point1: Point, point2: Point, value: number): UndoableEdit {
    const rect = Rect.fromPoints(point1, point2);
    const oldData = this.getArea(rect);
    PixelRenderer.drawEllipse(point1, point2, (point: Point) => {
      this.set(point, value);
    });
    this.applyAttributeMode();
    this.notifyChanges(rect);
    return new GridUndoableEdit(this, rect, oldData);
  }

  flipHorizontal(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      for (let x = this.width - 2; x >= 0; x--) {
        const value = row.splice(x, 1)[0];
        row.push(value);
      }
    }
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  flipVertical(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    for (let y = this.height - 2; y >= 0; y--) {
      const row = this.data.splice(y, 1)[0];
      this.data.push(row);
    }
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  shiftLeft(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const firstCell = row.shift();
      row.push(firstCell);
    }
    if (this.attributeMode !== AttributeMode.NONE) {
      this.applyAttributeMode();
    }
    this.notifyChanges(this.getSize());
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  shiftRight(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    for (let y = 0; y < this.height; y++) {
      const row = this.data[y];
      const lastCell = row.pop();
      row.unshift(lastCell);
    }
    if (this.attributeMode !== AttributeMode.NONE) {
      this.applyAttributeMode();
    }
    this.notifyChanges(this.getSize());
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  shiftUp(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    const firstRow = this.data.shift();
    this.data.push(firstRow);
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  shiftDown(): UndoableEdit {
    const oldData = this.getArea(this.getSize());
    const lastRow = this.data.pop();
    this.data.unshift(lastRow);
    this.notifyChanges(this.getSize());
    if (this.attributeMode === AttributeMode.EIGHT_X_EIGHT) {
      this.applyAttributeMode();
    }
    return new GridUndoableEdit(this, this.getSize(), oldData);
  }

  subscribeToChanges(handler: (Rect) => void): Subscription {
    return this.changeObservable.subscribe(handler);
  }

  private notifyChanges(rect: Rect): void {
    this.changeSubject.next(rect);
  }

  private get(point: Point): number {
    return this.data[point.y][point.x];
  }

  private set(point: Point, value: number): void {
    this.data[point.y][point.x] = value;
  }

  private floodFillValue(x: number, y: number, newValue: number, oldValue: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    const point = new Point(x, y);
    if (this.get(point) === oldValue) {
      this.set(point, newValue);
      this.floodFillValue(x - 1, y, newValue, oldValue);
      this.floodFillValue(x + 1, y, newValue, oldValue);
      this.floodFillValue(x, y - 1, newValue, oldValue);
      this.floodFillValue(x, y + 1, newValue, oldValue);
    }
  }

  private getValueMap(rect: Rect): Map<number, number> {
    const map = new Map<number, number>();
    for (const point of rect) {
      const value = this.get(point);
      map.set(value, map.get(value) ? map.get(value) + 1 : 1);
    }
    return map;
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

  private change(rect: Rect, oldValue: number, newValue): void {
    let anyChanges = false;
    for (const point of rect) {
      if (this.get(point) === oldValue) {
        this.set(point, newValue);
        anyChanges = true;
      }
    }
    if (anyChanges) {
      this.notifyChanges(rect);
    }
  }
}
