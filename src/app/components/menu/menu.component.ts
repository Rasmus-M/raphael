import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  @Output() newClicked = new EventEmitter();
  @Output() openClicked = new EventEmitter();
  @Output() saveClicked = new EventEmitter();
  @Output() saveAsClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  new(): void {
    this.newClicked.emit();
  }

  open(): void {
    this.openClicked.emit();
  }

  save(): void {
    this.saveClicked.emit();
  }

  saveAs(): void {
    this.saveAsClicked.emit();
  }

  import(): void {
    this.saveAsClicked.emit();
  }

  export(): void {
    this.saveAsClicked.emit();
  }

  about(): void {
    this.saveAsClicked.emit();
  }
}
