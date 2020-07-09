import {Point} from './point';

export class PixelRenderer {

  public static drawLine(point1: Point, point2: Point, drawPixel: (x: number, y: number) => void): void {
    let x1 = point1.x;
    let y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    let done = false;
    while (!done) {
      drawPixel(x1, y1);
      if (x1 === x2 && y1 === y2) {
        done = true;
      } else {
        const errTmp = err;
        if (errTmp > -dx) {
          err -= dy;
          x1 += sx;
        }
        if (errTmp < dy) {
          err += dx;
          y1 += sy;
        }
      }
    }
  }
}

