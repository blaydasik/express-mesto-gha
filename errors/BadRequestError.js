// импортируем константы ошибок
import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

export default BadRequestError;
