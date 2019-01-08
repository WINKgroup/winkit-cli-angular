const componentDetailViewModelTemplate = `import {Component, OnInit, Injector} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {**ThisName**Service} from '../service/**ThisName.toLowerCase**.service';
import {**ThisName**} from '../models/**ThisName**';
import {BasePageComponent} from '../../../@core/base-page/base-page.component';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../../../@core/models/CustomNotification';
import {FormControlList} from '../../../@core/models/FormControlTypes';
import {**ThisName**DataFactory} from '../models/**ThisName**DataFactory';

@Component({
  selector: 'app-**ThisName.toLowerCase**-detail',
  templateUrl: './**ThisName.toLowerCase**-detail.component.html',
  styleUrls: ['./**ThisName.toLowerCase**-detail.component.scss']
})
export class **ThisName**DetailComponent extends BasePageComponent implements OnInit {

  **ThisName.toLowerCase**: **ThisName**;
  **ThisName.toLowerCase**Fields = [];
  title: string;
  loadingList = {**ThisName.toLowerCase**: false};
  isNew = false;
  **ThisName.toLowerCase**Service: **ThisName**Service;
  formControlList: FormControlList;

  constructor(public route: ActivatedRoute,
              protected injector: Injector) {
    super(injector);
    this.setTitle(route.snapshot.paramMap.get('id') === 'new' ? 'Create **ThisName**' : '**ThisName** Detail');
    this.**ThisName.toLowerCase**Service = this.injector.get(**ThisName**Service);
    this.**ThisName.toLowerCase**Service.setPagination();
  }

  async ngOnInit() {
    super.ngOnInit();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.loadingList.**ThisName.toLowerCase()** = true;
      try {
        this.**ThisName.toLowerCase()** = await this.**ThisName.toLowerCase()**Service.get**ThisName**ById(id);
        this.**ThisName.toLowerCase()**Fields = Object.keys(this.**ThisName.toLowerCase()**);
        this.loadingList.**ThisName.toLowerCase()** = false;
        console.log('**ThisName**', this.**ThisName.toLowerCase()**);
      } catch (error) {
        console.log(error);
        this.loadingList.**ThisName.toLowerCase()** = false;
        this.handleAPIError(error);
      };
    } else {
      this.isNew = true;
      this.**ThisName.toLowerCase()** = new **ThisName**();
      this.**ThisName.toLowerCase()**Fields = Object.keys(new **ThisName**());
    }
    this.formControlList = **ThisName**DataFactory.getFormControls(this, [
    ]);
  }
  
  /**
   * if form is valid create / update **ThisName.toLowerCase()**
   *
   * @param {HTMLFormElement} form
   * @param {boolean} isValid
   */
  submit(form: HTMLFormElement, isValid: boolean) {
    console.log(form, isValid);
    if (isValid) {
      if (this.isNew) {
        this.create**ThisName**();
      } else {
        this.update**ThisName**();
      }
    }
  }

  async create**ThisName**() {
    if (await this.askForConfirmation()) {
      this.loadingList.**ThisName.toLowerCase** = true;
      this.**ThisName.toLowerCase**Service.create**ThisName**(this.**ThisName.toLowerCase**).then(() => {
        CustomNotification.showNotification(this.toastr, '**ThisName** created!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
        this.loadingList.**ThisName.toLowerCase** = false;
        this.router.navigateByUrl('/**ThisName.toLowerCase**-list');
      }).catch((error) => {
        console.log(error);
        this.loadingList.**ThisName.toLowerCase** = false;
        this.handleAPIError(error);
      });
    }
  }

  async delete**ThisName**() {
    if (await this.askForConfirmation()) {
      this.loadingList.**ThisName.toLowerCase** = true;
      this.**ThisName.toLowerCase**Service.delete**ThisName**(this.**ThisName.toLowerCase**.id).then(() => {
        CustomNotification.showNotification(this.toastr, '**ThisName** deleted!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
        this.loadingList.**ThisName.toLowerCase** = false;
        this.router.navigateByUrl('/**ThisName.toLowerCase**-list');
      }).catch((error) => {
        console.log(error);
        this.loadingList.**ThisName.toLowerCase** = false;
        this.handleAPIError(error);
      });
    }
  }

  async update**ThisName**() {
    if (await this.askForConfirmation()) {
      this.loadingList.**ThisName.toLowerCase** = true;
      this.**ThisName.toLowerCase**Service.update**ThisName**(this.**ThisName.toLowerCase**).then(() => {
        CustomNotification.showNotification(this.toastr, '**ThisName** updated!', '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
        this.loadingList.**ThisName.toLowerCase** = false;
      }).catch((error) => {
        this.loadingList.**ThisName.toLowerCase** = false;
        this.handleAPIError(error);
      });
    }
  }
}

`;

const componentDetailViewTemplate = `<app-toolbar [title]="title" [loading]="loadingList.**ThisName.toLowerCase**"></app-toolbar>
<button routerLink="/**ThisName.toLowerCase**-list" class="btn btn-secondary btn-sm mb-3">GO TO LIST</button>
<div *ngIf="loggedinUser && **ThisName.toLowerCase**" class="container-fluid">
  <div class="row mb-5">
    <form class="col-12 p-0" #detailForm="ngForm" id="f" (ngSubmit)="submit(detailForm.value, detailForm.valid)">
      <div class="card col-xs-12 col-sm-12 p-0">
        <div class="card-body">
          <div class="row">
            <ng-container *ngFor="let formControlData of formControlList">
              <form-element *ngIf="formControlData.ngIf !== undefined ? formControlData.ngIf : true"
                            class="{{formControlData.wrapperClass !== undefined ?  formControlData.wrapperClass : 'col-sm-6 mb-3'}}"
                            [ngStyle]="{order: formControlData.order}"
                            [inputData]="formControlData"
                            [(inputValue)]="**ThisName.toLowerCase()**[formControlData.name]"
                            [parentForm]="detailForm"></form-element>
            </ng-container>
          </div>
        </div>
        <div class="card-footer">
          <input type="submit" class="btn btn-primary float-right" [value]="isNew ? 'Confirm' : 'Update'" [disabled]="loadingList.**ThisName.toLowerCase**"/>
          <input *ngIf="!isNew" type="button" (click)="delete**ThisName**()" class="btn btn-danger float-left" [value]="'Delete'" [disabled]="loadingList.**ThisName.toLowerCase**"/>
        </div>
      </div>
    </form>
  </div>
</div>

`;

const componentDetailStyleTemplate = `@import "../../../../assets/sass/main";`;

module.exports.componentDetailViewModelTemplate = componentDetailViewModelTemplate;
module.exports.componentDetailViewTemplate = componentDetailViewTemplate;
module.exports.componentDetailStyleTemplate = componentDetailStyleTemplate;
