import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'csv-cards',
  templateUrl: 'csvCards.component.html'
})
export class CsvCardsComponent {

  @Input() csvs = [];
  @Input() name = "name";
  @Input() time = "time";
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public utilityService: UtilityService
  ) {
  	
  }

  handleClick(folder) {
    this.onClick.emit(folder);
  }

  getDate(date) {
    return this.utilityService.getDate(date);
  }

  downloadFile(csv) {
    var link = document.createElement("a");
    link.download =  csv['name'];
    link.href = csv['@microsoft.graph.downloadUrl'];
    link.click();
  }
}
