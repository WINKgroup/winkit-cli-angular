import {DomSanitizer} from '@angular/platform-browser';

export class Utils {

  /**
   * clone an object
   *
   * @param {T} object
   * @returns {T}
   */
  static clone<T>(object: T): T {
    return Object.assign({}, JSON.parse(JSON.stringify(object)));
  }

  /**
   * clone a dictionary
   *
   * @param {T} object
   * @returns {T}
   */
  static cloneDictionary<T>(object: T): T {
    const newObj = {} as T;
    Object.keys(object).forEach(function (key) {
      newObj[key] = object[key];
    });
    return newObj;
  }

  /**
   * clon an object array
   *
   * @param {T[]} list
   * @returns {T[]}
   */
  static cloneArray<T>(list: T[]): T[] {
    const res = [];
    list.forEach(e => {
      res.push(this.clone(e));
    });
    return res;
  }

  /**
   * order an array of objects by a prop
   *
   * @param {T[]} arr
   * @param {string} prop
   * @param {boolean} descending
   * @returns {T[]}
   */
  static orderBy<T>(arr: T[], prop: string, descending: boolean): T[] {
    return arr.sort((a, b) => descending ? b[prop] - a[prop] : a[prop] - b[prop]);
  }

  /**
   * reset the value of an input type="file" after file uploaded to upload files with same name
   *
   * @param element: the ViewChild instance
   */
  static resetInputFile(element: any) {
    element.nativeElement.value = '';
  }

  /**
   * get a formatted date from the input type="date" to Date
   *
   * @param {{year: number; month: number; day: number}} date
   * @returns {Date}
   */
  static getFormattedDate(date: { year: number, month: number, day: number }): Date {
    return new Date(date.year, date.month, date.day);
  }

  /**
   * get a formatted date from the input type="date" to Date
   *
   * @param {number} price
   * @param {string} currencyL if you want a string with currency behind
   * @returns {string}
   */
  static getFormattedPrice(price: number, currency?: string): string {
    return (price) ? (currency ? currency + ' ' + (price / 100).toFixed(2) : (price / 100).toFixed(2)) : 'FREE';
  }

  /**
   * get array from Enum, useful for *ngFor in View
   *
   * @param en: the enum class
   * @returns {T[]}
   */
  static getEnumAsArray<T>(en: any): T[] {
    const list = [];
    Object.keys(en).forEach(l => {
      list.push(en[l]);
    });
    return list;
  }

  /**
   * show correctly price in input
   *
   * @param $event
   * @param price: variable
   */
  static setPrice($event): number {
    const element = ((window.event) ? ($event.srcElement) : ($event.currentTarget));
    return Number(element.value) * 100;
  }

  /**
   * get url to show in html
   *
   * @param {string} url
   * @param {DomSanitizer} sanitizer
   * @returns {SafeStyle}
   */
  static getBypassedSecurityTrustStyle(url: string, sanitizer: DomSanitizer) {
    return sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

  /**
   * check if v is dictionary
   *
   * @param v
   * @returns {boolean}
   */
  static isDict(v): boolean {
    return !!v && typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date) && Utils.isJsonable(v);
  }

  /**
   *  check if v is Jsonable
   *
   * @param v
   * @returns {boolean}
   */
  static isJsonable(v): boolean {
    try {
      return JSON.stringify(v) === JSON.stringify(JSON.parse(JSON.stringify(v)));
    } catch (e) {
      return false;
    }
  }

}
