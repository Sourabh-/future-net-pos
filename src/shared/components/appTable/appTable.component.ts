import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: 'appTable.component.html'
})
export class AppTableComponent {

  @Input() header = [];
  @Input() rows = [];
  @Input() options = {};
  @Input() isFullWidth = false;
  @Input() reverseBg = false;
  @Input() isHideFooter = false;

  constructor() {
  	
  }
}
