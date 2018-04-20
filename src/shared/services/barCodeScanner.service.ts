import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Injectable()
export class BarCodeScannerService {
	constructor(private barcodeScanner: BarcodeScanner) {

	}

	async scan() {
		return await this.barcodeScanner.scan();
	}
}