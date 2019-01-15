import {Injectable, Injector} from '@angular/core';
import {ErrorCode, ResponseError} from '../models/ResponseError';
import {Mappable} from '../models/Mappable';
import axios from 'axios';
import {SessionService} from './session.service';
import {BaseServiceModel} from '../models/BaseServiceModel';
import {environment} from '../../../environments/environment';
import config from '../../../../winkit.conf.json';

const primaryKey = config.primaryKey || 'id';

@Injectable()
export abstract class BaseService<T extends Mappable<T>> implements BaseServiceModel<T> {

  pageSize: number;
  filters: { [key: string]: string };
  last: number = 0;
  baseUrl: string = environment.BASE_SERVER_URL;
  collectionName: string;
  orderByFieldName: string;
  hasNextPage: boolean = true;

  constructor(protected injector: Injector) {
  }

  protected getHeader(): any {
    return {headers: {'Content-Type': 'application/json', ...SessionService.getAccessToken() ? {'Authorization': SessionService.getAccessToken()} : {}}};
  }

  protected abstract modelConstructor(): T;

  /**
   * initialize pagination after instantiated the service
   *
   * @param {string} path
   * @param {number} pageSize
   * @param filters
   * @param {string} orderByFieldName
   */
  init(path: string, pageSize?: number, filters?: { [key: string]: string }, orderByFieldName?: string) {
    if (path.length === 0) {
      throw new Error('path must contain more than 0 elements');
    }
    if (pageSize && pageSize <= 0) {
      throw new Error('pageSize must be more than 0');
    }
    this.baseUrl = environment.BASE_SERVER_URL + path;
    this.last = 0;
    this.pageSize = pageSize;
    if (filters) {
      this.filters = filters;
    }
    this.orderByFieldName = orderByFieldName || 'wid';
  }

  /**
   * reset the pagination
   */
  reset() {
    this.last =
      this.pageSize =
        this.filters =
          this.orderByFieldName =
            this.collectionName = null;
    this.hasNextPage = true;
    this.last = 0;
  }

  /**
   * check if there is a new page
   *
   * @returns {boolean}
   */
  hasNext(): boolean {
    return this.hasNextPage;
  }

  getObject(id: string): Promise<T> {
    const completeUrl = this.baseUrl + '/' + id;
    console.log(completeUrl);
    return axios.get(completeUrl, this.getHeader()).then((response) => {
      console.log(response);
      return this.modelConstructor().map(response.data);
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  /**
   * get next page if exists
   *
   * @returns {Promise<T[]>}
   */
  nextPage(): Promise<T[]> {
    let url = this.baseUrl + '?';
    if (this.filters) {
      Object.keys(this.filters).forEach(k => {
        console.log(k, this.filters[k]);
        url += `&${k}_contains=${this.filters[k]}`;
      });
    }
    return axios.get(`${url}&_start=${this.last}&_limit=${this.pageSize}&_sort=${this.orderByFieldName}:DESC`, this.getHeader()).then((response) => {
      const list = [];
      console.log(response);
      if (response.data && response.data.length > 0) {
        response.data.forEach(el => {
          list.push(this.modelConstructor().map(el));
        });
        this.last += response.data.length;
        this.hasNextPage = response.data.length >= this.pageSize;
      } else {
        this.hasNextPage = false;
      }
      return list;
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  postObject(object: T): Promise<boolean> {
    const completeUrl = this.baseUrl;
    return axios.post(completeUrl, object.mapReverse(), this.getHeader())
      .then(response => {
        console.log(response);
        return true;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  patchObject(object: T): Promise<boolean> {
    const completeUrl = this.baseUrl + '/' + object[primaryKey];
    return axios.put(completeUrl, object.mapReverse(), this.getHeader())
      .then(response => {
        console.log(response);
        return true;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  deleteObject(id: string): Promise<boolean> {
    const completeUrl = this.baseUrl + '/' + id;
    return axios.delete(completeUrl, this.getHeader())
      .then((response) => {
        console.log(response);
        return true;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  /**
   * post any type of data
   *
   * @param {string} url
   * @param data
   * @returns {Promise<any>}
   */
  postData(url: string, data: any): Promise<any> {
    return axios.post(url, data, this.getHeader())
      .then(response => {
        console.log(response);
        return response.data;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  /**
   * handle error to return to the component
   *
   * @param error
   * @returns {ResponseError}
   */
  handleError(error: any): ResponseError {
    if (error.response && error.response.data && !(error.response.data.statusCode >= 200 && error.response.data.statusCode < 300)) {
      return new ResponseError(error.response.data.statusCode, error.response.data.message || error.error);
    }
    console.log(error);
    return new ResponseError(ErrorCode.UNKNOWN, error.message);
  }

}
