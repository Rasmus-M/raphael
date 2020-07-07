import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faFill, faEraser, faFillDrip, faPencilAlt, faClone, faFont} from '@fortawesome/free-solid-svg-icons';
import {UndoManagerService, UndoManagerStatus} from '../../services/undo-manager.service';
import {Palette} from '../../classes/palette';

export enum Tool {
  DRAW,
  FLOOD_FILL,
  CLONE,
  TEXT
}

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.less']
})
export class ToolboxComponent implements OnInit {

  @Input() tool: Tool;
  @Input() palette: Palette;
  @Input() foreColorIndex: number;
  @Input() backColorIndex: number;
  @Output() zoomInClicked = new EventEmitter();
  @Output() zoomOutClicked = new EventEmitter();
  @Output() shiftLeftClicked = new EventEmitter();
  @Output() shiftRightClicked = new EventEmitter();
  @Output() shiftUpClicked = new EventEmitter();
  @Output() shiftDownClicked = new EventEmitter();
  @Output() fillClicked = new EventEmitter();
  @Output() clearClicked = new EventEmitter();
  @Output() toolChanged = new EventEmitter<Tool>();
  @Output() backColorChanged = new EventEmitter<number>();
  @Output() foreColorChanged = new EventEmitter<number>();

  fillIcon = faFill;
  clearIcon = faEraser;
  drawIcon = faPencilAlt;
  floodFillIcon = faFillDrip;
  cloneIcon = faClone;
  textIcon = faFont;

  canUndo = false;
  canRedo = false;
  toolEnum = Tool;

  constructor(
    private undoManagerService: UndoManagerService
  ) {
    undoManagerService.subscribe(this.undoStatusChanged.bind(this));
  }

  ngOnInit(): void {
    this.canUndo = this.undoManagerService.canUndo();
    this.canRedo = this.undoManagerService.canRedo();
  }

  undoStatusChanged(undoManagerStatus: UndoManagerStatus): void {
    this.canUndo = undoManagerStatus.canUndo;
    this.canRedo = undoManagerStatus.canRedo;
  }

  undo(): void {
    this.undoManagerService.undo();
  }

  redo(): void {
    this.undoManagerService.redo();
  }

  zoomIn(): void {
    this.zoomInClicked.emit();
  }

  zoomOut(): void {
    this.zoomOutClicked.emit();
  }

  shiftLeft(): void {
    this.shiftLeftClicked.emit();
  }

  shiftRight(): void {
    this.shiftRightClicked.emit();
  }

  shiftUp(): void {
    this.shiftUpClicked.emit();
  }

  shiftDown(): void {
    this.shiftDownClicked.emit();
  }

  clear(): void {
    this.clearClicked.emit();
  }

  fill(): void {
    this.fillClicked.emit();
  }

  changeTool(evt): void {
    this.tool = evt.value;
    this.toolChanged.emit(this.tool);
  }

  setBackColorIndex(backColorIndex: number): void {
    this.backColorChanged.emit(backColorIndex);
  }

  setForeColorIndex(foreColorIndex: number): void {
    this.foreColorChanged.emit(foreColorIndex);
  }
}
