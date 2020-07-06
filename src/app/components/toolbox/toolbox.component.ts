import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faFill, faEraser, faFillDrip, faPencilAlt, faClone, faFont} from '@fortawesome/free-solid-svg-icons';
import {UndoManagerService, UndoManagerStatus} from '../../services/undo-manager.service';

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
  @Output() zoomedIn = new EventEmitter();
  @Output() zoomedOut = new EventEmitter();
  @Output() shiftedLeft = new EventEmitter();
  @Output() shiftedRight = new EventEmitter();
  @Output() shiftedUp = new EventEmitter();
  @Output() shiftedDown = new EventEmitter();
  @Output() filled = new EventEmitter();
  @Output() cleared = new EventEmitter();
  @Output() toolChanged = new EventEmitter<Tool>();

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
    this.zoomedIn.emit();
  }

  zoomOut(): void {
    this.zoomedOut.emit();
  }

  shiftLeft(): void {
    this.shiftedLeft.emit();
  }

  shiftRight(): void {
    this.shiftedRight.emit();
  }

  shiftUp(): void {
    this.shiftedUp.emit();
  }

  shiftDown(): void {
    this.shiftedDown.emit();
  }

  clear(): void {
    this.cleared.emit();
  }

  fill(): void {
    this.filled.emit();
  }

  changedTool(evt): void {
    this.tool = evt.value;
    this.toolChanged.emit(this.tool);
  }
}
