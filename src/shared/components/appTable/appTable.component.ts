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
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public perPageCount = 20;
  public currentPage = 0;

  constructor() {
  	
  }

  ngOnInit() {
    
  }

  clicked(item) {
    this.onClick.emit(item);
  }

  scrollToTop() {
    setTimeout(() => {
      let c = document.getElementsByClassName('content-container'); 
      for(let i=0;i<c.length;i++) 
        c[i].scrollTop = 0;
    }, 300);
  }
}
