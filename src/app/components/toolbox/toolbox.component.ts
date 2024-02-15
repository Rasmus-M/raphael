import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowsAltH,
    faArrowsAltV,
    faArrowUp,
    faCircle as faCircleSolid,
    faClone,
    faEraser,
    faFill,
    faFillDrip,
    faPencilAlt,
    faRedo,
    faSearchMinus,
    faSearchPlus,
    faSlash,
    faSquare as faSquareSolid,
    faUndo
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircle,
  faSquare
} from '@fortawesome/free-regular-svg-icons';
import {UndoManagerService, UndoManagerStatus} from '../../services/undo-manager.service';
import {Tool} from '../../enums/tool';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.less']
})
export class ToolboxComponent implements OnInit {

  @Input() tool: Tool;
  @Output() zoomInClicked = new EventEmitter();
  @Output() zoomOutClicked = new EventEmitter();
  @Output() shiftLeftClicked = new EventEmitter();
  @Output() shiftRightClicked = new EventEmitter();
  @Output() shiftUpClicked = new EventEmitter();
  @Output() shiftDownClicked = new EventEmitter();
  @Output() fillClicked = new EventEmitter();
  @Output() clearClicked = new EventEmitter();
  @Output() flipHorizontalClicked = new EventEmitter();
  @Output() flipVerticalClicked = new EventEmitter();
  @Output() toolChanged = new EventEmitter<Tool>();

  undoIcon = faUndo;
  redoIcon = faRedo;
  zoomInIcon = faSearchPlus;
  zoomOutIcon = faSearchMinus;
  shiftLeftIcon = faArrowLeft;
  shiftRightIcon = faArrowRight;
  shiftUpIcon = faArrowUp;
  shiftDownIcon = faArrowDown;
  fillIcon = faFill;
  clearIcon = faEraser;
  drawIcon = faPencilAlt;
  flipHorizontalIcon = faArrowsAltH;
  flipVerticalIcon = faArrowsAltV;
  floodFillIcon = faFillDrip;
  lineIcon = faSlash;
  cloneIcon = faClone;
  rectangleIcon = faSquare;
  filledRectangleIcon = faSquareSolid;
  circleIcon = faCircle;
  filledCircleIcon = faCircleSolid;

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

  flipHorizontal(): void {
    this.flipHorizontalClicked.emit();
  }

  flipVertical(): void {
    this.flipVerticalClicked.emit();
  }

  changeTool(evt): void {
    this.tool = evt.value;
    this.toolChanged.emit(this.tool);
  }
}
