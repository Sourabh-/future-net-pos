import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicModule } from 'ionic-angular';
import {NgxPaginationModule} from 'ngx-pagination';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { MenuComponent } from './components/menu/menu.component';
import { FoldersComponent } from './components/folders/folders.component';
import { CsvCardsComponent } from './components/csvCards/csvCards.component';
import { AppTableComponent } from './components/appTable/appTable.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlockerComponent } from './components/blocker/blocker.component';
import { BarCodeScannerComponent } from './components/barCodeScanner/barCodeScanner.component';
import { EditItemsModalComponent } from './components/editItemsModal/editItemsModal.component';

import { UtilityService } from './services/utility.service';
import { AuthService } from './services/auth.service';
import { OneDriveService } from './services/oneDrive.service';
import { ProfileService } from './services/profile.service';
import { BlockerService } from './services/blocker.service';
import { BarCodeScannerService } from './services/barCodeScanner.service';

import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent,
    ProfileComponent,
    BlockerComponent,
    SearchPipe,
    BarCodeScannerComponent,
    EditItemsModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule,
    HttpModule,
    NgxPaginationModule
  ],
  entryComponents: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent,
    ProfileComponent,
    BlockerComponent,
    BarCodeScannerComponent,
    EditItemsModalComponent
  ],
  exports: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent,
    ProfileComponent,
    BlockerComponent,
    SearchPipe,
    BarCodeScannerComponent,
    EditItemsModalComponent
  ],
  providers: [
    BarcodeScanner,
    UtilityService,
    AuthService,
    OneDriveService,
    ProfileService,
    BlockerService,
    BarCodeScannerService
  ]
})
export class SharedModule {
  
}
