import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PixelGridComponent } from './components/pixel-grid/pixel-grid.component';
import { PaletteComponent } from './components/palette/palette.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { ColorBoxComponent } from './components/color-box/color-box.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MenuComponent } from './components/menu/menu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MiniViewComponent } from './components/mini-view/mini-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelGridComponent,
    PaletteComponent,
    ToolboxComponent,
    ColorBoxComponent,
    MenuComponent,
    MiniViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
