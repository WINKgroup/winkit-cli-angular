import {Component, Injector, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseComponent} from '../base-component/base.component';
import {User} from '../../modules/user/models/User';
import {SessionService} from '../services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-base',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent extends BaseComponent implements OnInit {

  loggedinUser: User;
  baseUrl = environment.BASE_SERVER_URL;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    /**
     * store loggedinUser so you can access to if from View and you don't need to access every time to Local Storage (where is stored)
     *
     * @type {User}
     */
    this.loggedinUser = SessionService.getLoggedInUser();
  }

  /**
   * show default dialog to ask for confirmation before starting a process.
   * very useful for CRUD.
   *
   * @returns {Promise<boolean>} if true you can proceede.
   */
  protected async askForConfirmation(): Promise<boolean> {
    const result = await Swal({
      title: this.translateService.instant('Are you sure?'),
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('Yes, continue!'),
      cancelButtonText: this.translateService.instant('No')
    });
    return new Promise<boolean>(resolve => {
      resolve(!!result.value);
    });
  }
}
