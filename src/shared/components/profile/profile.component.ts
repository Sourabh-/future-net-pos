import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

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
    public profileService: ProfileService
  ) {}

  ngOnInit() {
    //IF PROFILE EXIST, SET IT, ALSO SUBSCRIBE TO CHANGES
    this.profile = this.profileService.getProfile();

    this.profileService.profileUpdated.subscribe((profile) => {
      this.profile = profile;
    });
  }
}
