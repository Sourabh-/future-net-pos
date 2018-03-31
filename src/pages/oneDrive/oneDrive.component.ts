import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneDrivePage2Component } from '../oneDrive-page-2/oneDrive-page-2.component';

@Component({
  selector: 'one-drive',
  templateUrl: 'oneDrive.component.html'
})
export class OneDriveComponent {
  
  public folders = [{ name: 'Conv Anywhere', time: '2 days ago' }];
  constructor(public navCtrl: NavController) {

  }

  handleClick(folder) {
  	this.navCtrl.push(OneDrivePage2Component, { folder: folder });
  }
}
