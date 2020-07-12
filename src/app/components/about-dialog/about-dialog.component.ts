import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.less']
})
export class AboutDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AboutDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  getTitle(): string {
    return 'About ' + AppComponent.TITLE;
  }

  getVersion(): string {
    return 'Version ' + AppComponent.VERSION_NO;
  }
}
