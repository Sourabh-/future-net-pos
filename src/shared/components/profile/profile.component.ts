import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ViewController } from 'ionic-angular';
import { ProfileService } from '../../services/profile.service';
import { BlockerService } from '../../services/blocker.service';
import { AuthService } from '../../services/auth.service';
import { OneDriveService } from '../../services/oneDrive.service';
import { UtilityService } from '../../services/utility.service';
import { DashboardComponent } from '../../../pages/dashboard/dashboard.component';


@Component({
  template: `
    <ion-list style="margin: 0;">
      <ion-item class="pointer" (click)="signOut()">
        Sign Out
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(
    public viewCtrl: ViewController,
    public blockerService: BlockerService,
    public authService: AuthService,
    public oneDriveService: OneDriveService,
    public utilityService: UtilityService
  ) {}

  signOut() {
    this.viewCtrl.dismiss();
    this.utilityService.isMenuEnabled = false;
    this.oneDriveService.resetAll();
    this.authService.logout();
    window.localStorage.clear();
    this.blockerService.show(); 
  }
}

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  defaultProfileIcon = 'assets/imgs/user.png';
  profile:any = {
    displayName: 'Fetching...'
  };
  constructor(
    public profileService: ProfileService,
    public blockerService: BlockerService,
    public authService: AuthService,
    public oneDriveService: OneDriveService,
    public utilityService: UtilityService,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    //IF PROFILE EXIST, SET IT, ALSO SUBSCRIBE TO CHANGES
    this.profile = this.profileService.getProfile();

    this.profileService.profileUpdated.subscribe((profile) => {
      this.profile = profile;
    });
  }

  showDropdown(ev) {
   let popover = this.popoverCtrl.create(PopoverPage);
   popover.present({ ev: ev });
  }
}
