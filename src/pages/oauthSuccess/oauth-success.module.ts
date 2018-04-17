import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OauthSuccessPage } from './oauth-success';

@NgModule({
  declarations: [
    OauthSuccessPage
  ],
  imports: [
    IonicPageModule.forChild(OauthSuccessPage)
  ],
  entryComponents: [
    OauthSuccessPage
  ],
  exports: [
  	OauthSuccessPage
  ]
})
export class OauthSuccessModule {}