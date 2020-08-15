export class AssemblyFileSection {

  private label: string;
  private useBytes: boolean;
  private itemsPerLine: number;
  private buffer: number[];
  private indent = '       ';

  private static hexString(n: number, length: number): string {
    let hex = n.toString(16);
    while (hex.length < length) {
      hex = '0' + hex;
    }
    return '>' + hex;
  }

  private static spaces(n: number): string {
    let s = '';
    for (let i = n; i > 0; i--) {
      s += ' ';
    }
    return s;
  }

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
      result += AssemblyFileSection.hexString(this.buffer[i], this.useBytes ? 2 : 4);
      result += (i % items === items - 1) ? '\n' : ',';
    }
    return result;
  }
}
