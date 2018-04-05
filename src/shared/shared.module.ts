import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicModule } from 'ionic-angular';
import {NgxPaginationModule} from 'ngx-pagination';

import { MenuComponent } from './components/menu/menu.component';
import { FoldersComponent } from './components/folders/folders.component';
import { CsvCardsComponent } from './components/csvCards/csvCards.component';
import { AppTableComponent } from './components/appTable/appTable.component';
import { ProfileComponent } from './components/profile/profile.component';

import { UtilityService } from './services/utility.service';
import { AuthService } from './services/auth.service';
import { OneDriveService } from './services/oneDrive.service';
import { ProfileService } from './services/profile.service';

@NgModule({
  declarations: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    IonicModule,
    HttpModule,
    NgxPaginationModule
  ],
  exports: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent,
    ProfileComponent
  ],
  providers: [
    UtilityService,
    AuthService,
    OneDriveService,
    ProfileService
  ]
})
export class SharedModule {
  
}
