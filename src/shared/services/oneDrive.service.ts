import { Injectable, EventEmitter } from '@angular/core';
import * as hello from 'hellojs/dist/hello.all.js';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';

function extractData(res: Response): any {
  const body = res.json();
  return body || {};
}

function handleError(res: Response, cb) {
  const error = res.json();
  /*if(res.status == 401) {
  	cb();
  }*/

  const errorMessage = error.message ? error.message :
    res.status ? `${res.status} - ${res.statusText}` : 'Server error';

  return Observable.throw(errorMessage);
}

@Injectable()
export class OneDriveService {
	URL = 'https://graph.microsoft.com/v1.0';
	URLBeta = 'https://graph.microsoft.com/beta';

	folders: any = {};
	worksheets: any = {};
	selectedCity: string = "";
	selectedCityId: string = "";
	selectedCityUpdated: EventEmitter<any> = new EventEmitter();
	cities = [];
	reauth: EventEmitter<void> = new EventEmitter();
	photo:any;
	convId: string = "";

	constructor(
		private http: Http,
		private authService: AuthService
	) {

	}

	setCity(city, id) {
		this.selectedCity = city;
		this.selectedCityId = id;
		this.selectedCityUpdated.emit();
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

	getWorkbook(id, sheet): Observable<any> {
		if(this.worksheets[id]) {
			return Observable.of(this.worksheets[id]).map(ws => (ws));
		} else 
			return this.http
		      .get(`${this.URL}/me/drive/items/${id}/workbook/worksheets('${sheet}')/usedRange`, this.authService.getAuthRequestOptions())
		      .map(extractData)
		      .catch((res: Response) => {
		      	return handleError(res, () => {
		      		this.reauth.emit();
		      	});
		      });
	}

	updateWorkbook() {
		
	}
}