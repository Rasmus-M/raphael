import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Palette} from '../../classes/palette';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.less']
})
export class PaletteComponent implements OnInit {

  static FORE_COLOR_LABEL = 'F';
  static BACK_COLOR_LABEL = 'B';

  @Input() palette: Palette;
  @Input() foreColorIndex: number;
  @Input() backColorIndex: number;
  @Output() backColorChanged = new EventEmitter<number>();
  @Output() foreColorChanged = new EventEmitter<number>();

  labels: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.setLabels();
  }

  setLabels(): void {
    this.labels = [];
    for (let i = 0; i < this.palette.getSize(); i++) {
      if (i === this.foreColorIndex) {
        this.labels[i] = PaletteComponent.FORE_COLOR_LABEL;
      } else if (i === this.backColorIndex) {
        this.labels[i] = PaletteComponent.BACK_COLOR_LABEL;
      } else {
        this.labels[i] = '';
      }
    }
  }

  setForeColor(index: number): void {
    this.foreColorIndex = index;
    this.setLabels();
    this.foreColorChanged.emit(index);
  }

  setBackColor(index: number): void {
    this.backColorIndex = index;
    this.setLabels();
    this.backColorChanged.emit(index);
  }
}
