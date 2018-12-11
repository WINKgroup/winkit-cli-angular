export class Globals {
  /**
   * get regex for email input
   *
   * @returns {string}
   */
  static getEmailRegex(): string {
    return '^[^@]+@[^@]+\.[a-zA-Z]{2,6}$';
  }

  /**
   * TODO
   * get rejex for telephone input
   * @returns {string}
   */
  static getTelephoneRegex(): string {
    return '';
  }
}
