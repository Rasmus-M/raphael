import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Palette} from '../../classes/palette';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.less'],
  standalone: false
})
export class PaletteComponent implements OnInit, AfterViewInit, OnChanges {

  static FORE_COLOR_LABEL = 'F';
  static BACK_COLOR_LABEL = 'B';

  @Input() palette: Palette;
  @Input() foreColorIndex: number;
  @Input() backColorIndex: number;
  @Output() backColorChanged = new EventEmitter<number>();
  @Output() foreColorChanged = new EventEmitter<number>();
  @Output() paletteChanged = new EventEmitter();

  @ViewChild('colorInput') colorInputRef: ElementRef<HTMLInputElement>;

  currentIndex: number;
  labels: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.setLabels();
  }

  ngAfterViewInit(): void {
    this.colorInputRef.nativeElement.addEventListener('change', (event) => {
      this.colorSelected(this.colorInputRef.nativeElement.value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.foreColorIndex || changes.backColorIndex) {
      this.setLabels();
    }
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

  setPaletteColor(index: number): void {
    this.currentIndex = index;
    const element = this.colorInputRef.nativeElement;
    element.value = this.palette.getColor(index).getHexString();
    element.click();
  }

  colorSelected(value: string): void {
    if (this.currentIndex !== undefined) {
      this.palette.getColor(this.currentIndex).setHexString(value);
      this.paletteChanged.emit();
    }
  }
}
