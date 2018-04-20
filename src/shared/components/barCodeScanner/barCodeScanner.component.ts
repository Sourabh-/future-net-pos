import { Component } from '@angular/core';
import { BarCodeScannerService } from '../../services/barCodeScanner.service';
import { UtilityService } from '../../services/utility.service';
import { OneDriveService } from '../../services/oneDrive.service';

@Component({
  selector: 'bar-code-scanner',
  templateUrl: 'barCodeScanner.component.html'
})
export class BarCodeScannerComponent {
	constructor(
		private barCodeScannerService: BarCodeScannerService,
		private utilityService: UtilityService,
		public oneDriveService: OneDriveService
	) {}

	scan() {
		this.barCodeScannerService.scan()
		.then((barCode) => {

		})
		.catch((msg) => {
			this.utilityService.showToast(msg);
		})
	}
}
