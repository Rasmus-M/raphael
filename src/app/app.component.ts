import { Component } from '@angular/core';
import {Grid} from './classes/grid';
import {Palette} from './classes/palette';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  grid: Grid;
  palette: Palette;
  backColorIndex: number;
  foreColorIndex: number;

  constructor() {
    this.backColorIndex = 0;
    this.foreColorIndex = 4;
    this.grid = new Grid(64, 64, this.backColorIndex);
    this.palette = new Palette();
  }

  setBackColorIndex(backColorIndex: number): void {
    this.backColorIndex = backColorIndex;
  }

  setForeColorIndex(foreColorIndex: number): void {
    this.foreColorIndex = foreColorIndex;
  }
}
