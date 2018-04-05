import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneDrivePage2Component } from '../oneDrive-page-2/oneDrive-page-2.component';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'one-drive',
  templateUrl: 'oneDrive.component.html'
})
export class OneDriveComponent implements OnInit {
  
  public folders = [];
  constructor(
  	public navCtrl: NavController,
  	private oneDriveService: OneDriveService,
  	public utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.utilityService.showLoader();
  	this.oneDriveService.getFolders().subscribe(
  		(folders) => {
  			if(folders.value) {
  				this.oneDriveService.folders['all'] = folders.value;
  			} else {
  				this.oneDriveService.folders['all'] = [];
  			}

  			this.folders = this.oneDriveService.folders['all'];
        this.utilityService.hideLoader();
  		},
  		(err) => {
  			this.utilityService.showToast(err);
        this.utilityService.hideLoader();
  		})
  }

  handleClick(folder) {
  	if(folder.name.toLowerCase().indexOf('convany') == -1) {
  		this.utilityService.showToast('Cannot open this folder');
  	} else {
  		this.navCtrl.push(OneDrivePage2Component, { folder: folder });
  	}
  }
}
