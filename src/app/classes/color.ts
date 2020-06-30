import {Util} from './util';

export class Color {

  private red: number;
  private green: number;
  private blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  getHexString(): string {
    return '#' + Util.hexByte(this.red) + Util.hexByte(this.green) + Util.hexByte(this.blue);
  }
}
