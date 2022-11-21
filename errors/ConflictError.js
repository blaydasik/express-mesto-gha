// импортируем константы ошибок
import { constants } from 'http2';
import HTTPError from './HTTPError.js';

class ConflictError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

export default ConflictError;
