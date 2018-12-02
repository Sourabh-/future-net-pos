import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { DashboardComponent } from '../../../pages/dashboard/dashboard.component';
import { OneDriveComponent } from '../../../pages/oneDrive/oneDrive.component';
import { OrderStatsComponent } from '../../../pages/orderStats/orderStats.component';
import { StoreItemsComponent } from '../../../pages/storeItems/storeItems.component';
import { UtilityService } from '../../services/utility.service';
import { OneDriveService } from '../../services/oneDrive.service';

@Component({
  selector: 'menu',
  templateUrl: 'menu.component.html'
})
export class MenuComponent {

  constructor(
    public navCtrl: NavController, 
    public utilityService: UtilityService,
    public oneDriveService: OneDriveService,
    private app: App
  ) {
  	
  }

  navigate(where) {
  	this.utilityService.activeView = where;
  	switch (where) {
  		case "dashboard":
        if(this.navCtrl.getActive().name === 'DashboardComponent') return;
  			this.navCtrl.push(DashboardComponent, {}, { 'animate': false });
  			break;
  		case "onedrive":
        if(this.navCtrl.getActive().name === 'OneDriveComponent') return;
  			this.navCtrl.push(OneDriveComponent, {}, { 'animate': false });
  			break;
  		case "orderstats":
        if(this.navCtrl.getActive().name === 'OrderStatsComponent') return;
  			this.navCtrl.push(OrderStatsComponent, {}, { 'animate': false });
  			break;
  		default:
        if(this.navCtrl.getActive().name === 'StoreItemsComponent') return;
  			this.navCtrl.push(StoreItemsComponent, {}, { 'animate': false });
  			break;
  	}
  }

  takeMeHome() {
    if(this.utilityService.activeView !== 'dashboard') {
      this.utilityService.activeView = 'dashboard';
      this.navCtrl.push(DashboardComponent, {}, { 'animate': false });
    }
  }
}
