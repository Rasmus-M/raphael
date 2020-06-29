import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Point} from '../classes/Point';
import {Rect} from '../classes/rect';

@Component({
  selector: 'app-pixel-grid',
  templateUrl: './pixel-grid.component.html',
  styleUrls: ['./pixel-grid.component.less']
})
export class PixelGridComponent implements OnInit, AfterViewInit {

  static GRID_LINE_WIDTH = 1;

  @Input() pixelsX: number;
  @Input() pixelsY: number;
  @Input() pixelScaleX: number;
  @Input() pixelScaleY: number;
  @Input() basePixelSize?: number;
  @Input() zoom?: number;
  @Input() foregroundColor: string;
  @Input() backgroundColor: string;

  private gridCanvasContext: CanvasRenderingContext2D;
  private pixelCanvasContext: CanvasRenderingContext2D;
  private selectionCanvasContext: CanvasRenderingContext2D;
  private cursorCanvasContext: CanvasRenderingContext2D;
  private cursorCanvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private cellWidth: number;
  private cellHeight: number;
  private cursorPosition: Point;
  private drawing: boolean;
  private drawColor: string;

  constructor(
    private element: ElementRef,
  ) {
    this.cursorPosition = new Point(-1, -1);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const gridCanvas: HTMLCanvasElement = this.element.nativeElement.querySelector('#grid-canvas');
    this.gridCanvasContext = gridCanvas.getContext('2d');
    const pixelCanvas: HTMLCanvasElement = this.element.nativeElement.querySelector('#pixel-canvas');
    this.pixelCanvasContext = pixelCanvas.getContext('2d');
    const selectionCanvas: HTMLCanvasElement = this.element.nativeElement.querySelector('#selection-canvas');
    this.selectionCanvasContext = selectionCanvas.getContext('2d');
    const cursorCanvas: HTMLCanvasElement = this.element.nativeElement.querySelector('#cursor-canvas');
    this.cursorCanvasContext = cursorCanvas.getContext('2d');
    this.cursorCanvas = cursorCanvas;
    this.calculateSize([gridCanvas, pixelCanvas, selectionCanvas, cursorCanvas]);
    this.redraw();
  }

  calculateSize(canvases: HTMLCanvasElement[]): void {
    const cellWidth = this.cellWidth = this.basePixelSize * this.pixelScaleX * this.zoom;
    const cellHeight = this.cellHeight = this.basePixelSize * this.pixelScaleY * this.zoom;
    const width = this.width = this.pixelsX * cellWidth + (this.pixelsX + 1) * PixelGridComponent.GRID_LINE_WIDTH;
    const height = this.height = this.pixelsY * cellHeight + (this.pixelsY + 1) * PixelGridComponent.GRID_LINE_WIDTH;
    for (const canvas of canvases) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  redraw(): void {
    this.drawGrid();
  }

  drawGrid(): void {
    const context = this.gridCanvasContext;
    context.strokeStyle = 'grey';
    context.lineWidth = PixelGridComponent.GRID_LINE_WIDTH;
    context.beginPath();
    for (let i = 0; i <= this.pixelsX; i++) {
      const x = i * (this.cellWidth + PixelGridComponent.GRID_LINE_WIDTH);
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    for (let j = 0; j <= this.pixelsY; j++) {
      const y = j * (this.cellHeight + PixelGridComponent.GRID_LINE_WIDTH);
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }
    context.stroke();
  }

  drawPixel(point: Point, color: string): void {
    this.drawCell(this.pixelCanvasContext, point, color);
  }

  drawCell(context: CanvasRenderingContext2D, point: Point, color: string): void {
    const rect = this.getCellRect(point);
    context.fillStyle = color;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  drawCursor(point: Point, color: string): void {
    const rect = this.getCellRect(point);
    this.cursorCanvasContext.strokeStyle = color;
    this.cursorCanvasContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  getCellRect(point: Point): Rect {
    const x = PixelGridComponent.GRID_LINE_WIDTH + point.x * (this.cellWidth + PixelGridComponent.GRID_LINE_WIDTH);
    const y = PixelGridComponent.GRID_LINE_WIDTH + point.y * (this.cellHeight + PixelGridComponent.GRID_LINE_WIDTH);
    return new Rect(x, y, this.cellWidth, this.cellHeight);
  }

  onMouseMove(evt: MouseEvent): void {
    const rect = this.cursorCanvas.getBoundingClientRect();
    const newCursorPosition = new Point(
      Math.floor(this.pixelsX * (evt.clientX - rect.left) / this.cursorCanvas.clientWidth),
      Math.floor(this.pixelsY * (evt.clientY - rect.top) / this.cursorCanvas.clientHeight)
    );
    if (!newCursorPosition.equals(this.cursorPosition)) {
      this.cursorCanvasContext.clearRect(0, 0, this.width, this.height);
      this.drawCursor(newCursorPosition, 'pink');
      this.cursorPosition = newCursorPosition;
    }
    if (this.drawing) {
      this.drawPixel(this.cursorPosition, this.drawColor);
    }
  }

  onMouseDown(evt: MouseEvent): void {
    this.drawing = true;
    this.drawColor = this.foregroundColor;
  }

  onMouseUp(evt: MouseEvent): void {
    this.drawing = false;
  }
}
