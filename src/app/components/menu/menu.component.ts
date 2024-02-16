import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExportOptions, PixelPacking} from '../../services/export.service';
import {AttributeMode} from '../../enums/attribute-mode';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  @Input() showGridLines: boolean;
  @Input() transparentColor0: boolean;
  @Input() attributeMode: AttributeMode;

  @Output() newClicked = new EventEmitter();
  @Output() openClicked = new EventEmitter();
  @Output() saveClicked = new EventEmitter();
  @Output() propertiesClicked = new EventEmitter();
  @Output() importPNGClicked = new EventEmitter();
  @Output() exportPNGClicked = new EventEmitter();
  @Output() exportBinaryClicked = new EventEmitter<ExportOptions>();
  @Output() exportAssemblyClicked = new EventEmitter<ExportOptions>();
  @Output() exportMonochromeLinearAssemblyClicked = new EventEmitter();
  @Output() exportHexClicked = new EventEmitter();
  @Output() showGridLinesChange = new EventEmitter<boolean>();
  @Output() transparentColor0Change = new EventEmitter<boolean>();
  @Output() aboutClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  new(): void {
    this.newClicked.emit();
  }

  open(): void {
    this.openClicked.emit();
  }

  save(): void {
    this.saveClicked.emit();
  }

  properties(): void {
    this.propertiesClicked.emit();
  }

  importPNG(): void {
    this.importPNGClicked.emit();
  }

  exportPNG(): void {
    this.exportPNGClicked.emit();
  }

  exportBinary(columns: boolean, packing?: PixelPacking): void {
    if (!packing) {
      packing = this.isAttributeMode1x1() ? '4_BPP' : '1_BPP';
    }
    this.exportBinaryClicked.emit({columns, packing});
  }

  exportAssembly(columns: boolean, packing?: PixelPacking): void {
    if (!packing) {
      packing = this.isAttributeMode1x1() ? '4_BPP' : '1_BPP';
    }
    this.exportAssemblyClicked.emit({columns, packing});
  }

  exportMonochromeLinearAssembly(): void {
    this.exportMonochromeLinearAssemblyClicked.emit();
  }

  exportHex(): void {
    this.exportHexClicked.emit();
  }

  toggleGridLines(): void {
    this.showGridLinesChange.emit(this.showGridLines);
  }

  toggleTransparentColor0(): void {
    this.transparentColor0Change.emit(this.transparentColor0);
  }

  about(): void {
    this.aboutClicked.emit();
  }

  isAttributeMode1x1(): boolean {
    return this.attributeMode === AttributeMode.ONE_X_ONE;
  }

  isAttributeMode8x1(): boolean {
    return this.attributeMode === AttributeMode.EIGHT_X_ONE;
  }

  isAttributeMode8x8(): boolean {
    return this.attributeMode === AttributeMode.EIGHT_X_EIGHT;
  }
}
