import {Point} from './point';

export class PixelRenderer {

  public static drawRectangle(point1: Point, point2: Point, drawPixel: (point: Point) => void): void {
    const x1 = Math.min(point1.x, point2.x);
    const y1 = Math.min(point1.y, point2.y);
    const x2 = Math.max(point1.x, point2.x);
    const y2 = Math.max(point1.y, point2.y);
    for (let x = x1; x <= x2; x++) {
      drawPixel(new Point(x, y1));
      drawPixel(new Point(x, y2));
    }
    for (let y = y1; y <= y2; y++) {
      drawPixel(new Point(x1, y));
      drawPixel(new Point(x2, y));
    }
  }

  public static drawLine(point1: Point, point2: Point, drawPixel: (point: Point) => void): void {
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
      drawPixel(new Point(x1, y1));
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

  public static drawCircle(point1: Point, point2: Point, drawPixel: (point: Point) => void): void {
    const xc = Math.floor((point1.x + point2.x) / 2);
    const yc = Math.floor((point1.y + point2.y) / 2);
    const r = Math.floor(Math.abs(point2.x - point1.x) / 2);
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    this.drawCirclePoints(xc, yc, x, y, drawPixel);
    while (y >= x)
    {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      this.drawCirclePoints(xc, yc, x, y, drawPixel);
    }
  }

  static drawCirclePoints(xc: number, yc: number, x: number, y: number, drawPixel: (point: Point) => void): void {
    drawPixel(new Point(xc + x, yc + y));
    drawPixel(new Point(xc - x, yc + y));
    drawPixel(new Point(xc + x, yc - y));
    drawPixel(new Point(xc - x, yc - y));
    drawPixel(new Point(xc + y, yc + x));
    drawPixel(new Point(xc - y, yc + x));
    drawPixel(new Point(xc + y, yc - x));
    drawPixel(new Point(xc - y, yc - x));
  }

  static drawEllipse(point1: Point, point2: Point, drawPixel: (point: Point) => void): void {

    const xc = Math.floor((point1.x + point2.x) / 2);
    const yc = Math.floor((point1.y + point2.y) / 2);
    const rx = Math.floor(Math.abs(point2.x - point1.x) / 2);
    const ry = Math.floor(Math.abs(point2.y - point1.y) / 2);
    let x = 0;
    let y = ry;

    // Initial decision parameter of region 1
    let d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx);
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    // For region 1
    while (dx < dy) {

      // Print points based on 4-way symmetry
      this.drawEllipsePoints(xc, yc, x, y, drawPixel);

      // Checking and updating value of decision parameter based on algorithm
      if (d1 < 0) {
        x++;
        dx = dx + (2 * ry * ry);
        d1 = d1 + dx + (ry * ry);
      } else {
        x++;
        y--;
        dx = dx + (2 * ry * ry);
        dy = dy - (2 * rx * rx);
        d1 = d1 + dx - dy + (ry * ry);
      }
    }

    // Decision parameter of region 2
    let d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) + ((rx * rx) * ((y - 1) * (y - 1))) - (rx * rx * ry * ry);

    // Plotting points of region 2
    while (y >= 0) {

      // Print points based on 4-way symmetry
      this.drawEllipsePoints(xc, yc, x, y, drawPixel);

      // Checking and updating parameter value based on algorithm
      if (d2 > 0) {
        y--;
        dy = dy - (2 * rx * rx);
        d2 = d2 + (rx * rx) - dy;
      } else {
        y--;
        x++;
        dx = dx + (2 * ry * ry);
        dy = dy - (2 * rx * rx);
        d2 = d2 + dx - dy + (rx * rx);
      }
    }
  }

  static drawEllipsePoints(xc: number, yc: number, x: number, y: number, drawPixel: (point: Point) => void): void {
    drawPixel(new Point(xc + x, yc + y));
    drawPixel(new Point(xc - x, yc + y));
    drawPixel(new Point(xc + x, yc - y));
    drawPixel(new Point(xc - x, yc - y));
  }
}

