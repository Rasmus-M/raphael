import {Component, Input, OnInit} from '@angular/core';
import {Point} from '../../classes/point';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.less']
})
export class StatusBarComponent implements OnInit {

  @Input() cursorPosition: Point;

  constructor() { }

  ngOnInit(): void {
  }
}
