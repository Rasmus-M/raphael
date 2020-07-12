import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import {ProjectData} from '../interfaces/project-data';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  saveProject(projectData: ProjectData, filename: string): void {
    const json = JSON.stringify(projectData);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' } );
    FileSaver.saveAs(blob, filename);
  }

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
}
