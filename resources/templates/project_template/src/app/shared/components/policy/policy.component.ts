import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePageComponent} from '../../../@core/base-page/base-page.component';

@Component({
  moduleId: module.id,
  selector: 'app-policy',
  templateUrl: './policy.component.html',
})
export class PolicyComponent extends BasePageComponent implements OnInit {

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle('Policy');
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
