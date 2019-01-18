import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BasePageComponent} from '../../../@core/base-page/base-page.component';
import {User} from '../models/User';
import {FilterableList, FilterFieldElement, FilterFieldType, FiltersComponent} from '../../../shared/components/filters/filters.component';
import {UserService} from '../service/user.service';
import config from '../../../../../winkit.conf.json';

const pk = config['primaryKey'];
const pkLabel = pk ? pk.toUpperCase() : 'ID';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BasePageComponent implements OnInit {

    /**
     * list of loaders used in this page
     *
     * @type {{list: boolean}}
     */
    loadingList = {list: false};

    /**
     * list of user passed to the table
     *
     * @type {Array}
     */
    userList: User[] = [];

    /**
     * elements to show in every table page
     * @type {number}
     */
    elementsPerPage = 20;

    /**
     * start table page
     *
     * @type {number}
     */
    currentPage = 0;

    /**
     * know if you have to make a new call or not for the list
     * @type {boolean}
     */
    hasNextPage: boolean = true;

    /**
     * headers to bind in the table
     *
     * @type {{ key: string, title: string, isCustom: boolean }[]}
     */
    tableHeaders = [
        {key: 'openDetail', title: '', isCustom: true, path: 'user/'},
        {key: 'email', title: 'Email'},
        {key: 'firstName', title: 'First Name'},
        {key: 'lastName', title: 'Last Name'},
        {key: 'telephone', title: 'Telephone'},
        {key: 'userRole', title: 'Role'},
    ];
    /**
     * field to bind in the FilterTableComponent
     * @type {Array}
     */
    filterFields: FilterFieldElement[] = [];

    /**
     * ield to bind in the FilterTableComponent passed from url
     * @type {{}}
     */
    filtersFromUrl: any = {};

    /**
     * current filters applied
     *
     * @type {{}}
     */
    filterData: any = {};

    userService: UserService;

    constructor(protected injector: Injector) {
        super(injector);
        this.setTitle('User list');
        this.userService = injector.get(UserService);
        /**
         * assign here your filter elements
         *
         * @type {FilterFieldElement[]}
         */
        this.filterFields = [
            {label: 'First Name', placeholder: 'First Name', attrName: 'firstName', type: FilterFieldType.TEXT, section: 'others'},
            {label: 'Last Name', placeholder: 'Last Name', attrName: 'lastName', type: FilterFieldType.TEXT, section: 'others'},
            {label: 'Telephone', placeholder: 'Telephone', attrName: 'telephone', type: FilterFieldType.TEXT, section: 'others'},
            {label: 'Email', placeholder: 'Email', attrName: 'email', type: FilterFieldType.TEXT, section: 'others'},
            {label: 'Role', placeholder: 'Role', attrName: 'userRole', type: FilterFieldType.SELECT, list: FiltersComponent.getFilterList(FilterableList.USER_ROLE), section: 'others'},
            {label: pkLabel, placeholder: pkLabel, attrName: pk || 'wid', type: FilterFieldType.TEXT, section: 'others'},
        ] as FilterFieldElement[];
    }

    ngOnInit() {
        super.ngOnInit();
        /**
         * get filters from url
         */
        this.activatedRoute.queryParams.subscribe(params => {
            Object.keys(params).forEach(p => {
                this.filtersFromUrl[p] = params[p];
            });
        });
        this.filterData = this.filtersFromUrl;
        /**
         * init the pagination
         */
        this.userService.setPagination(this.elementsPerPage, this.filterData, (pk || '_id'));
        this.loadMoreItems();
    }

    /**
     * apply filters
     *
     * @param filterData
     */
    filterList(filterData: any) {
        console.log(filterData);
        this.userList = [];
        this.filterData = filterData;
        this.currentPage = 0;
        this.hasNextPage = true;
        this.router.navigate(['/user-list'], {queryParams: this.filterData});
        this.userService.setPagination(this.elementsPerPage, this.filterData, (pk || '_id'));
        this.loadMoreItems();
    }

    addUser() {
        this.router.navigateByUrl('/user/new');
    }

    /**
     * fetch new user
     *
     * @param {() => any} onSuccess
     */
    loadMoreItems(onSuccess?: () => any) {
        if (this.hasNextPage) {
            this.loadingList.list = true;
            this.userService.nextPage().then(list => {
                if (list.length > 0) {
                    this.currentPage++;
                    this.userList = this.userList.concat(list);
                }
                this.loadingList.list = false;
                console.log('userList', this.userList);
                if (onSuccess) {
                    onSuccess();
                }
                this.hasNextPage = this.userService.hasNext();
            }).catch((error) => {
                this.loadingList.list = false;
                this.handleAPIError(error);
            });
        } else if (onSuccess) {
            onSuccess();
        }
    }
}
