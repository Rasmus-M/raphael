export interface UndoableEdit {
  undo: () => void;
  redo: () => void;
}
