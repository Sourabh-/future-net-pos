import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ProfileService {
	profile:any = {};
	profileUpdated: EventEmitter<any> = new EventEmitter();
	constructor() {}

	setProfile(profile) {
		this.profile = profile;
		this.profileUpdated.emit(this.profile);
	}

	getProfile() {
		return this.profile;
	}
}