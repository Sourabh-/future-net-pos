import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { ProfileService } from '../../services/profile.service';
import { BlockerService } from '../../services/blocker.service';
import { AuthService } from '../../services/auth.service';
import { OneDriveService } from '../../services/oneDrive.service';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  defaultProfileIcon = '../../assets/imgs/user.png';
  profile:any = {
    displayName: 'Fetching...'
  };
  constructor(
    public profileService: ProfileService,
    public actionSheetCtrl: ActionSheetController,
    public blockerService: BlockerService,
    public authService: AuthService,
    public oneDriveService: OneDriveService
  ) {}

  ngOnInit() {
    //IF PROFILE EXIST, SET IT, ALSO SUBSCRIBE TO CHANGES
    this.profile = this.profileService.getProfile();

    this.profileService.profileUpdated.subscribe((profile) => {
      this.profile = profile;
    });
  }

  showDropdown() {
   let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Sign Out',
          handler: () => {
            this.authService.logout();
            window.localStorage.clear();
            this.blockerService.show(); 
          }
        }
      ]
   });
   actionSheet.present();
  }
}
