// импортируем константы ошибок
import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class InternalServerError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
