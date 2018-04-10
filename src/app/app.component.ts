import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { OneDriveComponent } from '../pages/oneDrive/oneDrive.component';
import { OrderStatsComponent } from '../pages/orderStats/orderStats.component';
import { StoreItemsComponent } from '../pages/storeItems/storeItems.component';

import { UtilityService } from '../shared/services/utility.service';
import { AuthService } from '../shared/services/auth.service';
import { OneDriveService } from '../shared/services/oneDrive.service';
import { ProfileService } from '../shared/services/profile.service';
import { BlockerService } from '../shared/services/blocker.service';

@Component({
  templateUrl: 'app.component.html'
})
export class RootComponent implements OnInit {
  rootPage:any = DashboardComponent;
  public isBusy = false;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public utilityService: UtilityService,
    public authService: AuthService,
    public toastCtrl: ToastController,
    private oneDriveService: OneDriveService,
    private profileService: ProfileService,
    private blockerService: BlockerService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.blockerService.show();
      this.callOneDrive();
    });
  }

  ngOnInit() {
    this.oneDriveService.reauth.subscribe(() => {
      this.callOneDrive(true);
    })
  }

  callOneDrive(force?) {
    if(!this.isBusy) {
      this.utilityService.showLoader();
      this.isBusy = true;
      this.authService.initAuth();
      //LOGIN
      if(!localStorage.hello || force) {
        this.authService.login(force)
        .then((res) => {
          this.isBusy = false;
          //GET PROFILE
          this.getMyProfile();
          this.getOneDriveFolders();
        })
        .catch((e) => {
          console.error(e.error.message);
          this.isBusy = false;
          this.utilityService.showToast(e.error.message);
          this.utilityService.hideLoader();
        })
      } else {
        this.isBusy = false;
        this.getMyProfile();
        this.getOneDriveFolders();
      }
    }
  }

  getMyProfile() {
    this.blockerService.hide();
    let _profile = this.utilityService.getLocalStorage('profile', true); 
    if(_profile) {
      this.profileService.setProfile(_profile);
    } else {
      this.oneDriveService.getProfile().subscribe(
        (profile) => {
          this.utilityService.setLocalStorage('profile', profile);
          this.profileService.setProfile(profile);
        },
        (msg) => {
          console.error(msg);
          this.utilityService.showToast(msg);
        }
      )
    }
  }

  getOneDriveFolders() {
    this.oneDriveService.getFolders().subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders['all'] = folders.value;
          for(let i=0; i<folders.value.length; i++) {
            if(folders.value[i].name.toLowerCase().indexOf('convany') > -1) {
              this.getSecondFolders(folders.value[i]);
              return;
            }
          }
          this.utilityService.hideLoader();
        } else {
          this.oneDriveService.folders['all'] = [];
          this.utilityService.hideLoader();
        }
      },
      (err) => {
        this.utilityService.showToast(err);
        this.utilityService.hideLoader();
      })
  }

  getSecondFolders(fo) {
    this.oneDriveService.getFolders(fo.id).subscribe(
      (folders) => {
        if(folders.value) {
          this.oneDriveService.folders[fo.id] = folders.value;
          this.oneDriveService.setCity(folders.value[0].name, folders.value[0].id);
          this.oneDriveService.cities = folders.value;
        } else {
          this.oneDriveService.folders[fo.id] = [];
        }
        this.utilityService.hideLoader();
      },
      (err) => {
        this.utilityService.showToast(err);
        this.utilityService.hideLoader();
      })
  }

  navigate(where) {
    this.utilityService.activeView = where;
    switch (where) {
      case "dashboard":
        this.rootPage = DashboardComponent;
        break;
      case "onedrive":
        this.rootPage = OneDriveComponent;
        break;
      case "orderstats":
        this.rootPage = OrderStatsComponent;
        break;
      default:
        this.rootPage = StoreItemsComponent;
        break;
    }
  }

  signOut() {
    this.authService.logout();
    window.localStorage.clear();
    this.blockerService.show(); 
  }
}

