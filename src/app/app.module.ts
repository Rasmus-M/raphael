import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PixelGridComponent} from './components/pixel-grid/pixel-grid.component';
import {PaletteComponent} from './components/palette/palette.component';
import {ToolboxComponent} from './components/toolbox/toolbox.component';
import {ColorBoxComponent} from './components/color-box/color-box.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MenuComponent} from './components/menu/menu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MiniViewComponent} from './components/mini-view/mini-view.component';
import {NewDialogComponent} from './dialogs/new-dialog/new-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {OpenDialogComponent} from './dialogs/open-dialog/open-dialog.component';
import {AboutDialogComponent} from './dialogs/about-dialog/about-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelGridComponent,
    PaletteComponent,
    ToolboxComponent,
    ColorBoxComponent,
    MenuComponent,
    MiniViewComponent,
    NewDialogComponent,
    OpenDialogComponent,
    AboutDialogComponent
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
        MatButtonToggleModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
