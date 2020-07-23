import {AssemblyFileSection} from './assemblyFileSection';

export class AssemblyFile {

  private sections: AssemblyFileSection[];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.sections = [];
  }

  createSection(label: string): AssemblyFileSection {
    const section = new AssemblyFileSection(label);
    this.sections.push(section);
    return section;
  }

  addSection(section: AssemblyFileSection): void {
    this.sections.push(section);
  }

  toString(): string {
    let result = '';
    for (const section of this.sections) {
      result += section.toString();
    }
    return result;
  }
}
