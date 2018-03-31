import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'folders',
  templateUrl: 'folders.component.html'
})
export class FoldersComponent {

  @Input() folders = [];
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  	
  }

  handleClick(folder) {
    this.onClick.emit(folder);
  }
}
