import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneDrivePage3Component } from '../oneDrive-page-3/oneDrive-page-3.component';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'one-drive-page-2',
  templateUrl: 'oneDrive-page-2.component.html'
})
export class OneDrivePage2Component implements OnInit {
  
  public folders:any = [];

  public parent:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public utilityService: UtilityService,
    private oneDriveService: OneDriveService
  ) {
  	this.parent = navParams.data.folder;
  }

  init() {
    this.utilityService.showLoader();
    this.oneDriveService.getFolders(this.parent.id).subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders[this.parent.id] = folders.value;
        } else {
          this.oneDriveService.folders[this.parent.id] = [];
        }

        this.utilityService.hideLoader();
        this.folders = this.oneDriveService.folders[this.parent.id];
      },
      (err) => {
        this.utilityService.showToast(err);
        this.utilityService.hideLoader();
      })

    this.oneDriveService.resetApp.subscribe(() => {
      this.folders = [];
      this.parent = null;
    })
  }

  ngOnInit() {
    this.init();
    this.oneDriveService.reauthsuccess.subscribe(() => { this.init() });
  }

  handleClick(folder) {
  	this.navCtrl.push(OneDrivePage3Component, { folder: folder, parent: this.parent });
  }
}
