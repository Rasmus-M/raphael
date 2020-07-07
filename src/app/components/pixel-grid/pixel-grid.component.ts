import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Point} from '../../classes/point';
import {Rect} from '../../classes/rect';
import {Grid} from '../../classes/grid';
import {Palette} from '../../classes/palette';
import {UndoManagerService} from '../../services/undo-manager.service';
import {CompoundEdit} from '../../classes/CompoundEdit';
import {UndoableEdit} from '../../interfaces/undoable-edit.js';
import {Tool} from '../toolbox/toolbox.component';

@Component({
  selector: 'app-pixel-grid',
  templateUrl: './pixel-grid.component.html',
  styleUrls: ['./pixel-grid.component.less']
})
export class PixelGridComponent implements AfterViewInit, OnChanges {

  static GRID_LINE_WIDTH = 1;
  static GRID_COLOR = 'gray';
  static CURSOR_LINE_WIDTH = 2;
  static CURSOR_COLOR = 'orange';
  static TRANS_COLOR_1 = '#202020';
  static TRANS_COLOR_2 = '#404040';

  @Input() grid: Grid;
  @Input() pixelScaleX: number;
  @Input() pixelScaleY: number;
  @Input() basePixelSize?: number;
  @Input() zoom: number;
  @Input() palette: Palette;
  @Input() backColorIndex: number;
  @Input() foreColorIndex: number;
  @Input() tool: Tool;

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
  private strokeEdit: CompoundEdit;

  constructor(
    private element: ElementRef,
    private undoManagerService: UndoManagerService
  ) {
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
    this.draw();
    this.initialized = true;
    this.grid.subscribeToChanges(this.onGridChanges.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      console.log('Changes received before initialization', changes);
      return;
    }
    if (changes.zoom) {
      this.draw();
    }
  }

  onGridChanges(changes: Rect): void {
    this.drawPixelRect(changes);
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

  draw(): void {
    this.calculateSize([this.pixelCanvas, this.selectionCanvas, this.gridCanvas, this.cursorCanvas]);
    this.drawGrid();
    this.drawPixels();
  }

  drawGrid(): void {
    const context = this.gridCanvasContext;
    context.clearRect(0, 0, this.width, this.height);
    context.strokeStyle = PixelGridComponent.GRID_COLOR;
    for (let i = 0; i <= this.pixelsX; i++) {
      const x = i * this.cellWidth;
      const majorGridLine = (i * this.pixelScaleX) % 8 === 0;
      context.beginPath();
      context.lineWidth = majorGridLine ? PixelGridComponent.GRID_LINE_WIDTH * 2 : PixelGridComponent.GRID_LINE_WIDTH;
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
      context.stroke();
    }
    for (let j = 0; j <= this.pixelsY; j++) {
      const y = j * this.cellHeight;
      const majorGridLine = (j * this.pixelScaleY) % 8 === 0;
      context.beginPath();
      context.lineWidth = majorGridLine ? PixelGridComponent.GRID_LINE_WIDTH * 2 : PixelGridComponent.GRID_LINE_WIDTH;
      context.moveTo(0, y);
      context.lineTo(this.width, y);
      context.stroke();
    }
  }

  drawPixels(): void {
    this.drawPixelRect(new Rect(0, 0, this.pixelsX, this.pixelsY));
  }

  drawPixelRect(rect: Rect): void {
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        const point = new Point(x, y);
        this.drawPixel(point, this.grid.getValue(point));
      }
    }
  }

  drawPixel(point: Point, colorIndex: number): void {
    const context = this.pixelCanvasContext;
    if (colorIndex > 0) {
      this.drawCell(context, point, colorIndex);
    } else {
      const rect = this.getCellRect(point);
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;
      context.fillStyle = PixelGridComponent.TRANS_COLOR_1;
      context.fillRect(rect.x, rect.y, halfWidth, halfHeight);
      context.fillRect(rect.x + halfWidth, rect.y + halfHeight, halfWidth, halfHeight);
      context.fillStyle = PixelGridComponent.TRANS_COLOR_2;
      context.fillRect(rect.x + halfWidth, rect.y, halfWidth, halfHeight);
      context.fillRect(rect.x, rect.y + halfHeight, halfWidth, halfHeight);
    }
  }

  drawCell(context: CanvasRenderingContext2D, point: Point, colorIndex: number): void {
    const rect = this.getCellRect(point);
    context.fillStyle = this.palette.getColor(colorIndex).getHexString();
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  eraseCursor(point: Point): void {
    const rect = this.getCellRect(point);
    const context = this.cursorCanvasContext;
    const lineWidth = PixelGridComponent.CURSOR_LINE_WIDTH;
    context.clearRect(rect.x - (lineWidth / 2), rect.y - (lineWidth / 2), rect.width + lineWidth, rect.height + lineWidth);
  }

  drawCursor(point: Point): void {
    const rect = this.getCellRect(point);
    const context = this.cursorCanvasContext;
    context.strokeStyle = PixelGridComponent.CURSOR_COLOR;
    context.lineWidth = PixelGridComponent.CURSOR_LINE_WIDTH;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  getCellRect(point: Point): Rect {
    const x = point.x * this.cellWidth;
    const y = point.y * this.cellHeight;
    return new Rect(x, y, this.cellWidth, this.cellHeight);
  }

  getGridColorIndex(point: Point): number {
    return this.grid.getValue(point);
  }

  setGridColorIndex(point: Point, value: number): UndoableEdit {
    if (this.getGridColorIndex(point) === value) {
      return null;
    }
    return this.grid.setValue(point, value);
  }

  onMouseClick(): void {
    switch (this.tool) {
      case Tool.DRAW:
        break;
      case Tool.FLOOD_FILL:
        this.grid.floodFill(this.cursorPosition, this.foreColorIndex);
        break;
      case Tool.CLONE:
        break;
      case Tool.TEXT:
        break;
    }
  }

  onMouseDown(evt: MouseEvent): void {
    this.cursorPosition = this.getMousePosition(evt);
    switch (this.tool) {
      case Tool.DRAW:
        this.drawing = true;
        if (evt.button === 0) {
          this.drawColorIndex = this.getGridColorIndex(this.cursorPosition) === this.foreColorIndex ?
            this.backColorIndex : this.foreColorIndex;
        } else {
          this.drawColorIndex = this.getGridColorIndex(this.cursorPosition) === this.backColorIndex ?
            this.foreColorIndex : this.backColorIndex;
        }
        this.strokeEdit = new CompoundEdit();
        this.strokeEdit.addEdit(this.setGridColorIndex(this.cursorPosition, this.drawColorIndex));
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        break;
      case Tool.TEXT:
        break;
    }
  }

  onMouseMove(evt: MouseEvent): void {
    const newCursorPosition = this.getMousePosition(evt);
    if (!newCursorPosition.equals(this.cursorPosition)) {
      this.eraseCursor(this.cursorPosition);
      this.drawCursor(newCursorPosition);
      this.cursorPosition = newCursorPosition;
    }
    switch (this.tool) {
      case Tool.DRAW:
        if (this.drawing) {
          this.strokeEdit.addEdit(this.setGridColorIndex(newCursorPosition, this.drawColorIndex));
        }
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        break;
      case Tool.TEXT:
        break;
    }
  }

  onMouseUp(): void {
    switch (this.tool) {
      case Tool.DRAW:
        this.drawing = false;
        this.undoManagerService.addEdit(this.strokeEdit);
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        break;
      case Tool.TEXT:
        break;
    }
  }

  onMouseLeave(): void {
    this.drawing = false;
  }

  onContextMenu(evt: MouseEvent): void {
    evt.preventDefault();
  }

  getMousePosition(evt: MouseEvent): Point {
    const rect = this.cursorCanvas.getBoundingClientRect();
    return new Point(
      Math.floor(this.pixelsX * (evt.clientX - rect.left) / this.cursorCanvas.clientWidth),
      Math.floor(this.pixelsY * (evt.clientY - rect.top) / this.cursorCanvas.clientHeight)
    );
  }
}
