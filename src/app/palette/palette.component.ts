import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Palette} from '../classes/palette';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.less']
})
export class PaletteComponent implements OnInit {

  @Input() palette: Palette;
  @Output() backColorChanged = new EventEmitter<number>();
  @Output() foreColorChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.palette);
  }

  colorSelected(index: number): void {
    this.foreColorChanged.emit(index);
  }
}
