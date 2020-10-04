import {Injectable} from '@angular/core';
import {ProjectData} from '../interfaces/project-data';
import {NewProjectData} from '../interfaces/new-project-data';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static PROJECT_DATA_KEY = 'project-data';
  private static NEW_PROJECT_DATA_KEY = 'new-project-data';

  private storage: Storage = window.localStorage;

  constructor() { }

  backupProject(projectData: ProjectData): void {
    const json = JSON.stringify(projectData);
    this.storage.setItem(StorageService.PROJECT_DATA_KEY, json);
  }

  restoreProject(): ProjectData {
    const json = this.storage.getItem(StorageService.PROJECT_DATA_KEY);
    return JSON.parse(json);
  }

  saveNewProjectProjectData(data: NewProjectData): void {
    const json = JSON.stringify(data);
    this.storage.setItem(StorageService.NEW_PROJECT_DATA_KEY, json);
  }

  loadNewProjectData(): NewProjectData {
    const json = this.storage.getItem(StorageService.NEW_PROJECT_DATA_KEY);
    return JSON.parse(json);
  }
}
