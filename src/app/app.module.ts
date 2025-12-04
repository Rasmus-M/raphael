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
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MenuComponent} from './components/menu/menu.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MiniViewComponent} from './components/mini-view/mini-view.component';
import {NewDialogComponent} from './dialogs/new-dialog/new-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {OpenDialogComponent} from './dialogs/open-dialog/open-dialog.component';
import {AboutDialogComponent} from './dialogs/about-dialog/about-dialog.component';
import {MatLegacyOptionModule as MatOptionModule} from '@angular/material/legacy-core';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {StatusBarComponent} from './components/status-bar/status-bar.component';
import {PropertiesDialogComponent} from './dialogs/properties-dialog/properties-dialog.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';

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
        MatDividerModule,
        MatToolbarModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
