import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Point} from '../../classes/point';
import {Rect} from '../../classes/rect';
import {Grid} from '../../classes/grid';
import {Palette} from '../../classes/palette';
import {UndoManagerService} from '../../services/undo-manager.service';
import {CompoundEdit} from '../../classes/CompoundEdit';
import {UndoableEdit} from '../../interfaces/undoable-edit.js';
import {Tool} from '../../enums/tool';
import {PixelRenderer} from '../../classes/pixelRenderer';

@Component({
  selector: 'app-pixel-grid',
  templateUrl: './pixel-grid.component.html',
  styleUrls: ['./pixel-grid.component.less']
})
export class PixelGridComponent implements AfterViewInit, OnChanges {

  static GRID_LINE_WIDTH = 1;
  static GRID_COLOR = 'gray';
  static CURSOR_LINE_WIDTH = 2;
  static CURSOR_COLOR = '#ff8000';
  static TRANS_COLOR_1 = '#202020';
  static TRANS_COLOR_2 = '#404040';
  static SELECTION_COLOR = '#ff800080';
  static ZOOM_FACTORS = [1.0, 1.25, 1.50, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0];

  @Input() imageNumber: number;
  @Input() grid: Grid;
  @Input() pixelScaleX: number;
  @Input() pixelScaleY: number;
  @Input() basePixelSize?: number;
  @Input() zoom: number;
  @Input() palette: Palette;
  @Input() backColorIndex: number;
  @Input() foreColorIndex: number;
  @Input() tool: Tool;
  @Input() showGridLines: boolean;

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
  private anchorPosition: Point;
  private drawing: boolean;
  private drawColorIndex: number;
  private cloning: boolean;
  private cloneRect: Rect;
  private cloneData: number[][];
  private initialized = false;
  private strokeEdit: CompoundEdit;

  constructor(
    private element: ElementRef,
    private undoManagerService: UndoManagerService
  ) {
    this.cursorPosition = new Point(-1, -1);
  }

  get pixelsX(): number {
    return this.grid.width;
  }

  get pixelsY(): number {
    return this.grid.height;
  }

  ngAfterViewInit(): void {
    this.basePixelSize = this.basePixelSize || 4;
    this.zoom = this.zoom || 1;
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
    if (this.initialized) {
      if (
        changes.imageNumber ||
        changes.pixelScaleX ||
        changes.pixelScaleY ||
        changes.basePixelSize ||
        changes.zoom ||
        changes.showGridLines
      ) {
        this.draw();
      }
      if (changes.tool) {
        this.drawing = false;
        this.cloning = false;
        this.clearSelectionLayer();
      }
    }
  }

  onGridChanges(changes: Rect): void {
    this.drawPixelRect(changes);
  }

  draw(): void {
    this.calculateSize([this.pixelCanvas, this.selectionCanvas, this.gridCanvas, this.cursorCanvas]);
    if (this.showGridLines) {
      this.drawGrid();
    }
    this.drawPixels();
  }

  calculateSize(canvases: HTMLCanvasElement[]): void {
    const zoomFactor = PixelGridComponent.ZOOM_FACTORS[this.zoom - 1];
    const cellWidth = this.cellWidth = this.basePixelSize * this.pixelScaleX * zoomFactor;
    const cellHeight = this.cellHeight = this.basePixelSize * this.pixelScaleY * zoomFactor;
    const width = this.width = this.pixelsX * cellWidth + PixelGridComponent.GRID_LINE_WIDTH;
    const height = this.height = this.pixelsY * cellHeight + PixelGridComponent.GRID_LINE_WIDTH;
    for (const canvas of canvases) {
      canvas.width = width;
      canvas.height = height;
    }
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
    for (const point of rect) {
      this.drawPixel(point, this.grid.getValue(point));
    }
  }

  drawPixel(point: Point, colorIndex: number): void {
    const context = this.pixelCanvasContext;
    if (colorIndex > 0) {
      this.drawCell(context, point, this.palette.getColor(colorIndex).getHexString());
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

  drawCell(context: CanvasRenderingContext2D, point: Point, color: string): void {
    const rect = this.getCellRect(point);
    context.fillStyle = color;
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

  drawSelectionRect(point1: Point, point2: Point): void {
    const context = this.selectionCanvasContext;
    const rect = Rect.fromPoints(point1, point2);
    for (const point of rect) {
      if (point.x < this.pixelsX && point.y < this.pixelsY) {
        this.drawCell(context, point, PixelGridComponent.SELECTION_COLOR);
      }
    }
  }

  drawSelectionRectangle(point1: Point, point2: Point): void {
    const context = this.selectionCanvasContext;
    PixelRenderer.drawRectangle(point1, point2, (point: Point) => {
      this.drawCell(context, point, PixelGridComponent.SELECTION_COLOR);
    });
  }

  drawSelectionLine(point1: Point, point2: Point): void {
    const context = this.selectionCanvasContext;
    PixelRenderer.drawLine(point1, point2, (point: Point) => {
      this.drawCell(context, point, PixelGridComponent.SELECTION_COLOR);
    });
  }

  drawSelectionCircle(point1: Point, point2: Point): void {
    const context = this.selectionCanvasContext;
    PixelRenderer.drawEllipse(point1, point2, (point: Point) => {
      this.drawCell(context, point, PixelGridComponent.SELECTION_COLOR);
    });
  }

  clearSelectionLayer(): void {
    this.selectionCanvasContext.clearRect(0, 0, this.width, this.height);
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
      case Tool.LINE:
      case Tool.RECTANGLE:
      case Tool.CIRCLE:
        break;
      case Tool.FLOOD_FILL:
        this.undoManagerService.addEdit(
          this.grid.floodFill(this.cursorPosition, this.foreColorIndex)
        );
        break;
      case Tool.CLONE:
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
      case Tool.LINE:
      case Tool.RECTANGLE:
      case Tool.CIRCLE:
        this.drawing = true;
        this.drawColorIndex = evt.button === 0 ? this.foreColorIndex : this.backColorIndex;
        this.anchorPosition = this.cursorPosition;
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        if (!this.drawing && !this.cloning) {
          this.drawing = true;
          this.anchorPosition = this.cursorPosition;
        } else if (this.cloning) {
          this.clearSelectionLayer();
          if (evt.button === 0) {
            const rect = new Rect(this.cursorPosition.x, this.cursorPosition.y, this.cloneRect.width, this.cloneRect.height);
            this.undoManagerService.addEdit(
              this.grid.setArea(rect, this.cloneData, evt.ctrlKey)
            );
          }
          if (!evt.shiftKey) {
            this.cloning = false;
          }
        }
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
      case Tool.LINE:
        if (this.drawing) {
          this.clearSelectionLayer();
          this.drawSelectionLine(this.anchorPosition, this.cursorPosition);
        }
        break;
      case Tool.RECTANGLE:
        if (this.drawing) {
          this.clearSelectionLayer();
          this.drawSelectionRectangle(this.anchorPosition, this.cursorPosition);
        }
        break;
      case Tool.CIRCLE:
        if (this.drawing) {
          this.clearSelectionLayer();
          this.drawSelectionCircle(this.anchorPosition, this.cursorPosition);
        }
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        this.clearSelectionLayer();
        if (this.drawing) {
          this.drawSelectionRect(this.anchorPosition, this.cursorPosition);
        } else if (this.cloning) {
          this.drawSelectionRect(this.cursorPosition,
            new Point(this.cursorPosition.x + this.cloneRect.width - 1, this.cursorPosition.y + this.cloneRect.height - 1)
          );
        }
        break;
    }
  }

  onMouseUp(evt: MouseEvent): void {
    const newCursorPosition = this.getMousePosition(evt);
    switch (this.tool) {
      case Tool.DRAW:
        this.drawing = false;
        this.undoManagerService.addEdit(this.strokeEdit);
        break;
      case Tool.LINE:
        this.drawing = false;
        this.clearSelectionLayer();
        this.undoManagerService.addEdit(
          this.grid.drawLine(this.anchorPosition, newCursorPosition, this.drawColorIndex)
        );
        break;
      case Tool.RECTANGLE:
        this.drawing = false;
        this.clearSelectionLayer();
        this.undoManagerService.addEdit(
          this.grid.drawRectangle(this.anchorPosition, newCursorPosition, this.drawColorIndex)
        );
        break;
      case Tool.CIRCLE:
        this.drawing = false;
        this.clearSelectionLayer();
        this.undoManagerService.addEdit(
          this.grid.drawCircle(this.anchorPosition, newCursorPosition, this.drawColorIndex)
        );
        break;
      case Tool.FLOOD_FILL:
        break;
      case Tool.CLONE:
        if (this.drawing) {
          this.drawing = false;
          this.cloneRect = Rect.fromPoints(this.anchorPosition, this.cursorPosition);
          this.cloneData = this.grid.getArea(this.cloneRect);
          this.cloning = true;
        }
        break;
    }
  }

  onMouseLeave(): void {
    if (this.tool === Tool.DRAW) {
      this.drawing = false;
    }
  }

  onContextMenu(evt: MouseEvent): void {
    switch (this.tool) {
      case Tool.DRAW:
      case Tool.LINE:
      case Tool.RECTANGLE:
      case Tool.CIRCLE:
        break;
      case Tool.FLOOD_FILL:
        this.undoManagerService.addEdit(
          this.grid.floodFill(this.cursorPosition, this.backColorIndex)
        );
        break;
      case Tool.CLONE:
        break;
    }
    evt.preventDefault();
  }

  getMousePosition(evt: MouseEvent): Point {
    const rect = this.cursorCanvas.getBoundingClientRect();
    const x = Math.floor(this.pixelsX * (evt.clientX - rect.left) / this.cursorCanvas.clientWidth);
    const y = Math.floor(this.pixelsY * (evt.clientY - rect.top) / this.cursorCanvas.clientHeight);
    return new Point(Math.max(x, 0), Math.max(y, 0));
  }
}
