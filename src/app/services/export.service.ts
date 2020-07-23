import {Injectable} from '@angular/core';
import {ProjectData} from '../interfaces/project-data';
import {AssemblyFile} from '../classes/assemblyFile';
import {AttributeMode} from '../enums/attribute-mode';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  getAssemblyFile(projectData: ProjectData): string {
    const assemblyFile = new AssemblyFile();
    switch (projectData.attributeMode) {
      case AttributeMode.NONE:
        this.createLinearAssemblyFile(projectData, assemblyFile);
        break;
      case AttributeMode.EIGHT_X_ONE:
        this.createBitmapColorAssemblyFile(projectData, assemblyFile);
        break;
      case AttributeMode.EIGHT_X_EIGHT:
        this.createCharacterBasedAssemblyFile(projectData, assemblyFile);
        break;
    }

    return assemblyFile.toString();
  }

  private createLinearAssemblyFile(projectData: ProjectData, assemblyFile: AssemblyFile): void {
    const section = assemblyFile.createSection('image');
    let byte;
    for (const row of projectData.data) {
      for (const value of row) {
        if (byte === undefined) {
          byte = value;
        } else {
          byte = (byte << 4) || value;
          section.write(byte);
          byte = undefined;
        }
      }
    }
  }

  private createBitmapColorAssemblyFile(projectData: ProjectData, assemblyFile: AssemblyFile): void {
    const patternSection = assemblyFile.createSection('patterns');
    const colorSection = assemblyFile.createSection('colors');
    const data = projectData.data;
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    for (let row = 0; row < rows; row++) {
      const y0 = row * 8;
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        for (let y = y0; y < y0 + 8; y++) {
          const {foreColorIndex, backColorIndex, patternByte} =
            this.getPatternByte(x0, y, data, undefined, undefined, projectData.backColorIndex);
          patternSection.write(patternByte);
          const colorByte = (foreColorIndex << 4) | backColorIndex;
          colorSection.write(colorByte);
        }
      }
    }
  }

  private createCharacterBasedAssemblyFile(projectData: ProjectData, assemblyFile: AssemblyFile): void {
    const patternSection = assemblyFile.createSection('patterns');
    const colorSection = assemblyFile.createSection('colors');
    const data = projectData.data;
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    for (let row = 0; row < rows; row++) {
      const y0 = row * 8;
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        let foreColorIndex;
        let backColorIndex;
        for (let y = y0; y < y0 + 8; y++) {
          const result = this.getPatternByte(x0, y, data, foreColorIndex, backColorIndex, projectData.backColorIndex);
          foreColorIndex = result.foreColorIndex;
          backColorIndex = result.backColorIndex;
          patternSection.write(result.patternByte);
        }
        const colorByte = (foreColorIndex << 4) | backColorIndex;
        colorSection.write(colorByte);
      }
    }
  }

  private getPatternByte(
    x0: number,
    y0: number,
    data: number[][],
    foreColorIndex: number,
    backColorIndex: number,
    defaultBackColorIndex: number
  ): {foreColorIndex: number, backColorIndex: number, patternByte: number} {
    let patternByte = 0;
    let bit = 0x80;
    for (let x = x0; x < x0 + 8; x++) {
      const colorIndex = data[y0][x];
      if (foreColorIndex === undefined && colorIndex !== defaultBackColorIndex) {
        foreColorIndex = colorIndex;
      } else if (backColorIndex === undefined) {
        backColorIndex = colorIndex;
      }
      if (colorIndex === foreColorIndex) {
        patternByte |= bit;
      }
      bit >>>= 1;
    }
    return {foreColorIndex, backColorIndex, patternByte};
  }
}
