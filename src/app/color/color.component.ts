import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Color} from '../classes/color';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.less']
})
export class ColorComponent implements AfterViewInit {

  @Input() color: Color;
  @Output() selected = new EventEmitter<void>();

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit(): void {
    const colorBox: HTMLDivElement = this.element.nativeElement.querySelector('.color-box');
    colorBox.style.backgroundColor = this.color.getHexString();
  }

  clicked(): void {
    this.selected.emit();
  }
}
