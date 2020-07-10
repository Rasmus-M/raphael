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
  @Output() importClicked = new EventEmitter();
  @Output() exportClicked = new EventEmitter();
  @Output() aboutClicked = new EventEmitter();

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
    this.importClicked.emit();
  }

  export(): void {
    this.exportClicked.emit();
  }

  about(): void {
    this.aboutClicked.emit();
  }
}
