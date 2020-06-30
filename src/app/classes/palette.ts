import {Color} from './color';

export class Palette {

  private colors: Color[] = [
    new Color(0, 0, 0),
    new Color(0, 0, 0),
    new Color(33, 200, 66),
    new Color(94, 220, 120),
    new Color(84, 85, 237),
    new Color(125, 118, 252),
    new Color(212, 82, 77),
    new Color(66, 235, 245),
    new Color(252, 85, 84),
    new Color(255, 121, 120),
    new Color(212, 193, 84),
    new Color(230, 206, 128),
    new Color(33, 176, 59),
    new Color(201, 91, 186),
    new Color(204, 204, 204),
    new Color(255, 255, 255)
  ];

  getSize(): number {
    return this.colors.length;
  }

  getColor(index: number): Color {
    return this.colors[index];
  }
}
