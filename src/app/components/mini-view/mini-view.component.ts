import {Component, Input, AfterViewInit, ElementRef} from '@angular/core';
import {Grid} from '../../classes/grid';
import {Rect} from '../../classes/rect';
import {Palette} from '../../classes/palette';
import {Point} from '../../classes/point';

@Component({
  selector: 'app-mini-view',
  templateUrl: './mini-view.component.html',
  styleUrls: ['./mini-view.component.less']
})
export class MiniViewComponent implements AfterViewInit {

  @Input() grid: Grid;
  @Input() palette: Palette;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private initialized = false;

  constructor(
    private element: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.canvas = this.element.nativeElement.querySelector('canvas');
    this.canvas.width = this.grid.width;
    this.canvas.height = this.grid.height;
    this.context = this.canvas.getContext('2d');
    this.draw(new Rect(0, 0, this.canvas.width, this.canvas.height));
    this.grid.subscribeToChanges(this.onGridChanges.bind(this));
    this.initialized = true;
  }

  draw(rect: Rect): void {
    const imageData = this.context.createImageData(rect.width, rect.height);
    const data = imageData.data;
    let i = 0;
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        const colorIndex = this.grid.getValue(new Point(x, y));
        const color = this.palette.getColor(colorIndex);
        data[i++] = color.red;
        data[i++] = color.green;
        data[i++] = color.blue;
        data[i++] = 255;
      }
    }
    console.log(imageData);
    this.context.putImageData(imageData, rect.x, rect.y);
  }

  onGridChanges(changes: Rect): void {
    if (this.initialized) {
      this.draw(changes);
    }
  }
}
