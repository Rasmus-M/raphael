import {NewProjectData} from './new-project-data';

export interface ProjectData extends NewProjectData {
  filename: string;
  data: number[][];
  palette: string[];
  backColorIndex: number;
  foreColorIndex: number;
  tool: number;
  zoom: number;
  showGridLines: boolean;
  transparentColor0: boolean;
}
