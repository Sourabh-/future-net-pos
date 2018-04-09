import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: 'appTable.component.html'
})
export class AppTableComponent implements OnInit, OnChanges {

  @Input() header = [];
  @Input() rows = [];
  @Input() options = {};
  @Input() isFullWidth = false;
  @Input() reverseBg = false;
  @Input() isHideFooter = false;
  @Input() value = 'value';
  public perPageCount = 20;
  public currentPage = 0;

  constructor() {
  	
  }

  ngOnInit() {
    this.computePagination();
  }

  ngOnChanges(changes) {
    if(!_.isEqual(changes.rows.previousValue, changes.currentValue)) {
      this.computePagination();
    }
  }

  computePagination() {
    
  }
}
