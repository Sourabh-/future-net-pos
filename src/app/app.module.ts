import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {NgxPaginationModule} from 'ngx-pagination';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

import { RootComponent } from './app.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { OrderStatsDetailsComponent } from '../pages/orderStats-details/orderStats-details.component';
import { OneDriveComponent } from '../pages/oneDrive/oneDrive.component';
import { OrderStatsComponent } from '../pages/orderStats/orderStats.component';
import { StoreItemsComponent } from '../pages/storeItems/storeItems.component';
import { OneDrivePage2Component } from '../pages/oneDrive-page-2/oneDrive-page-2.component';
import { OneDrivePage3Component } from '../pages/oneDrive-page-3/oneDrive-page-3.component';
import { DashboardDetailsComponent } from '../pages/dashboard-details/dashboard-details.component';

import { SharedModule } from '../shared/shared.module';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

@NgModule({
  declarations: [
    RootComponent,
    DashboardComponent,
    DashboardDetailsComponent,
    OneDriveComponent,
    OrderStatsComponent,
    StoreItemsComponent,
    OneDrivePage2Component,
    OneDrivePage3Component,
    OrderStatsDetailsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(RootComponent),
    SharedModule,
    FusionChartsModule,
    NgxPaginationModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootComponent,
    DashboardComponent,
    DashboardDetailsComponent,
    OneDriveComponent,
    OrderStatsComponent,
    StoreItemsComponent,
    OneDrivePage2Component,
    OneDrivePage3Component,
    OrderStatsDetailsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
