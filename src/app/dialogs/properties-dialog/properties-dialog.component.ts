import {Component, Inject} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {AttributeMode} from '../../enums/attribute-mode';
import {ProjectData} from '../../interfaces/project-data';

@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.less']
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
