import {NewProjectData} from './new-project-data';

export interface ProjectData extends NewProjectData{
  data: number[][];
  backColorIndex: number;
  foreColorIndex: number;
  tool: number;
  zoom: number;
}
