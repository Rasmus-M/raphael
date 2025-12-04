import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {faUpload} from '@fortawesome/free-solid-svg-icons';

export interface OpenDialogData {
  fileType: string;
  extension: string;
  file: File;
}

@Component({
  selector: 'app-open-dialog',
  templateUrl: './open-dialog.component.html',
  styleUrls: ['./open-dialog.component.less'],
  standalone: false
})
export class OpenDialogComponent implements OnInit {

  openFileIcon = faUpload;

  constructor(
    public dialogRef: MatDialogRef<OpenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OpenDialogData) {
  }

  ngOnInit(): void {
  }

  openFile(fileInput: HTMLInputElement): void {
    const files = fileInput.files;
    if (files.length) {
      this.data.file = files[0];
      fileInput.value = '';
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getFileName(): string {
    return this.data.file ? this.data.file.name : '\u00a0';
  }
}
