import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MenuComponent } from './components/menu/menu.component';
import { FoldersComponent } from './components/folders/folders.component';
import { CsvCardsComponent } from './components/csvCards/csvCards.component';
import { AppTableComponent } from './components/appTable/appTable.component';
import { UtilityService } from './services/utility.service';

@NgModule({
  declarations: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
  exports: [
    MenuComponent,
    FoldersComponent,
    CsvCardsComponent,
    AppTableComponent
  ],
  providers: [
    UtilityService
  ]
})
export class SharedModule {
  
}
