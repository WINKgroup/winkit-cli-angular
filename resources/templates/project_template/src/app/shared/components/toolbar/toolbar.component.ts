import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() title: String;
  @Input() buttonCTA: string;
  @Input() loading: boolean;
  @Output() onButtonClicked: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  /**
   * emits the click on the custom button
   */
  buttonClicked() {
    this.onButtonClicked.emit();
  }

}
