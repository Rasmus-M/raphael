import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Color} from '../../classes/color';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.less']
})
export class ColorBoxComponent implements OnInit {

  @Input() color: Color;
  @Input() label: string;
  @Output() clicked = new EventEmitter<void>();
  @Output() rightClicked = new EventEmitter<void>();
  @Output() doubleClicked = new EventEmitter<void>();

  foregroundColor: string;

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    this.foregroundColor = this.color.isBlack() ? '#ffffff' : '#000000';
  }

  click(): void {
    this.clicked.emit();
  }

  context(evt: MouseEvent): void {
    this.rightClicked.emit();
    evt.preventDefault();
  }

  dblClick(): void {
    this.doubleClicked.emit();
  }
}
