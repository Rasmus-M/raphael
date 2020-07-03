import {Component, ViewChild} from '@angular/core';
import {Grid} from './classes/grid';
import {Palette} from './classes/palette';
import {PixelGridComponent} from './pixel-grid/pixel-grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  grid: Grid;
  pixelScaleX: number;
  pixelScaleY: number;
  zoom: number;
  palette: Palette;
  backColorIndex: number;
  foreColorIndex: number;

  @ViewChild(PixelGridComponent)
  private pixelGridComponent: PixelGridComponent;

  constructor() {
    this.backColorIndex = 0;
    this.foreColorIndex = 4;
    this.grid = new Grid(16, 64, this.backColorIndex);
    this.pixelScaleX = 4;
    this.pixelScaleY = 1;
    this.zoom = 1;
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
    const clone = this.grid.clone();
    clone.shiftLeft();
    this.grid = clone;
  }

  shiftRight(): void {
    const clone = this.grid.clone();
    clone.shiftRight();
    this.grid = clone;
  }

  shiftUp(): void {
    const clone = this.grid.clone();
    clone.shiftUp();
    this.grid = clone;
  }

  shiftDown(): void {
    const clone = this.grid.clone();
    clone.shiftDown();
    this.grid = clone;
  }

  setBackColorIndex(backColorIndex: number): void {
    this.backColorIndex = backColorIndex;
  }

  setForeColorIndex(foreColorIndex: number): void {
    this.foreColorIndex = foreColorIndex;
  }
}
