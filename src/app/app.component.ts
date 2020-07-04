import {Component} from '@angular/core';
import {AttributeMode, Grid} from './classes/grid';
import {Palette} from './classes/palette';
import {UndoManagerService} from './services/undo-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  grid: Grid;
  gridWidth: number;
  gridHeight: number;
  pixelScaleX: number;
  pixelScaleY: number;
  zoom: number;
  palette: Palette;
  backColorIndex: number;
  foreColorIndex: number;

  constructor(
    private undoManagerService: UndoManagerService
  ) {
    this.backColorIndex = 0;
    this.foreColorIndex = 4;
    this.gridWidth = 64;
    this.gridHeight = 64;
    this.grid = new Grid(this.gridWidth, this.gridHeight, AttributeMode.EIGHT_X_ONE, this.backColorIndex);
    this.pixelScaleX = this.gridHeight / this.gridWidth;
    this.pixelScaleY = 1;
    this.zoom = 2;
    this.palette = new Palette();
  }

  zoomIn(): void {
    if (this.zoom < 16) {
      this.zoom++;
    }
  }

  zoomOut(): void {
    if (this.zoom > 1) {
      this.zoom--;
    }
  }

  shiftLeft(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftLeft()
    );
  }

  shiftRight(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftRight()
    );
  }

  shiftUp(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftUp()
    );
  }

  shiftDown(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftDown()
    );
  }

  fill(): void {
    this.undoManagerService.addEdit(
      this.grid.fill(this.foreColorIndex)
    );
  }

  clear(): void {
    this.undoManagerService.addEdit(
      this.grid.fill(this.backColorIndex)
    );
  }

  setBackColorIndex(backColorIndex: number): void {
    this.backColorIndex = backColorIndex;
  }

  setForeColorIndex(foreColorIndex: number): void {
    this.foreColorIndex = foreColorIndex;
  }
}
