import {Injectable} from '@angular/core';
import {ProjectData} from '../interfaces/project-data';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  getAssemblyFile(projectData: ProjectData): string {
    let s = '';
    const data = projectData.data;
    let n = 0;
    let byte = '';
    for (const row of data) {
      for (const value of row) {
        if (n % 16 === 0) {
          s += '       byte ';
        }
        const hexValue = value.toString(16);
        if (n % 2 === 0) {
          byte = '>' + hexValue;
        } else {
          byte += hexValue;
          s += byte;
          if (n % 16 === 15) {
            s += '\n';
          } else {
            s += ',';
          }
        }
        n++;
      }
    }
    return s;
  }
}
