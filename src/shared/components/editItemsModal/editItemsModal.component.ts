import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { OneDriveService } from '../../services/oneDrive.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'edit-items-modal',
  templateUrl: 'editItemsModal.component.html'
})
export class EditItemsModalComponent implements OnInit {

	item: any = {};
	func: Function;

	constructor(
		public oneDriveService: OneDriveService,
		public utilityService: UtilityService,
		public params: NavParams,
		public viewCtrl: ViewController
	) {
		this.item = params.get('item');
		this.func = params.get('func');
	}

	ngOnInit() {
		
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	save() {
		if(this.func) this.func(this.item);
		this.dismiss();
	}
}