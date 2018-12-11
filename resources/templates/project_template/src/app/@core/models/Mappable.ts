export interface Mappable<T> {
  id: string;

  /**
   * map from ReverseObject to Object
   * @param reverseObject
   * @returns {T}
   */
  map(reverseObject: any): T;

  /**
   * map from Object to ReverseObject
   * @returns {any}
   */
  mapReverse(): any;
}
