// импортируем константы ошибок
import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class UnathorizedError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'UnathorizedError';
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

export default UnathorizedError;
