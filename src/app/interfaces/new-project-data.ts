import {AttributeMode} from '../enums/attribute-mode';

export interface NewProjectData {
  width: number;
  height: number;
  pixelScaleX: number;
  pixelScaleY: number;
  attributeMode: AttributeMode;
}
