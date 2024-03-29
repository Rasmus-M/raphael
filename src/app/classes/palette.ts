import {Color} from './color';

export class Palette {

  private colors: Color[] = [
    new Color(48, 48, 48),
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

  constructor() {}

  getSize(): number {
    return this.colors.length;
  }

  getColor(index: number): Color {
    return this.colors[index];
  }

  getColors(): Color[] {
    return this.colors;
  }

  getHexColors(): string[] {
    return this.colors.map(color => color.getHexString());
  }

  setHexColors(hexColors: string[]): void {
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i].setHexString(hexColors[i]);
    }
  }

  getClosestColorIndex(otherColor: Color): number {
    let closestIndex = -1;
    let minDistance = Infinity;
    for (let i = 1; i < this.colors.length; i++) {
      const color = this.colors[i];
      const d = color.colorDistance(otherColor);
      if (d < minDistance) {
        closestIndex = i;
        minDistance = d;
      }
    }
    return closestIndex;
  }
}
