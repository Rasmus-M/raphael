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
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {StatusBarComponent} from './components/status-bar/status-bar.component';
import {PropertiesDialogComponent} from './dialogs/properties-dialog/properties-dialog.component';
import {MatDividerModule} from '@angular/material/divider';

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
    AboutDialogComponent,
    StatusBarComponent,
    PropertiesDialogComponent
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
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
