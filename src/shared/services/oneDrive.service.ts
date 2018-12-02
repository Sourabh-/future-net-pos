import { Injectable, EventEmitter } from '@angular/core';
import * as hello from 'hellojs/dist/hello.all.js';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { ProfileService } from './profile.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';

function extractData(res: Response): any {
  const body = res.json();
  return body || {};
}

function handleError(res: Response, cb) {
  const error = res.json();
  if(res.status == 401) {
  	cb();
  }

  const errorMessage = error.message ? error.message :
    res.status ? `${res.status} - ${res.statusText}` : 'Server error';

  return Observable.throw(res.status == 401 ? '' : res.status == 504 ? '' : errorMessage);
}

@Injectable()
export class OneDriveService {
	URL = 'https://graph.microsoft.com/v1.0';
	URLBeta = 'https://graph.microsoft.com/beta';

	folders: any = {};
	worksheets: any = {};
	barCodes: any = {};
	selectedCity: string = "";
	selectedCityId: string = "";
	selectedCityUpdated: EventEmitter<any> = new EventEmitter();
	cities = [];
	reauth: EventEmitter<void> = new EventEmitter();
	photo: any;
	convId: string = "";
	totals: any;
	reauthsuccess: EventEmitter<void> = new EventEmitter();
	resetApp: EventEmitter<void> = new EventEmitter();
	showScanner: boolean = false;
	itemsAddressRange: any = {}; 
	logFileIds: any = {};
	driveId: string = '';

	constructor(
		private http: Http,
		private authService: AuthService,
		private profileService: ProfileService
	) {

	}

	setCity(city, id) {
		this.selectedCity = city;
		this.selectedCityId = id;
		this.selectedCityUpdated.emit();
	}

	changeCity(city) {
	    for(let i=0; i<this.cities.length; i++) {
	      if(city.toLowerCase() === this.cities[i].name.toLowerCase()) {
	        this.setCity(this.cities[i].name, this.cities[i].id);
	      }
	    }
	}

	getProfile() {
		return this.http
	      .get(`${this.URL}/me`, this.authService.getAuthRequestOptions())
	      .map(extractData)
	      .catch((res: Response) => {
	      	return handleError(res, () => {
	      		this.reauth.emit();
	      	});
	      });
	}

	getPhoto() {
		let headers = this.authService.getAuthRequestOptions();
		headers['responseType'] = ResponseContentType.Blob;

		return this.http
	      .get(`${this.URLBeta}/me/photo/$value`, headers)
	      .map((res) => {
	      	let image:Blob = res.blob();
	      	let reader = new FileReader();
		    reader.addEventListener("load", () => {
		      this.photo = reader.result;
		    }, false);

		    if (image) {
		      reader.readAsDataURL(image);
		    }
	      })
	      .catch((res: Response) => {
	      	return handleError(res, () => {
	      		this.reauth.emit();
	      	});
	      });
	}

	getFolders(id?): Observable<any> {
		if(id && this.folders[id]) {
			return Observable.of(this.folders[id]).map(fo => ({ value: fo }));
		} else if(!id && this.folders.all) {
			return Observable.of(this.folders.all).map(fo => ({ value: fo }));
		} else {
			return this.http
		      .get(this.URL + (!id ? '/me/drive/root/children' : `/me/drive/items/${id}/children`), this.authService.getAuthRequestOptions())
		      .map(extractData)
		      .catch((res: Response) => {
		      	return handleError(res, () => {
		      		this.reauth.emit();
		      	});
		      });
		}
	}

	getWorkbook(id): Observable<any> {
		if(this.worksheets[id]) {
			return Observable.of(this.worksheets[id]).map(ws => (ws));
		} else {
			return this.http
		      .get(`${this.URL}/me/drives/${this.driveId}/items/${id}/content`, this.authService.getAuthRequestOptions())
		      .map((res) => {
		      	if(res['_body']) {
		      		let body = res['_body'];
		      		let values = body.split('\n').map((val) => { return val.split(",")});
		      		return { values };
		      	} else {
		      		return {};
		      	}
		      })
		      .catch((res: Response) => {
		      	return handleError(res, () => {
		      		this.reauth.emit();
		      	});
		      });
		}
	}

	updateItemWorkbook(id, content, path) {
		let body = JSON.stringify({
			item: {
			  "@microsoft.graph.conflictBehavior": "replace",
			  "description": "",
			  "fileSystemInfo": { "@odata.type": "microsoft.graph.fileSystemInfo" },
			  "name": "items_live.csv"
			}
		});

		return this.http
			.post(
				`${this.URL}/me` + path + ':/createUploadSession',
				body,
				this.authService.getAuthRequestOptions()
			)
			.mergeMap((res) => {
				let file = new File([content], 'items_live.csv');
				const authHeaders = new Headers({ 
					'Content-Range': 'bytes 0-' + (file.size - 1) + '/' + file.size, 
					'Content-Type': 'multipart/form-data', 
					'Authorization': 'Bearer ' + this.authService.getMsft().access_token
				});
				const headers = { headers: authHeaders };
				return this.http
					.put(
						res.json().uploadUrl,
						file,
						headers
					)
					.map((res) => {
						return res;
					})
					.catch((res) => {
						return handleError(res, () => {
				      		this.reauth.emit();
				      	});	
					})
			})
			.catch((res) => {
		      	return handleError(res, () => {
		      		this.reauth.emit();
		      	});
		    });
	}

	writeChangeLog(itemNo) {
		let items = [[itemNo, this.profileService.getProfile().userPrincipalName, new Date().toLocaleString()]];
		const item = {
	      values: items
	    };

    	const body = JSON.stringify(item);

	    return this.http
	      .post(
	        `${this.URL}/me/drive/items/${this.logFileIds[this.selectedCityId]}/workbook/tables/LogTable/rows/add`,
	        body,
	        this.authService.getAuthRequestOptions()
	      )
	      .map(extractData)
	      .catch((res: Response) => {
		    return handleError(res, () => {
		      	this.reauth.emit();
		    });
		  });
	}

	resetAll() {
		this.folders = {};
		this.worksheets = {};
		this.barCodes = {};
		this.selectedCity = "";
		this.selectedCityId = "";
		this.cities = [];
		this.photo = null;
		this.convId = "";
		this.totals = null;
		this.resetApp.emit();
		this.showScanner = false;
		this.itemsAddressRange = {};
		this.logFileIds = {};
	}

	reauthDone() {
		this.reauthsuccess.emit();
	}
}