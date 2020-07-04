import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {UndoableEdit} from '../interfaces/undoable-edit.js';

export interface UndoManagerStatus {
  canUndo: boolean;
  canRedo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UndoManagerService {

  private edits: UndoableEdit[];
  private index: number; // Index of next add

  private subject: Subject<UndoManagerStatus> = new Subject<UndoManagerStatus>();
  private observable: Observable<UndoManagerStatus> = this.subject.asObservable();

  constructor() {
    this.discardAllEdits();
  }

  discardAllEdits(): void {
    this.edits = [];
    this.index = 0;
    this.notifyChanges();
  }

  addEdit(edit: UndoableEdit): void {
    this.edits[this.index++] = edit;
    this.edits.splice(this.index);
    this.notifyChanges();
  }

  undo(): void {
    if (this.canUndo()) {
      const edit = this.edits[--this.index];
      edit.undo();
      this.notifyChanges();
    }
  }

  redo(): void {
    if (this.canRedo()) {
      const edit = this.edits[this.index++];
      edit.redo();
      this.notifyChanges();
    }
  }

  canUndo(): boolean {
    return this.index > 0;
  }

  canRedo(): boolean {
    return this.index < this.edits.length;
  }

  subscribe(handler: (UndoManagerStatus) => void): Subscription {
    return this.observable.subscribe(handler);
  }

  private notifyChanges(): void {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    this.subject.next({ canUndo, canRedo });
  }
}
