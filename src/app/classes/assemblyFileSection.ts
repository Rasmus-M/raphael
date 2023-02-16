import {Util} from './util';

export class AssemblyFileSection {

  private label: string;
  private useBytes: boolean;
  private itemsPerLine: number;
  private buffer: number[];
  private indent = '       ';

  constructor(label: string, useBytes?: boolean, itemsPerLine?: number) {
    this.label = label;
    this.useBytes = useBytes || true;
    this.itemsPerLine = itemsPerLine || 8;
    this.reset();
  }

  reset(): void {
    this.buffer = [];
  }

  write(item: number): void {
    this.buffer.push(item);
  }

  toString(): string {
    let result = this.label ? this.label + ':\n' : '';
    const items = this.itemsPerLine;
    for (let i = 0; i < this.buffer.length; i++) {
      if (i % items === 0) {
        result += this.indent + (this.useBytes ? 'byte ' : 'data ');
      }
      result += this.useBytes ? Util.hexByte(this.buffer[i]) : Util.hexWord(this.buffer[i]);
      result += (i % items === items - 1 || i === this.buffer.length - 1) ? '\n' : ',';
    }
    return result;
  }
}
