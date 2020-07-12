import {Component} from '@angular/core';
import {Grid} from './classes/grid';
import {AttributeMode} from './enums/attribute-mode';
import {Palette} from './classes/palette';
import {UndoManagerService} from './services/undo-manager.service';
import {Tool} from './enums/tool';
import {MatDialog} from '@angular/material/dialog';
import {NewDialogComponent} from './components/new-dialog/new-dialog.component';
import {FileService} from './services/file.service';
import {OpenDialogComponent, OpenDialogData} from './components/open-dialog/open-dialog.component';
import {ProjectData} from './interfaces/project-data';
import {NewProjectData} from './interfaces/new-project-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  palette: Palette;
  grid: Grid;
  pixelScaleX = 1;
  pixelScaleY = 1;
  backColorIndex: number;
  foreColorIndex: number;
  tool: Tool;
  zoom: number;
  imageNumber = 0;

  constructor(
    public dialog: MatDialog,
    private undoManagerService: UndoManagerService,
    private fileService: FileService
  ) {
    this.palette = new Palette();
    this.grid = new Grid();
    this.init({
      width: 64,
      height: 64,
      pixelScaleX: this.pixelScaleX,
      pixelScaleY: this.pixelScaleY,
      attributeMode: AttributeMode.NONE,
      data: null,
      backColorIndex: 0,
      foreColorIndex: 15,
      tool: Tool.DRAW,
      zoom: 1
    });
  }

  init(projectData: ProjectData): void {
    this.pixelScaleX = projectData.pixelScaleX;
    this.pixelScaleY = projectData.pixelScaleY;
    this.grid.attributeMode = projectData.attributeMode;
    this.grid.setSize(projectData.width, projectData.height, projectData.backColorIndex);
    if (projectData.data) {
      this.grid.setData(projectData.data);
    }
    this.backColorIndex = projectData.backColorIndex;
    this.foreColorIndex = projectData.foreColorIndex;
    this.tool = projectData.tool;
    this.zoom = projectData.zoom;
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
    dialogRef.afterClosed().subscribe((newProjectData: NewProjectData) => {
      if (newProjectData) {
        this.init({
          width: newProjectData.width,
          height: newProjectData.height,
          pixelScaleX: newProjectData.pixelScaleX,
          pixelScaleY: newProjectData.pixelScaleY,
          attributeMode: newProjectData.attributeMode,
          data: null,
          backColorIndex: 0,
          foreColorIndex: 15,
          tool: Tool.DRAW,
          zoom: 1
        });
        this.undoManagerService.discardAllEdits();
      }
    });
  }

  open(): void {
    const dialogRef = this.dialog.open(OpenDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((result: OpenDialogData) => {
      if (result) {
        console.log('Open', result);
        this.fileService.openProject(result.file).subscribe(
          (projectData: ProjectData) => {
            this.init(projectData);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }

  save(): void {
    console.log('Save not implemented');
  }

  saveAs(): void {
    try {
      this.fileService.saveProjectAs({
        width: this.grid.width,
        height: this.grid.height,
        pixelScaleX: this.pixelScaleX,
        pixelScaleY: this.pixelScaleY,
        attributeMode: this.grid.attributeMode,
        data: this.grid.getData(),
        backColorIndex: this.backColorIndex,
        foreColorIndex: this.foreColorIndex,
        tool: this.tool,
        zoom: this.zoom
      });
    } catch (error) {
      console.error(error);
    }
  }

  import(): void {
    console.log('Import not implemented');
  }

  export(): void {
    console.log('Export not implemented');
  }

  about(): void {
    console.log('About not implemented');
  }
}
