import {Util} from './util';

export class Color {

  private readonly _red: number;
  private readonly _green: number;
  private readonly _blue: number;
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
    return '#' + Util.hexByte(this._red) + Util.hexByte(this._green) + Util.hexByte(this._blue);
  }

  colorDistance(color: Color): number {
    return Math.sqrt(Math.pow(this.red - color.red, 2) + Math.pow(this.green - color.green, 2) + Math.pow(this.blue - color.blue, 2));
  }

  isBlack(): boolean {
    return this._red === 0 && this._green === 0 && this._blue === 0;
  }
}
