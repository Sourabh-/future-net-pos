import { Component, Output, EventEmitter } from '@angular/core';
import { BlockerService } from '../../services/blocker.service';

@Component({
  selector: 'blocker',
  templateUrl: 'blocker.component.html'
})
export class BlockerComponent {
  
  @Output() login:EventEmitter<void> = new EventEmitter();
  
  constructor(
    public blockerService: BlockerService
  ) {}

  tryLogin() {
  	this.login.emit();
  }
}
