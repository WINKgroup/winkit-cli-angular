import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControlType} from '../../../@core/models/FormControlTypes';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
  selector: 'form-element',
  templateUrl: './form-element.component.html',
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FormElementComponent implements OnInit {

  value;
  iFormControlType = FormControlType;

  @Input() config: any;
  @Input() inputData: any;
  @Input() parentForm: NgForm;
  @Input()
  get inputValue() {
    return this.value;
  }
  set inputValue(val) {
    this.value = val;
    this.inputValueChange.emit(this.value);
  }
  @Output() inputValueChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
    if (this.inputData && !this.inputData.labelText) {
      this.inputData.labelText = this.inputData.name.replace(/^([A-Za-z])(\w*)$/, (m, p1, p2) => (
        p1.toUpperCase() + p2.replace(/[A-Z]/g, ' $&')
      ));
    }
  }

}
