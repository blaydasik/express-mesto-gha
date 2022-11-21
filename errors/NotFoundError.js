// импортируем константы ошибок
import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

export default NotFoundError;
