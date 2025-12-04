import {Component, Inject} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {AttributeMode} from '../../enums/attribute-mode';
import {NewProjectData} from '../../interfaces/new-project-data';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.less']
})
export class NewDialogComponent {

  attributeMode = AttributeMode;

  constructor(
    public dialogRef: MatDialogRef<NewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewProjectData) {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
