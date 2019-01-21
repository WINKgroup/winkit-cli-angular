const componentListViewModelTemplate = `import {Component, Injector, OnInit} from '@angular/core';
import {BasePageComponent} from '../../../@core/base-page/base-page.component';
import {**ThisName**Service} from '../service/**ThisName.toLowerCase**.service';
import {**ThisName**} from '../models/**ThisName**';
import {FilterFieldElement, FilterFieldType} from '../../../shared/components/filters/filters.component';
import config from '../../../../../winkit.conf.json';

const pk = config['primaryKey'];

@Component({
  selector: 'app-**ThisName.toLowerCase**-list',
  templateUrl: './**ThisName.toLowerCase**-list.component.html',
  styleUrls: ['./**ThisName.toLowerCase**-list.component.scss']
})
export class **ThisName**ListComponent extends BasePageComponent implements OnInit {

  loadingList = {list: false};
  **ThisName.toLowerCase**List: **ThisName**[] = [];
  elementsPerPage = 20;
  currentPage = 0;
  hasNextPage: boolean = true;
  tableHeaders = [
    {key: 'openDetail', title: '', isCustom: true, path: '**ThisName.toLowerCase**/'},
    {key: pk, title: pk.toUpperCase()}
  ];
  filterFields: FilterFieldElement[] = [];
  filtersFromUrl: any = {};
  filterData: any = {};
  **ThisName.toLowerCase**Service: **ThisName**Service;

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle('**ThisName** list');
    this.**ThisName.toLowerCase**Service = injector.get(**ThisName**Service);
    this.filterFields = [
     {label: pk.toUpperCase(), placeholder: pk.toUpperCase(), attrName: (pk === 'id' ? 'wid' : pk), type: FilterFieldType.TEXT, section: 'others'},
    ] as FilterFieldElement[];
  }

  ngOnInit() {
    super.ngOnInit();
    this.activatedRoute.queryParams.subscribe(params => {
      Object.keys(params).forEach(p => {
        this.filtersFromUrl[p] = params[p];
      });
    });
    this.filterData = this.filtersFromUrl;
    this.**ThisName.toLowerCase**Service.setPagination(this.elementsPerPage, this.filterData, (pk === 'id' ? '_id' : pk));
    this.loadMoreItems();
  }

  filterList(filterData: any) {
    console.log(filterData);
    this.**ThisName.toLowerCase**List = [];
    this.filterData = filterData;
    this.currentPage = 0;
    this.hasNextPage = true;
    this.router.navigate(['/**ThisName.toLowerCase**-list'], {queryParams: this.filterData});
    this.**ThisName.toLowerCase**Service.setPagination(this.elementsPerPage, this.filterData, (pk === 'id' ? '_id' : pk));
    this.loadMoreItems();
  }

  addNew() {
    this.router.navigateByUrl('/**ThisName.toLowerCase**/new');
  }

  loadMoreItems(onSuccess?: () => any) {
    if (this.hasNextPage) {
      this.loadingList.list = true;
      this.**ThisName.toLowerCase**Service.nextPage().then(list => {
        if (list.length > 0) {
          this.currentPage++;
          this.**ThisName.toLowerCase**List = this.**ThisName.toLowerCase**List.concat(list);
        }
        this.loadingList.list = false;
        console.log('**ThisName.toLowerCase**List', this.**ThisName.toLowerCase**List);
        if (onSuccess) {
          onSuccess();
        }
        this.hasNextPage = this.**ThisName.toLowerCase**Service.hasNext();
      }).catch((error) => {
        this.loadingList.list = false;
        this.handleAPIError(error);
      });
    }
  }
}

`;

const componentListViewTemplate = `<app-toolbar [title]="title" [buttonCTA]="'ADD **ThisName**'" (onButtonClicked)="addNew()" [loading]="loadingList.list" ></app-toolbar>
<div class="col-xs-12 col-sm-12 p-0 mb-3">
  <app-filters [fieldList]="filterFields" (onFilterClicked)="filterList($event)" [prevFilterData]="filtersFromUrl"></app-filters>
</div>
<app-table [headers]="tableHeaders" [list]="**ThisName.toLowerCase**List" [showIndexHeader]="true" [elementsPerPage]="elementsPerPage" [hasNextPage]="hasNextPage" [(currentPage)]="currentPage" (loadMoreItems)="loadMoreItems()" [loading]="loadingList.list"></app-table>

`;

const componentListStyleTemplate = `@import "../../../../assets/sass/main";`;

module.exports.componentListViewModelTemplate = componentListViewModelTemplate;
module.exports.componentListViewTemplate = componentListViewTemplate;
module.exports.componentListStyleTemplate = componentListStyleTemplate;
