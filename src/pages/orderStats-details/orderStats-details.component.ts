import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'order-stats-details',
  templateUrl: 'orderStats-details.component.html'
})
export class OrderStatsDetailsComponent {

  public items = [
    ['1833166', '14th Jan, 2017 10:54 AM']
  ];

  public header = [
  	'#', 
  	'DATE', 
  	'TIME', 
  	'ORDER NO.', 
  	'ITEM NO.', 
  	'DESCRIPTION', 
  	'CTNS ORD', 
  	'UNITS ORD', 
  	'CORG RNG?', 
  	'SLOW', 
  	'VARIETY'
  ];

  public rows = [
  		[ 
  			{value: '1', class: ''},
  			{value: '15-Jan-2018', class: ''},
  			{value: '10:54:23 am', class: ''},
  			{value: '1833166', class: 'text-bold'},
  			{value: '731397', class: 'text-bold'},
  			{value: 'SURPRISE 5 DRK AP/BLKCRNT250ML', class: ''},
  			{value: '1', class: ''},
  			{value: '1', class: ''},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'Y', class: 'text-bold text-green'}
  		],
  		[ 
  			{value: '1', class: ''},
  			{value: '15-Jan-2018', class: ''},
  			{value: '10:54:23 am', class: ''},
  			{value: '1833166', class: 'text-bold'},
  			{value: '731397', class: 'text-bold'},
  			{value: 'SURPRISE 5 DRK AP/BLKCRNT250ML', class: ''},
  			{value: '1', class: ''},
  			{value: '1', class: ''},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'Y', class: 'text-bold text-green'}
  		],
  		[ 
  			{value: '1', class: ''},
  			{value: '15-Jan-2018', class: ''},
  			{value: '10:54:23 am', class: ''},
  			{value: '1833166', class: 'text-bold'},
  			{value: '731397', class: 'text-bold'},
  			{value: 'SURPRISE 5 DRK AP/BLKCRNT250ML', class: ''},
  			{value: '1', class: ''},
  			{value: '1', class: ''},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'Y', class: 'text-bold text-green'}
  		],
  		[ 
  			{value: '1', class: ''},
  			{value: '15-Jan-2018', class: ''},
  			{value: '10:54:23 am', class: ''},
  			{value: '1833166', class: 'text-bold'},
  			{value: '731397', class: 'text-bold'},
  			{value: 'SURPRISE 5 DRK AP/BLKCRNT250ML', class: ''},
  			{value: '1', class: ''},
  			{value: '1', class: ''},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'N', class: 'text-bold text-red'},
  			{value: 'Y', class: 'text-bold text-green'}
  		],
  ];

  public isShown:boolean = false;

  constructor(public navCtrl: NavController) {

  }

}
