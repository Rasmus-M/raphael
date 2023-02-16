export class Util {

  public static hexByte(n: number): string {
    return Util.hexString(n , 2, true);
  }

  public static hexWord(n: number): string {
    return Util.hexString(n , 2, true);
  }

  static hexString(n: number, length: number, prefix: boolean): string {
    let hex = n.toString(16);
    while (hex.length < length) {
      hex = '0' + hex;
    }
    return (prefix ? '>' : '') + hex;
  }
}
