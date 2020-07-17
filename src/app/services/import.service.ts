import {Injectable} from '@angular/core';
import {PNG} from 'pngjs/browser';
import {PNGWithMetadata} from 'pngjs';
import {Buffer} from 'buffer';
import {Palette} from '../classes/palette';
import {Color} from '../classes/color';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor() { }

  importPNGFile(arrayBuffer: ArrayBuffer, palette: Palette): number[][] {
    const png: PNGWithMetadata = PNG.sync.read(this.arrayBufferToBuffer(arrayBuffer));
    const data: Buffer = png.data;
    const grid: number[][] = [];
    let n = 0;
    for (let y = 0; y < png.height; y++) {
      const row = [];
      for (let x = 0; x < png.width; x++) {
        row.push(palette.getClosestColorIndex(
          new Color(data.readUInt8(n++), data.readUInt8(n++), data.readUInt8(n++))
        ));
        n++;
      }
      grid.push(row);
    }
    return grid;
  }

  arrayBufferToBuffer(ab: ArrayBuffer): Buffer {
    const buffer = new Buffer(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }
}
