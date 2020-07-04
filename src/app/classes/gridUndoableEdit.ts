import {UndoableEdit} from '../interfaces/undoable-edit.js';
import {Grid} from './grid';
import {Rect} from './rect';

export class GridUndoableEdit implements UndoableEdit {

  private grid: Grid;
  private rect: Rect;
  private data: number[][];

  constructor(grid: Grid, rect: Rect, oldData: number[][]) {
    this.grid = grid;
    this.rect = rect;
    this.data = oldData;
  }

  undo(): void {
    const newData = this.grid.getArea(this.rect);
    this.grid.setArea(this.rect, this.data);
    this.data = newData;
  }

  redo(): void {
    this.undo();
  }
}
