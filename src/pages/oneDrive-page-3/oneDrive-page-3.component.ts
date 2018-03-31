import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'one-drive-page-3',
  templateUrl: 'oneDrive-page-3.component.html'
})
export class OneDrivePage3Component {
  
  public superParent;
  public parent;
  public csvs = [
  	{ name: 'Day Total Files', time: '2 days ago' },
  	{ name: 'DDept', time: '2 days ago' },
  	{ name: 'ITEMFile', time: '2 days ago' },
  	{ name: 'items_live', time: '2 days ago' },
  	{ name: 'Orders', time: '2 days ago' },
  	{ name: 'plu_live', time: '2 days ago' },
  	{ name: 'WDept', time: '2 days ago' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.parent = navParams.data.folder;
  	this.superParent = navParams.data.parent;
  }

  handleClick(ev) {
  	
  }
}
