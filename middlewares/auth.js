import jwt from 'jsonwebtoken';
// импортируем классы ошибок
import UnathorizedError from '../errors/UnathorizedError.js';

// получим секретный ключ
const { NODE_ENV, JWT_SECRET } = process.env;

// мидлвэр для авторизации
function auth(req, res, next) {
  // извлечем авторизационный заголовок
  const { authorization } = req.headers;
  // извлечем куки
  const { cookies } = req;
  // проверим наличие должного авторизационного заголовка или куки с токеном
  if ((authorization && authorization.startsWith('Bearer ')) || (cookies && cookies.jwt)) {
    // извлечем токен или из заголовка, или из куки
    const token = authorization ? authorization.replace('Bearer ', '') : cookies.jwt;
    let payload;
    // верификация токена
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super_duper_crypto_strong_key');
    } catch (err) {
      // ушипка 401 - токен не прошел верификацию
      next(new UnathorizedError('Переданный токен не верифицирован :-('));
    }
    // записываем пейлоуд в объект запроса
    req.user = payload;
    next();
  } else {
    // ушипка 401 - токена нет в заголовке и куки с токеном тоже нет
    next(new UnathorizedError('Отсутствует авторизационный заголовок или кука :-('));
  }
}

export default auth;
