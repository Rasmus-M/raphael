import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AttributeMode} from '../../enums/attribute-mode';
import {ProjectData} from '../../interfaces/project-data';

@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.less'],
  standalone: false
})
export class PropertiesDialogComponent {

  attributeMode = AttributeMode;

  constructor(
    public dialogRef: MatDialogRef<PropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectData) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
