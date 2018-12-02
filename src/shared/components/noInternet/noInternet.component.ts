import { Component, Output, EventEmitter } from '@angular/core';
import { NoInternetService } from '../../services/noInternet.service';

@Component({
  selector: 'no-internet',
  templateUrl: 'noInternet.component.html'
})
export class NoInternetComponent {
  
  @Output() retry:EventEmitter<void> = new EventEmitter();
  
  constructor(
    public noInternetService: NoInternetService
  ) {}

  retryConnection() {
  	if(navigator.onLine) {
	  	this.noInternetService.hide();
	  	this.retry.emit();
	}
  }
}
