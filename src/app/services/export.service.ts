import {Injectable} from '@angular/core';
import {ProjectData} from '../interfaces/project-data';
import {AssemblyFile} from '../classes/assemblyFile';
import {AttributeMode} from '../enums/attribute-mode';
import {PNG} from 'pngjs/browser';
import {Palette} from '../classes/palette';
import {AssemblyFileSection} from '../classes/assemblyFileSection';

export type PixelPacking = '1_BPP' | '4_BPP' | '8_BPP' | '16_BPP';

export interface ExportOptions {
  columns: boolean;
  packing: PixelPacking;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportPNGFile(projectData: ProjectData, palette: Palette): ArrayBuffer {
    const png = new PNG({
      width: projectData.width,
      height: projectData.height,
      colorType: 6
    });
    let i = 0;
    for (let y = 0; y < projectData.height; y++) {
      for (let x = 0; x < projectData.width; x++) {
        const colorIndex = projectData.data[y][x];
        const color = palette.getColor(colorIndex);
        png.data[i++] = color.red;
        png.data[i++] = color.green;
        png.data[i++] = color.blue;
        png.data[i++] = colorIndex === 0 ? 0 : 255;
      }
    }
    return PNG.sync.write(png);
  }

  exportBinaryFile(projectData: ProjectData, options: ExportOptions): ArrayBuffer {
    switch (projectData.attributeMode) {
      case AttributeMode.ONE_X_ONE:
        return this.create1x1BinaryFile(projectData, options);
      case AttributeMode.EIGHT_X_ONE:
        return this.create8x1BinaryFile(projectData);
      case AttributeMode.EIGHT_X_EIGHT:
        return this.create8x8BinaryFile(projectData);
    }
  }

  private create1x1BinaryFile(projectData: ProjectData, options: ExportOptions): ArrayBuffer {
    const arrayBuffer = new Uint8Array(projectData.width * projectData.height * (options.packing === '4_BPP' ? 0.5 : (options.packing === '8_BPP' ? 1 : 2)));
    let i = 0;
    if (options.columns) {
      for (let x = 0; x < projectData.width; x++) {
        for (let y = 0; y < projectData.height; y++) {
          const byte = projectData.data[y][x];
          switch (options.packing) {
            case '4_BPP':
              if (x % 2 === 0) {
                const nextByte = projectData.data[y][x + 1];
                arrayBuffer[i++] = (byte << 4) | nextByte;
              }
              break;
            case '8_BPP':
              arrayBuffer[i++] = byte;
              break;
            case '16_BPP':
              arrayBuffer[i++] = byte << 4;
              arrayBuffer[i++] = byte;
              break;
          }
        }
      }
    } else {
      for (let y = 0; y < projectData.height; y++) {
        for (let x = 0; x < projectData.width; x++) {
          const byte = projectData.data[y][x];
          switch (options.packing) {
            case '4_BPP':
              if (x % 2 === 0) {
                const nextByte = projectData.data[y][x + 1];
                arrayBuffer[i++] = (byte << 4) | nextByte;
              }
              break;
            case '8_BPP':
              arrayBuffer[i++] = byte;
              break;
            case '16_BPP':
              arrayBuffer[i++] = byte << 4;
              arrayBuffer[i++] = byte;
              break;
          }
        }
      }
    }
    return arrayBuffer;
  }

  private create8x1BinaryFile(projectData: ProjectData): ArrayBuffer {
    const data = projectData.data;
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    const patternBuffer: number[] = [];
    const colorBuffer: number[] = [];
    for (let row = 0; row < rows; row++) {
      const y0 = row * 8;
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        this.writeBinary8x1Character(
          x0, y0, data, projectData.foreColorIndex, projectData.backColorIndex, patternBuffer, colorBuffer
        );
      }
    }
    return new Uint8Array(patternBuffer.concat(colorBuffer));
  }

  private writeBinary8x1Character(
    x0: number,
    y0: number,
    data: number[][],
    projectForeColorIndex: number,
    projectBackColorIndex: number,
    patternBuffer: number[],
    colorBuffer: number[]
  ): void {
    for (let y = y0; y < y0 + 8; y++) {
      const {foreColorIndex, backColorIndex, patternByte} =
        this.getPatternByte(x0, y, data, undefined, undefined, projectForeColorIndex, projectBackColorIndex);
      patternBuffer.push(patternByte);
      const colorByte = (foreColorIndex << 4) | backColorIndex;
      colorBuffer.push(colorByte);
    }
  }

  private create8x8BinaryFile(projectData: ProjectData): ArrayBuffer {
    const data = projectData.data;
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    const patternBuffer: number[] = [];
    const colorBuffer: number[] = [];
    for (let row = 0; row < rows; row++) {
      const y0 = row * 8;
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        let foreColorIndex;
        let backColorIndex;
        for (let y = y0; y < y0 + 8; y++) {
          const result = this.getPatternByte(
            x0, y, data, foreColorIndex, backColorIndex, projectData.foreColorIndex, projectData.backColorIndex
          );
          foreColorIndex = result.foreColorIndex;
          backColorIndex = result.backColorIndex;
          patternBuffer.push(result.patternByte);
        }
        const colorByte = (foreColorIndex << 4) | backColorIndex;
        colorBuffer.push(colorByte);
      }
    }
    return new Uint8Array(patternBuffer.concat(colorBuffer));
  }

  exportAssemblyFile(projectData: ProjectData, options: ExportOptions): string {
    const assemblyFile = new AssemblyFile();
    switch (projectData.attributeMode) {
      case AttributeMode.ONE_X_ONE:
        if (options.packing === '1_BPP') {
          return;
        }
        this.create1x1AssemblyFile(projectData, options, assemblyFile);
        break;
      case AttributeMode.EIGHT_X_ONE:
        if (options.packing !== '1_BPP') {
          return;
        }
        this.create8x1AssemblyFile(projectData, options, assemblyFile);
        break;
      case AttributeMode.EIGHT_X_EIGHT:
        if (options.packing !== '1_BPP') {
          return;
        }
        this.create8x8AssemblyFile(projectData, options, assemblyFile);
        break;
    }
    return assemblyFile.toString();
  }

  private create1x1AssemblyFile(projectData: ProjectData, options: ExportOptions, assemblyFile: AssemblyFile): void {
    const section = assemblyFile.createSection('');
    const section2 = options.packing === '16_BPP' ? assemblyFile.createSection('') : undefined;
    if (options.columns) {
      for (let x = 0; x < projectData.width; x++) {
        for (let y = 0; y < projectData.height; y++) {
          const byte = projectData.data[y][x];
          switch (options.packing) {
            case '4_BPP':
              if (x % 2 === 0) {
                const nextByte = projectData.data[y][x + 1];
                section.write((byte << 4) | nextByte);
              }
              break;
            case '8_BPP':
              section.write(byte);
              break;
            case '16_BPP':
              section.write(byte << 4);
              section2.write(byte);
              break;
          }
        }
      }
    } else {
      for (let y = 0; y < projectData.height; y++) {
        for (let x = 0; x < projectData.width; x++) {
          const byte = projectData.data[y][x];
          switch (options.packing) {
            case '4_BPP':
              if (x % 2 === 0) {
                const nextByte = projectData.data[y][x + 1];
                section.write((byte << 4) | nextByte);
              }
              break;
            case '8_BPP':
              section.write(byte);
              break;
            case '16_BPP':
              section.write(byte << 4);
              section2.write(byte);
              break;
          }
        }
      }
    }
  }

  private create8x1AssemblyFile(projectData: ProjectData, options: ExportOptions, assemblyFile: AssemblyFile): void {
    const baseFilename = this.getBaseFilename(projectData);
    const patternSection = assemblyFile.createSection(baseFilename + '_patterns');
    const colorSection = assemblyFile.createSection(baseFilename + '_colors');
    const data = projectData.data;
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    if (options.columns) {
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        for (let row = 0; row < rows; row++) {
          const y0 = row * 8;
          this.writeAssembly8x1Character(
            x0, y0, data, projectData.foreColorIndex, projectData.backColorIndex, patternSection, colorSection
          );
        }
      }
    } else {
      for (let row = 0; row < rows; row++) {
        const y0 = row * 8;
        for (let col = 0; col < cols; col++) {
          const x0 = col * 8;
          this.writeAssembly8x1Character(
            x0, y0, data, projectData.foreColorIndex, projectData.backColorIndex, patternSection, colorSection
          );
        }
      }
    }
  }

  private writeAssembly8x1Character(
    x0: number,
    y0: number,
    data: number[][],
    projectForeColorIndex: number,
    projectBackColorIndex: number,
    patternSection: AssemblyFileSection,
    colorSection: AssemblyFileSection
  ): void {
    for (let y = y0; y < y0 + 8; y++) {
      const {foreColorIndex, backColorIndex, patternByte} =
        this.getPatternByte(x0, y, data, undefined, undefined, projectForeColorIndex, projectBackColorIndex);
      patternSection.write(patternByte);
      const colorByte = (foreColorIndex << 4) | backColorIndex;
      colorSection.write(colorByte);
    }
  }

  private create8x8AssemblyFile(projectData: ProjectData, options: ExportOptions, assemblyFile: AssemblyFile): void {
    const baseFilename = this.getBaseFilename(projectData);
    const patternSection = assemblyFile.createSection(baseFilename + '_patterns');
    const colorSection = assemblyFile.createSection(baseFilename + '_colors');
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
          const result = this.getPatternByte(
            x0, y, data, foreColorIndex, backColorIndex, projectData.foreColorIndex, projectData.backColorIndex
          );
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
    defaultForeColorIndex: number,
    defaultBackColorIndex: number
  ): {foreColorIndex: number, backColorIndex: number, patternByte: number} {
    for (let x = x0; x < x0 + 8; x++) {
      const colorIndex = data[y0][x];
      if (foreColorIndex === undefined && colorIndex !== defaultBackColorIndex) {
        foreColorIndex = colorIndex;
      }
      if (backColorIndex === undefined && colorIndex !== foreColorIndex) {
        backColorIndex = colorIndex;
      }
    }
    if (foreColorIndex === undefined) {
      foreColorIndex = defaultForeColorIndex;
    }
    if (backColorIndex === undefined) {
      backColorIndex = defaultBackColorIndex;
    }
    let patternByte = 0;
    let bit = 0x80;
    for (let x = x0; x < x0 + 8; x++) {
      const colorIndex = data[y0][x];
      if (colorIndex === foreColorIndex) {
        patternByte |= bit;
      }
      bit >>>= 1;
    }
    if (patternByte === 0) {
      foreColorIndex = backColorIndex;
    }
    return {foreColorIndex, backColorIndex, patternByte};
  }

  exportHexString(projectData: ProjectData): string {
    let hex = '';
    const cols = Math.floor(projectData.width / 8);
    const rows = Math.floor(projectData.height / 8);
    for (let row = 0; row < rows; row++) {
      const y0 = row * 8;
      for (let col = 0; col < cols; col++) {
        const x0 = col * 8;
        const hexChar = this.getHexCharacter(x0, y0, projectData.data, projectData.foreColorIndex, projectData.backColorIndex);
        hex += '"' + hexChar + '"' + (col < cols - 1 ? ',' : '\n');
      }
    }
    return hex;
  }

  private getHexCharacter(
    x0: number,
    y0: number,
    data: number[][],
    projectForeColorIndex: number,
    projectBackColorIndex: number,
  ): string {
    let hex = '';
    for (let y = y0; y < y0 + 8; y++) {
      const result = this.getPatternByte(x0, y, data, undefined, undefined, projectForeColorIndex, projectBackColorIndex);
      hex += this.getHexByte(result.patternByte);
    }
    return hex;
  }

  private getHexByte(b: number): string {
    let hexByte = b.toString(16);
    if (hexByte.length === 1) {
      hexByte = '0' + hexByte;
    }
    return hexByte.toUpperCase();
  }

  exportMonochromeLinearAssemblyFile(projectData: ProjectData): string {
    const assemblyFile = new AssemblyFile();
    const section = assemblyFile.createSection('');
    for (let y = 0; y < projectData.height; y++) {
      for (let x = 0; x < projectData.width; x += 8) {
        let byte = 0;
        let bit = 0x80;
        for (let x1 = x; x1 < x + 8; x1++) {
            if (projectData.data[y][x1] !== projectData.backColorIndex) {
              byte |= bit;
            }
            bit >>>= 1;
        }
        section.write(byte);
      }
    }
    return assemblyFile.toString();
  }

  private getBaseFilename(projectData: ProjectData): string {
    return projectData.filename ? projectData.filename.split('.')[0].replace(/[ -]/, '_') : '';
  }
}
