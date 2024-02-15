import {Util} from './util';

export class Color {

  private _red: number;
  private _green: number;
  private _blue: number;
  private readonly _alpha: number;

  constructor(red: number, green: number, blue: number) {
    this._red = red;
    this._green = green;
    this._blue = blue;
  }

  get red(): number {
    return this._red;
  }

  get green(): number {
    return this._green;
  }

  get blue(): number {
    return this._blue;
  }

  getHexString(): string {
    return '#' + Util.hexString(this._red, 2, false) + Util.hexString(this._green, 2, false) + Util.hexString(this._blue, 2, false);
  }

  setHexString(value: string): void {
    if (value && value.length >= 6) {
      if (value.startsWith('#')) {
        value = value.substring(1);
      }
      this._red = parseInt(value.substring(0, 2), 16);
      this._green = parseInt(value.substring(2, 4), 16);
      this._blue = parseInt(value.substring(4, 6), 16);
    }
  }

  colorDistance(color: Color): number {
    return Math.sqrt(Math.pow(this.red - color.red, 2) + Math.pow(this.green - color.green, 2) + Math.pow(this.blue - color.blue, 2));
  }

  isBlack(): boolean {
    return this._red <= 48 && this._green <= 48 && this._blue <= 48;
  }
}
