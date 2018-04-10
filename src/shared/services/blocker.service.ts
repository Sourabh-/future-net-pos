import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class BlockerService {
	private isShown = false;

	show() {
		this.isShown = true;
	}

	hide() {
		this.isShown = false;
	}
}