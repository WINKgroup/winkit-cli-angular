/**
 * Use this to correctly handle an error
 */
export class BaseError {
  constructor() {
    Error.apply(this, arguments);
  }
}

BaseError.prototype = new Error();

export class ResponseError extends BaseError {
  code: ErrorCode;
  message: string;

  public constructor(code: number, message?: string) {
    super();
    if (code < 300) {
      throw new Error('You can\'t create an error with a code < 300!');
    }

    this.message = message || '';
    this.code = code || ErrorCode.UNKNOWN;
  }

}

export enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  UNPROCESSABLE_ENTITY = 422,
  GENERIC_SERVER_ERROR = 500,
  SERVER_TEMPORARY_UNAVAILABLE = 503,
  NOT_ACTIVATED = 32,
  NO_INTERNET_CONNECTION = 999,
  UNKNOWN = 500 // just in case of no known error codes
}
