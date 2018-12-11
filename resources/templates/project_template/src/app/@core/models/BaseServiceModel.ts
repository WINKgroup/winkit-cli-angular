import {ResponseError} from './ResponseError';
import {Mappable} from './Mappable';

export interface BaseServiceModel<T extends Mappable<T>> {

  /**
   * initialize pagination after instantiated the service
   *
   * @param {string} path
   * @param {number} pageSize
   * @param filters
   * @param {string} orderByFieldName
   */
  init(path: string, pageSize: number, filters?: { [key: string]: string }, orderByFieldName?: string);

  /**
   * reset the pagination
   */
  reset();

  /**
   * check if there is a new page
   *
   * @returns {boolean}
   */
  hasNext(): boolean;

  /**
   * get next page if exists
   *
   * @returns {Promise<T[]>}
   */
  nextPage(): Promise<T[]>;

  getObject(id: string): Promise<T>;

  postObject(object: T): Promise<boolean>;

  /**
   * post any type of data
   *
   * @param {string} url
   * @param data
   * @returns {Promise<any>}
   */
  postData(url: string, data: any): Promise<any>;

  patchObject(object: any): Promise<boolean>;

  deleteObject(id: string): Promise<boolean>;

  /**
   * handle error to return to the component
   *
   * @param error
   * @returns {ResponseError}
   */
  handleError(error: any): ResponseError;
}
