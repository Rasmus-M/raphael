import {UndoableEdit} from '../interfaces/undoable-edit.js';

export class CompoundEdit implements UndoableEdit {

  private edits: UndoableEdit[];

  constructor() {
    this.edits = [];
  }

  addEdit(edit: UndoableEdit): void {
    if (edit) {
      this.edits.push(edit);
    }
  }

  undo(): void {
    for (let i = this.edits.length - 1; i >= 0; i--) {
      this.edits[i].undo();
    }
  }

  redo(): void {
    for (const edit of this.edits) {
      edit.redo();
    }
  }
}
