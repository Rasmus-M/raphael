import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PixelGridComponent } from './pixel-grid/pixel-grid.component';
import { PaletteComponent } from './palette/palette.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { ColorComponent } from './color/color.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelGridComponent,
    PaletteComponent,
    ToolboxComponent,
    ColorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
