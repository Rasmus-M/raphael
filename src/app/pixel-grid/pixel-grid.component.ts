import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Point} from '../classes/point';
import {Rect} from '../classes/rect';
import {Grid} from '../classes/grid';
import {Palette} from '../classes/palette';

@Component({
  selector: 'app-pixel-grid',
  templateUrl: './pixel-grid.component.html',
  styleUrls: ['./pixel-grid.component.less']
})
export class PixelGridComponent implements AfterViewInit, OnChanges {

  static GRID_LINE_WIDTH = 1;

  @Input() grid: Grid;
  @Input() pixelScaleX: number;
  @Input() pixelScaleY: number;
  @Input() basePixelSize?: number;
  @Input() zoom: number;
  @Input() palette: Palette;
  @Input() backColorIndex: number;
  @Input() foreColorIndex: number;

  private pixelsX: number;
  private pixelsY: number;
  private pixelCanvas: HTMLCanvasElement;
  private selectionCanvas: HTMLCanvasElement;
  private gridCanvas: HTMLCanvasElement;
  private cursorCanvas: HTMLCanvasElement;
  private pixelCanvasContext: CanvasRenderingContext2D;
  private selectionCanvasContext: CanvasRenderingContext2D;
  private gridCanvasContext: CanvasRenderingContext2D;
  private cursorCanvasContext: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private cellWidth: number;
  private cellHeight: number;
  private cursorPosition: Point;
  private drawing: boolean;
  private drawColorIndex: number;
  private initialized = false;

  constructor(private element: ElementRef) {
    this.cursorPosition = new Point(-1, -1);
  }

  ngAfterViewInit(): void {
    this.basePixelSize = this.basePixelSize || 8;
    this.zoom = this.zoom || 1;
    this.pixelsX = this.grid.width;
    this.pixelsY = this.grid.height;
    this.pixelCanvas = this.element.nativeElement.querySelector('#pixel-canvas');
    this.pixelCanvasContext = this.pixelCanvas.getContext('2d');
    this.selectionCanvas = this.element.nativeElement.querySelector('#selection-canvas');
    this.selectionCanvasContext = this.selectionCanvas.getContext('2d');
    this.gridCanvas = this.element.nativeElement.querySelector('#grid-canvas');
    this.gridCanvasContext = this.gridCanvas.getContext('2d');
    this.cursorCanvas = this.element.nativeElement.querySelector('#cursor-canvas');
    this.cursorCanvasContext = this.cursorCanvas.getContext('2d');
    this.redraw();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.initialized) {
      this.redraw();
    }
  }

  calculateSize(canvases: HTMLCanvasElement[]): void {
    const cellWidth = this.cellWidth = this.basePixelSize * this.pixelScaleX * this.zoom;
    const cellHeight = this.cellHeight = this.basePixelSize * this.pixelScaleY * this.zoom;
    const width = this.width = this.pixelsX * cellWidth + PixelGridComponent.GRID_LINE_WIDTH;
    const height = this.height = this.pixelsY * cellHeight + PixelGridComponent.GRID_LINE_WIDTH;
    for (const canvas of canvases) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  redraw(): void {
    this.calculateSize([this.pixelCanvas, this.selectionCanvas, this.gridCanvas, this.cursorCanvas]);
    this.drawPixels();
    this.drawGrid();
  }

  drawPixels(): void {
    this.pixelCanvasContext.clearRect(0, 0, this.width, this.height);
    for (let y = 0; y < this.pixelsY; y++) {
      for (let x = 0; x < this.pixelsX; x++) {
        const point = new Point(x, y);
        this.drawPixel(point, this.grid.get(point));
      }
    }
  }

  drawGrid(): void {
    const context = this.gridCanvasContext;
    context.clearRect(0, 0, this.width, this.height);
    context.strokeStyle = 'grey';
    context.lineWidth = PixelGridComponent.GRID_LINE_WIDTH;
    context.beginPath();
    for (let i = 0; i <= this.pixelsX; i++) {
      const x = i * this.cellWidth;
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    for (let j = 0; j <= this.pixelsY; j++) {
      const y = j * this.cellHeight;
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }
    context.stroke();
  }

  drawPixel(point: Point, colorIndex: number): void {
    this.drawCell(this.pixelCanvasContext, point, colorIndex);
    this.setGridColorIndex(point, colorIndex);
  }

  drawCell(context: CanvasRenderingContext2D, point: Point, colorIndex: number): void {
    const rect = this.getCellRect(point);
    context.fillStyle = this.palette.getColor(colorIndex).getHexString();
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  drawCursor(point: Point, color: string): void {
    const rect = this.getCellRect(point);
    const context = this.cursorCanvasContext;
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  getCellRect(point: Point): Rect {
    const x = point.x * this.cellWidth;
    const y = point.y * this.cellHeight;
    return new Rect(x, y, this.cellWidth, this.cellHeight);
  }

  getGridColorIndex(point: Point): number {
    return this.grid.get(point);
  }

  setGridColorIndex(point: Point, value: number): void {
    this.grid.set(point, value);
  }

  onMouseMove(evt: MouseEvent): void {
    const newCursorPosition = this.getMousePosition(evt);
    if (!newCursorPosition.equals(this.cursorPosition)) {
      this.cursorCanvasContext.clearRect(0, 0, this.width, this.height);
      this.drawCursor(newCursorPosition, 'orange');
      this.cursorPosition = newCursorPosition;
    }
    if (this.drawing) {
      this.drawPixel(this.cursorPosition, this.drawColorIndex);
    }
  }

  onMouseDown(evt: MouseEvent): void {
    this.drawing = true;
    this.cursorPosition = this.getMousePosition(evt);
    this.drawColorIndex = this.getGridColorIndex(this.cursorPosition) === this.foreColorIndex ? this.backColorIndex : this.foreColorIndex;
    this.drawPixel(this.cursorPosition, this.drawColorIndex);
  }

  onMouseUp(evt: MouseEvent): void {
    this.drawing = false;
  }

  onMouseLeave(evt: MouseEvent): void {
    this.drawing = false;
  }

  getMousePosition(evt: MouseEvent): Point {
    const rect = this.cursorCanvas.getBoundingClientRect();
    return new Point(
      Math.floor(this.pixelsX * (evt.clientX - rect.left) / this.cursorCanvas.clientWidth),
      Math.floor(this.pixelsY * (evt.clientY - rect.top) / this.cursorCanvas.clientHeight)
    );
  }
}
