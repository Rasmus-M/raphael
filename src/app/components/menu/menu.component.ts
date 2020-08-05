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
  @Output() importPNGClicked = new EventEmitter();
  @Output() exportAssemblyClicked = new EventEmitter<boolean>();
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

  importPNG(): void {
    this.importPNGClicked.emit();
  }

  exportAssembly(columns: boolean): void {
    this.exportAssemblyClicked.emit(columns);
  }

  about(): void {
    this.aboutClicked.emit();
  }
}
