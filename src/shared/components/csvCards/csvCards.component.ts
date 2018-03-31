import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'csv-cards',
  templateUrl: 'csvCards.component.html'
})
export class CsvCardsComponent {

  @Input() csvs = [];
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  	
  }

  handleClick(folder) {
    this.onClick.emit(folder);
  }
}
