import {Component} from '@angular/core';
import {Grid} from './classes/grid';
import {AttributeMode} from './enums/attribute-mode';
import {Palette} from './classes/palette';
import {UndoManagerService} from './services/undo-manager.service';
import {Tool} from './components/toolbox/toolbox.component';
import {MatDialog} from '@angular/material/dialog';
import {NewDialogComponent, NewDialogData} from './components/new-dialog/new-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  imageNumber = 0;
  grid: Grid;
  gridWidth: number;
  gridHeight: number;
  pixelScaleX: number;
  pixelScaleY: number;
  zoom: number;
  tool: Tool;
  palette: Palette;
  backColorIndex: number;
  foreColorIndex: number;

  constructor(
    public dialog: MatDialog,
    private undoManagerService: UndoManagerService
  ) {
    this.grid = new Grid(this.gridWidth, this.gridHeight, AttributeMode.NONE, this.backColorIndex);
    this.palette = new Palette();
    this.init({width: 64, height: 64, attributeMode: AttributeMode.NONE, pixelScaleX: 1, pixelScaleY: 1});
  }

  init(initData: NewDialogData): void {
    this.backColorIndex = 0;
    this.foreColorIndex = 15;
    this.pixelScaleX = initData.pixelScaleX;
    this.pixelScaleY = initData.pixelScaleY;
    this.grid.attributeMode = initData.attributeMode;
    this.grid.setSize(initData.width, initData.height, this.backColorIndex);
    this.zoom = 1;
    this.tool = Tool.DRAW;
    this.imageNumber++;
  }

  zoomIn(): void {
    if (this.zoom < 16) {
      this.zoom++;
    }
  }

  zoomOut(): void {
    if (this.zoom > 1) {
      this.zoom--;
    }
  }

  shiftLeft(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftLeft()
    );
  }

  shiftRight(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftRight()
    );
  }

  shiftUp(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftUp()
    );
  }

  shiftDown(): void {
    this.undoManagerService.addEdit(
      this.grid.shiftDown()
    );
  }

  fill(): void {
    this.undoManagerService.addEdit(
      this.grid.fill(this.foreColorIndex)
    );
  }

  clear(): void {
    this.undoManagerService.addEdit(
      this.grid.fill(this.backColorIndex)
    );
  }

  toolChanged(tool: Tool): void {
    this.tool = tool;
  }

  setBackColorIndex(backColorIndex: number): void {
    this.backColorIndex = backColorIndex;
  }

  setForeColorIndex(foreColorIndex: number): void {
    this.foreColorIndex = foreColorIndex;
  }

  new(): void {
    const dialogRef = this.dialog.open(NewDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: NewDialogData) => {
      if (result) {
        console.log('New', result);
        this.init(result);
        this.undoManagerService.discardAllEdits();
      }
    });
  }

  open(): void {
    console.log('Open not implemented');
  }

  save(): void {
    console.log('Save not implemented');
  }

  saveAs(): void {
    console.log('Save as not implemented');
  }
}
