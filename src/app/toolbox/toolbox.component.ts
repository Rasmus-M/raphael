import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.less']
})
export class ToolboxComponent implements OnInit {

  @Output() zoomedIn = new EventEmitter();
  @Output() zoomedOut = new EventEmitter();
  @Output() shiftedLeft = new EventEmitter();
  @Output() shiftedRight = new EventEmitter();
  @Output() shiftedUp = new EventEmitter();
  @Output() shiftedDown = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
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
}
