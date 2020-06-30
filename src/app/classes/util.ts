export class Util {

  static hexByte(n: number): string {
    let s = n.toString(16);
    if (s.length === 1) {
      s = '0' + s;
    }
    return s;
  }
}
