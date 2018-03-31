import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderStatsDetailsComponent } from '../orderStats-details/orderStats-details.component';

@Component({
  selector: 'order-stats',
  templateUrl: 'orderStats.component.html'
})
export class OrderStatsComponent {

  constructor(public navCtrl: NavController) {

  }

  navigateToDetails(row) {
  	this.navCtrl.push(OrderStatsDetailsComponent);
  }

}
