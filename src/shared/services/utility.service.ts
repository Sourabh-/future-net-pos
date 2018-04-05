import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular'

@Injectable()
export class UtilityService {
	public activeView = 'dashboard';
	public loader: any;

	constructor(
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController
	) {}

	setLocalStorage(key, json) {
		localStorage[key] = JSON.stringify(json);
	}

	getLocalStorage(key, isJson?) {
		if(localStorage[key]) return isJson ? JSON.parse(localStorage[key]) : localStorage[key]; 
		else return '';
	}

	deleteLocalStorage(key) {
		localStorage.removeItem(key);
	}

	showToast(msg) {
		let toast = this.toastCtrl.create({
	      message: msg.toUpperCase(),
	      duration: 3000
	    });
	    
	    toast.present(); 
	}

	getDate(date) {
		let _date = new Date(date);
	    let gap = Math.ceil((new Date().getTime() - _date.getTime())/(1000 * 60 * 60 * 24));
	    if(gap > 29) {
	      return ('0' + _date.getDate()).slice(-2) + '/'
	             + ('0' + (_date.getMonth()+1)).slice(-2) + '/'
	             + _date.getFullYear();
	    } else {
	      return gap + ' days ago';
	    }
	}

	showLoader() {
		this.loader = this.loadingCtrl.create({
	      content: "Please wait..."
	    });
		this.loader.present();
	}

	hideLoader() {
		this.loader.dismiss();
	}
}