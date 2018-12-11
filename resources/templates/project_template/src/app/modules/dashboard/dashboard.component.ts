import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePageComponent} from '../../@core/base-page/base-page.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BasePageComponent implements OnInit {

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle('Dashboard');
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
