// импортируем константы ошибок
import { constants } from 'http2';

// мидлвэр для централизованной обработки ошибок
function proceedErrors(err, req, res, next) {
  let { statusCode, message } = err;
  if (!statusCode) {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    message = 'На сервере произошла необработанная нами ушипка.';
  }
  // если ошибка сгенерирована не нами
  res.status(statusCode).send({ message });
  next();
}

export default proceedErrors;
