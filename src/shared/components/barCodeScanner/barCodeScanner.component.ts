import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { BarCodeScannerService } from '../../services/barCodeScanner.service';
import { UtilityService } from '../../services/utility.service';
import { OneDriveService } from '../../services/oneDrive.service';
import { StoreItemsComponent } from '../../../pages/storeItems/storeItems.component';

@Component({
  selector: 'bar-code-scanner',
  templateUrl: 'barCodeScanner.component.html'
})
export class BarCodeScannerComponent {
	constructor(
		private barCodeScannerService: BarCodeScannerService,
		private utilityService: UtilityService,
		public oneDriveService: OneDriveService,
		protected app: App
	) {}

	scan() {
		this.barCodeScannerService.scan()
		.then((barCode) => {
			let barCodes = this.oneDriveService.barCodes[this.oneDriveService.selectedCityId].values;
			for(let i=0; i<barCodes.length; i++) {
				let code = barCodes[i][0].split("=")[0];
				if(barCode == code) {
					this.utilityService.activeView = 'dashboard';
					this.navCtrl.push(StoreItemsComponent, { itemNo: barCodes[i][0].split("^")[1] });
					return;
				}
			}

			this.utilityService.showToast("NO MATCH FOUND.");
		})
		.catch((msg) => {
			this.utilityService.showToast(msg);
		})
	}

	get navCtrl(): NavController {
	   return this.app.getRootNav();
	}
}
