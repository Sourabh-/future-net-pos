import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneDrivePage3Component } from '../oneDrive-page-3/oneDrive-page-3.component';

@Component({
  selector: 'one-drive-page-2',
  templateUrl: 'oneDrive-page-2.component.html'
})
export class OneDrivePage2Component {
  
  public folders = [
  	{ name: 'Burleigh', time: '2 days ago' },
  	{ name: 'Helensvale', time: '2 days ago' },
  	{ name: 'Yungaburra', time: '2 days ago' }
  ];

  public parent;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.parent = navParams.data.folder;
  }

  handleClick(folder) {
  	this.navCtrl.push(OneDrivePage3Component, { folder: folder, parent: this.parent });
  }
}
