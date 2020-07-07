import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Color} from '../../classes/color';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.less']
})
export class ColorBoxComponent implements AfterViewInit {

  @Input() color: Color;
  @Input() label: string;
  @Output() clicked = new EventEmitter<void>();
  @Output() rightClicked = new EventEmitter<void>();

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit(): void {
    const colorBox: HTMLDivElement = this.element.nativeElement.querySelector('.color-box');
    colorBox.style.color = this.color.isBlack() ? '#ffffff' : '#000000';
    colorBox.style.backgroundColor = this.color.getHexString();
  }

  click(): void {
    this.clicked.emit();
  }

  context(evt: MouseEvent): void {
    this.rightClicked.emit();
    evt.preventDefault();
  }
}
