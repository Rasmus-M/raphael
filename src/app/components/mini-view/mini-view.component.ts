import {Component, Input, AfterViewInit, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {Grid} from '../../classes/grid';
import {Rect} from '../../classes/rect';
import {Palette} from '../../classes/palette';
import {Point} from '../../classes/point';

@Component({
  selector: 'app-mini-view',
  templateUrl: './mini-view.component.html',
  styleUrls: ['./mini-view.component.less']
})
export class MiniViewComponent implements AfterViewInit, OnChanges {

  @Input() imageNumber: number;
  @Input() grid: Grid;
  @Input() pixelScaleX: number;
  @Input() pixelScaleY: number;
  @Input() palette: Palette;

  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private initialized = false;

  constructor(
    private element: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.container = this.element.nativeElement.querySelector('.mini-view-container');
    this.canvas = this.element.nativeElement.querySelector('.mini-view');
    this.context = this.canvas.getContext('2d');
    this.init();
    this.grid.subscribeToChanges(this.onGridChanges.bind(this));
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      if (changes.imageNumber) {
        this.init();
      }
    }
  }

  init(): void {
    this.canvas.width = this.grid.width * this.pixelScaleX;
    this.canvas.height = this.grid.height * this.pixelScaleY;
    this.draw(new Rect(0, 0, this.grid.width, this.grid.height));
    this.resize();
  }

  resize(): void {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const relativeWidth = Math.floor(Math.min(aspectRatio, 1) * 100);
    this.canvas.style.width = relativeWidth + '%';
  }

  onGridChanges(changes: Rect): void {
    this.draw(changes);
  }

  draw(rect: Rect): void {
    const imageData = this.context.createImageData(rect.width * this.pixelScaleX, rect.height * this.pixelScaleY);
    const data = imageData.data;
    let i = 0;
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let ys = 0; ys < this.pixelScaleY; ys++) {
        for (let x = rect.x; x < rect.x + rect.width; x++) {
          const colorIndex = this.grid.getValue(new Point(x, y));
          const color = this.palette.getColor(colorIndex);
          for (let xs = 0; xs < this.pixelScaleX; xs++) {
            data[i++] = color.red;
            data[i++] = color.green;
            data[i++] = color.blue;
            data[i++] = 255;
          }
        }
      }
    }
    this.context.putImageData(imageData, rect.x * this.pixelScaleX, rect.y * this.pixelScaleY);
  }
}
