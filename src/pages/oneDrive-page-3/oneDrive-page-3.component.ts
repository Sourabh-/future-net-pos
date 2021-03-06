import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneDriveService } from '../../shared/services/oneDrive.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'one-drive-page-3',
  templateUrl: 'oneDrive-page-3.component.html'
})
export class OneDrivePage3Component implements OnInit {
  
  public superParent:any;
  public parent:any;
  public csvs:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public utilityService: UtilityService,
    private oneDriveService: OneDriveService
  ) {
  	this.parent = navParams.data.folder;
  	this.superParent = navParams.data.parent;
  }

  init() {
    this.oneDriveService.getFolders(this.parent.id).subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders[this.parent.id] = folders.value;
        } else {
          this.oneDriveService.folders[this.parent.id] = [];
        }

        this.csvs = this.oneDriveService.folders[this.parent.id].map((csv) => {
          csv.name = csv.name.split(".")[0];
          return csv;
        });
        this.utilityService.hideLoader();
      },
      (err) => {
        this.utilityService.showToast(err);
        this.utilityService.hideLoader();
      })

    this.oneDriveService.resetApp.subscribe(() => {
      this.parent = null;
      this.superParent = null;
      this.csvs = [];
    })
  }

  ngOnInit() {
    this.init();
    this.oneDriveService.reauthsuccess.subscribe(() => { this.init() });
  }

  handleClick(ev) {
  	
  }

  goBack() {
    this.navCtrl.pop({ 'animate': false });
  }
}
