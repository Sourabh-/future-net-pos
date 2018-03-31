import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { OneDriveComponent } from '../pages/oneDrive/oneDrive.component';
import { OrderStatsComponent } from '../pages/orderStats/orderStats.component';
import { StoreItemsComponent } from '../pages/storeItems/storeItems.component';

import { UtilityService } from '../shared/services/utility.service';

@Component({
  templateUrl: 'app.component.html'
})
export class RootComponent {
  rootPage:any = DashboardComponent;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public utilityService: UtilityService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  navigate(where) {
    this.utilityService.activeView = where;
    switch (where) {
      case "dashboard":
        this.rootPage = DashboardComponent;
        break;
      case "onedrive":
        this.rootPage = OneDriveComponent;
        break;
      case "orderstats":
        this.rootPage = OrderStatsComponent;
        break;
      default:
        this.rootPage = StoreItemsComponent;
        break;
    }
  }
}

