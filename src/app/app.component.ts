import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Platform, ToastController, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { OauthSuccessPage } from '../pages/oauthSuccess/oauth-success';
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

  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  public isBusy = false;
  public defaultProfileIcon = 'assets/imgs/user.png';
  public userPrincipalName = '';
  public selectedCity: string;
  public whicCm:string; //Determine if oauth success page

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public utilityService: UtilityService,
    public authService: AuthService,
    public toastCtrl: ToastController,
    private oneDriveService: OneDriveService,
    private profileService: ProfileService,
    private blockerService: BlockerService,
    private app: App
  ) {

    if(window.location.hash || window.location.search) {
      this.rootPage = OauthSuccessPage;
      this.whicCm = 'OA';
    } else {
      this.rootPage = DashboardComponent;
      this.whicCm = 'DC';
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if(this.whicCm == 'DC') {
        this.blockerService.show();
        this.callOneDrive();
      }

      this.oneDriveService.selectedCityUpdated.subscribe(() => {
        this.selectedCity = this.oneDriveService.selectedCity;
      })

      this.app.viewDidEnter.subscribe(viewCtrl => {
        setTimeout( () => {
          if(this.nav.getActive().name == 'OrderStatsDetailsComponent') {
            this.utilityService.selectDisabled = true;
          } else 
            this.utilityService.selectDisabled = false;
        }, 500);
      })
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
        if(!force) window.localStorage.removeItem('hello');
        this.authService.login(force)
        .then((res) => {
          this.isBusy = false;
          if(!force) {
            this.nav.popToRoot();
            this.utilityService.activeView = 'dashboard';
          } else {
            this.oneDriveService.reauthDone();
          }

          //GET PROFILE
          this.getMyProfile();
          this.getOneDriveFolders();
        })
        .catch((e) => {
          //Needed for electron to work!
          if(!force && localStorage.hello) {
            this.nav.popToRoot();
            this.utilityService.activeView = 'dashboard';
            this.getMyProfile();
            this.getOneDriveFolders();
          } else {
            console.error(e.error.message);
            this.isBusy = false;
            this.utilityService.showToast(e.error.message);
            this.utilityService.hideLoader();
            this.utilityService.isMenuEnabled = false;
          }
        })
      } else {
        this.isBusy = false;
        this.getMyProfile();
        this.getMyPhoto();
        this.getOneDriveFolders();
      }
    }
  }

  getMyPhoto() {
    this.oneDriveService.getPhoto().subscribe(
      (res) => {},
      (msg) => {}
    )
  }

  getMyProfile() {
    this.blockerService.hide();
    this.utilityService.isMenuEnabled = true;
    let _profile = this.utilityService.getLocalStorage('profile', true); 
    if(_profile) {
      this.profileService.setProfile(_profile);
      this.userPrincipalName = _profile.userPrincipalName;
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
              this.oneDriveService.convId = folders.value[i].id;
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
          this.authService.tokenReceived.emit(fo.id);
          return this.getAllContent(folders.value);
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

  getAllContent(filesInfo) {
    let count = filesInfo.length;
    let breakout = 0;
    let pluLiveFiles = [];
    let itemsLiveFiles = [];
    for(let i=0; i<filesInfo.length; i++) {
      ((i) => {
        this.oneDriveService.getFolders(filesInfo[i].id)
        .subscribe(
          (res) => {
            if(res.value) {
              for(let j=0; j < res.value.length; j++) {
                if(res.value[j].name.toLowerCase().indexOf('plu_live') > -1) {
                  pluLiveFiles.push({
                    id: res.value[j].id,
                    cityId: filesInfo[i].id
                  });
                } else if(res.value[j].name.toLowerCase().indexOf('items_live') > -1) {
                  itemsLiveFiles.push({
                    id: res.value[j].id,
                    cityId: filesInfo[i].id
                  });
                } else if(res.value[j].name.toLowerCase().indexOf('changelog') > -1) {
                  this.oneDriveService.logFileIds[filesInfo[i].id] = res.value[j].id;
                }
              }
            }

            this.oneDriveService.folders[filesInfo[i].id] = res.value || [];
            count--;
            if(count == 0 && breakout == 0) {
              this.getPluLiveFiles(pluLiveFiles);
              this.getItemFilesContent(itemsLiveFiles);
            } 
          },
          (msg) => {
            breakout = 1;
            this.utilityService.showToast(msg);
          }
        )
      })(i);
    }
  }

  getPluLiveFiles(files) {
    let count = files.length;
    for(let i=0; i< files.length; i++) {
      ((i) => {
        this.oneDriveService.getWorkbook(files[i].id, 'plu_live')
        .subscribe(
         (res) => {
           this.oneDriveService.worksheets[files[i].id] = res;
           this.oneDriveService.barCodes[files[i].cityId] = res;
           count--;
           if(count === 0) {
             this.oneDriveService.showScanner = true;
           }
         },
         (msg) => {
           this.utilityService.showToast(msg);
         })
      })(i);
    }
  }

  getItemFilesContent(files) {
    let count = files.length;
    if(!files.length) this.utilityService.hideLoader();

    for(let i=0; i< files.length; i++) {
      ((i) => {
        this.oneDriveService.getWorkbook(files[i].id, 'items_live')
        .subscribe(
         (res) => {
           this.oneDriveService.worksheets[files[i].id] = res;
           this.oneDriveService.itemsAddressRange[files[i].cityId] = res.address;
           count--;
           if(count == 0)
             this.utilityService.hideLoader();
         },
         (msg) => {
           this.utilityService.showToast(msg);
           this.utilityService.hideLoader();
         })
      })(i);
    }
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

  changeCity() {
    for(let i=0; i<this.oneDriveService.cities.length; i++) {
      if(this.selectedCity === this.oneDriveService.cities[i].name) {
        this.oneDriveService.setCity(this.oneDriveService.cities[i].name, this.oneDriveService.cities[i].id);
      }
    }
  }
  
  signOut() {
    this.authService.logout();
    this.oneDriveService.resetAll();
    this.utilityService.isMenuEnabled = false;
    window.localStorage.clear();
    this.blockerService.show(); 
  }
}

