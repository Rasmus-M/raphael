import {NewProjectData} from './new-project-data';

export interface ProjectData extends NewProjectData {
  filename: string;
  data: number[][];
  backColorIndex: number;
  foreColorIndex: number;
  tool: number;
  zoom: number;
}
