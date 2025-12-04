import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {TITLE, VERSION_NO} from '../../app.config';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.less'],
  standalone: false
})
export class AboutDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AboutDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  getTitle(): string {
    return 'About ' + TITLE;
  }

  getVersion(): string {
    return 'Version ' + VERSION_NO;
  }
}
