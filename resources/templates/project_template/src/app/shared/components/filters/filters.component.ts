import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {UserRole} from '../../../@core/services/session.service';
import {Utils} from '../../../@core/static/Utils';

/**
 * filter tables in simple way
 */
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit, OnChanges {

  cardExpanded = false;
  generalSectionKey = 'others';
  fields = {};
  fieldType = FilterFieldType;
  filterData: any = {};

  @Input() fieldList: FilterFieldElement[] = [];
  @Input() prevFilterData: { [key: string]: any };
  @Output() onCardExpanded = new EventEmitter<any>();
  @Output() onFilterClicked = new EventEmitter<any>();

  constructor() {
  }

  /**
   * get from list mapped array to let it work with filter's select.
   *
   * @param {FilterableList} type
   * @returns {[{id: string; name: string}[]}
   */
  static getFilterList(type: FilterableList): { id: string, name: string }[] {
    const list = [];
    switch (type) {
      case FilterableList.USER_ROLE:
        Object.keys(UserRole).forEach(role => {
          const title = role;
          if (title.length > 0) {
            list.push({id: role, name: title});
          }
        });
        break;
    }
    return list;
  }

  ngOnInit() {
    this.initFieldList();
  }

  ngOnChanges() {
    this.initFieldList();
  }

  /**
   * clear all filters value.
   */
  clearFieldList() {
    this.prevFilterData = null;
    this.initFieldList();
  }

  /**
   * initialize filters.
   */
  private initFieldList() {
    this.fieldList.forEach((field) => {
      if (!field.section || field.section.length === 0) {
        field.section = this.generalSectionKey;
      }
      if (!this.fields[field.section]) {
        this.fields[field.section] = {};
      }
      this.fields[field.section][field.attrName] = (field.type !== FilterFieldType.CHECK_LIST) ? null : {};
      if (this.prevFilterData && this.prevFilterData[field.attrName]) {
        this.fields[field.section][field.attrName] = this.prevFilterData[field.attrName];
      }
    });
    this.filterData = this.prevFilterData;
  }

  /**
   * map data and emit it.
   */
  filter() {
    const filterData = {};
    Object.keys(this.fields).forEach(section => {
      Object.keys(this.fields[section]).forEach(key => {
        filterData[key] = this.fields[section][key];
      });
    });
    const filterDataCheckLists = {};
    for (const key in filterData) {
      if (!filterData[key]) {
        delete filterData[key];
      } else {
        const key1l = this.fieldList.find(el => el.attrName === key);
        if (key1l.type === FilterFieldType.CHECK_LIST) {
          filterDataCheckLists[key] = '';
          for (const key2l in filterData[key]) {
            if (filterData[key][key2l]) {
              filterDataCheckLists[key] = filterDataCheckLists[key] + `${key2l},`;
            }
          }
        }
      }
    }
    for (const key in filterDataCheckLists) {
      if (filterDataCheckLists[key].length > 0) {
        filterData[key] = filterDataCheckLists[key].slice(0, -1);
      } else {
        delete filterData[key];
      }
    }
    this.fieldList.forEach(field => {
      if (field.type === FilterFieldType.DATE && filterData[field.attrName]) {
        filterData[field.attrName] = Utils.getFormattedDate(filterData[field.attrName]).getTime();
      }
    });
    this.filterData = filterData;
    this.onFilterClicked.emit(filterData);
    this.cardExpanded = false;
  }

  /**
   * expande / collapse the card.
   */
  toggleCardExpanded() {
    if (!this.cardExpanded) {
      this.onCardExpanded.emit();
    }
    this.cardExpanded = !this.cardExpanded;
  }

}

/**
 * respect this models to show a new field & bind it correctly.
 */
export interface FilterFieldElement {
  label: string;
  placeholder: string;
  attrName: string;
  type: FilterFieldType;
  /**
   * yuo can group fields by sections, just specify same section name and the component will do the rest.
   * if you don't want to show the section put the generalSectionKey ('others') as value
   */
  section?: string;
  hide?: boolean;
  /**
   * FilterableList, specify it just for FilterFieldType.SELECT or FilterFieldType.CHECK_LIST
   */
  list: { id: number | string, name: string, checked?: boolean }[];
  onValueSelected?: () => any;
}

/**
 * all supported field types
 */
export enum FilterFieldType {
  BOOLEAN = 'boolean' as any,
  TEXT = 'text' as any,
  NUMBER = 'number' as any,
  DATE = 'date' as any,
  SELECT = 'select' as any,
  CHECK_LIST = 'check_list' as any,
}

/**
 * specify here all type of list that you want to associate to a FilterFieldElement and map it in getFilterList()
 */
export enum FilterableList {
  USER_ROLE = 'USER_ROLE' as any
}
