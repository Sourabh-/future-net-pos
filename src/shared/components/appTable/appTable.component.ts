import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: 'appTable.component.html'
})
export class AppTableComponent implements OnInit {

  @Input() header = [];
  @Input() rows = [];
  @Input() options = {};
  @Input() isFullWidth = false;
  @Input() reverseBg = false;
  @Input() isHideFooter = false;
  @Input() value = 'value';
  @Input() searchFilter = '';

  public perPageCount = 20;
  public currentPage = 0;

  constructor() {
  	
  }

  ngOnInit() {
    
  }
}
