import {Injectable} from '@angular/core';
import {ProjectData} from '../interfaces/project-data';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  restoreProject(): ProjectData {
    const json = window.localStorage.getItem('project');
    return JSON.parse(json);
  }

  backupProject(projectData: ProjectData): void {
    const json = JSON.stringify(projectData);
    window.localStorage.setItem('project', json);
  }
}
