import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import {ProjectData} from '../interfaces/project-data';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  openProject(file: File): Observable<ProjectData> {
    const subject = new Subject<ProjectData>();
    const reader = new FileReader();
    reader.onload = () => {
      const json = reader.result as string;
      try {
        const projectData = JSON.parse(json);
        subject.next(projectData);
      } catch (e) {
        subject.error('Invalid file: ' + file.name);
      }
    };
    reader.onerror = () => {
      subject.error('Failed to load file: ' + file.name);
    };
    reader.readAsText(file);
    return subject.asObservable();
  }

  saveProject(projectData: ProjectData, filename: string): void {
    const json = JSON.stringify(projectData);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' } );
    FileSaver.saveAs(blob, filename);
  }

  openBinaryFile(file: File): Observable<ArrayBuffer> {
    const subject = new Subject<ArrayBuffer>();
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      subject.next(arrayBuffer);
    };
    reader.onerror = () => {
      subject.error('Failed to load file: ' + file.name);
    };
    reader.readAsArrayBuffer(file);
    return subject.asObservable();
  }

  saveTextFile(text: string, filename: string): void {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' } );
    FileSaver.saveAs(blob, filename);
  }

  saveBinaryFile(arrayBuffer: ArrayBuffer, filename: string, mimeType: string): void {
    const blob = new Blob([arrayBuffer], { type: mimeType } );
    FileSaver.saveAs(blob, filename);
  }
}
