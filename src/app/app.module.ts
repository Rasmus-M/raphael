import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PixelGridComponent } from './components/pixel-grid/pixel-grid.component';
import { PaletteComponent } from './components/palette/palette.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { ColorComponent } from './components/color/color.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';

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
    BrowserAnimationsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
