import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'folders',
  templateUrl: 'folders.component.html'
})
export class FoldersComponent {

  @Input() folders = [];
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
}
