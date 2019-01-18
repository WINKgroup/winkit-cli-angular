import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../models/User';
import {BasePageComponent} from '../../../@core/base-page/base-page.component';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../../../@core/models/CustomNotification';
import {UserRole} from '../../../@core/services/session.service';
import {MediaType} from '../../../shared/components/media-manager/Media';
import * as moment from 'moment';
import {Utils} from '../../../@core/static/Utils';
import {UserService} from '../service/user.service';
import {FormControlList} from '../../../@core/models/FormControlTypes';
import {UserDataFactory} from '../models/UserDataFactory';
import config from '../../../../../winkit.conf.json';

const primaryKey = config['primaryKey'] || 'id';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends BasePageComponent implements OnInit {

  user: User;
  userFields = [];
  title: string;
  loadingList = {user: false};
  isNew = false;
  isProfile = false;
  userRoles: string[] = Utils.getEnumAsArray(UserRole);
  genders = [{name: 'Male', value: true}, {name: 'Female', value: false}];
  dateOfBirth: any;
  imageAllowedTypes: MediaType[] = [MediaType.IMAGE, MediaType.PDF];
  formControlList: FormControlList;

  constructor(public route: ActivatedRoute,
              protected injector: Injector,
              private userService: UserService) {
    super(injector);
    const id = route.snapshot.paramMap.get('id');
    this.setTitle(id ? (id === 'new' ? 'Create User' : 'User Detail') : 'Profile');
  }

  async ngOnInit() {
    super.ngOnInit();
    let id = this.route.snapshot.paramMap.get('id');
    /**
     * check if is profile page or not
     */
    if (!id) {
      this.isProfile = true;
      id = this.loggedinUser[primaryKey];
    }
    /**
     * init user, if exists get it, if not create a new one with empty values
     */
    if (id !== 'new') {
      this.loadingList.user = true;
      try {
        this.user = await this.userService.getUserById(id);
        console.log('user', this.user);
        this.userFields = Object.keys(this.user);
        this.dateOfBirth = {
          day: this.user.dateOfBirth.getDate(),
          month: this.user.dateOfBirth.getMonth() + 1,
          year: this.user.dateOfBirth.getFullYear()
        };
        console.log('User', this.user);
      } catch (e) {
        console.log(e);
        this.handleAPIError(e);
      }
      this.loadingList.user = false;
    } else {
      this.isNew = true;
      this.user = new User();
      this.user.userRole = UserRole.CUSTOMER;
      this.userFields = Object.keys(new User());
    }
    this.formControlList = UserDataFactory.getFormControls(this, [
    ]);
  }

  /**
   * if form is valid create / update the user
   *
   * @param {HTMLFormElement} form
   * @param {boolean} isValid
   */
  async submit(form: HTMLFormElement, isValid: boolean) {
    if (isValid) {
      this.user.dateOfBirth = moment.utc(`${this.dateOfBirth.year}-${this.dateOfBirth.month}-${this.dateOfBirth.day}`).toDate();
      console.log(this.dateOfBirth, this.user.dateOfBirth);
      if (await this.askForConfirmation()) {
        if (this.isNew) {
          this.user.registeredAt = new Date();
          this.createUser();
        } else {
          this.updateUser();
        }
      }
    }
  }

  async createUser() {
    this.loadingList.user = true;
    try {
      await this.userService.createUser(this.user);
      CustomNotification.showNotification(this.toastr, 'User created!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
      this.loadingList.user = false;
      this.router.navigateByUrl('/user-list');
    } catch (e) {
      console.log(e);
      this.handleAPIError(e);
    }
    this.loadingList.user = false;
  }

  async deleteUser() {
    if (await this.askForConfirmation()) {
      this.loadingList.user = true;
      this.userService.deleteUser(this.user[primaryKey]).then(() => {
        CustomNotification.showNotification(this.toastr, 'User deleted!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
        this.loadingList.user = false;
        this.router.navigateByUrl('/user-list');
      }).catch((error) => {
        console.log(error);
        this.loadingList.user = false;
        this.handleAPIError(error);
      });
    }
  }

  async updateUser() {
    this.loadingList.user = true;
    this.userService.updateUser(this.user).then(() => {
      CustomNotification.showNotification(this.toastr, 'User updated!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
      this.loadingList.user = false;
    }).catch((error) => {
      this.loadingList.user = false;
      this.handleAPIError(error);
    });
  }
}
