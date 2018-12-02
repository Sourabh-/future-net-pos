import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class NoInternetService {
	private isShown = false;

	show() {
		this.isShown = true;
	}

	hide() {
		this.isShown = false;
	}
}