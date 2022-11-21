import express from 'express';

// импортируем роутеры
import usersRouter from './users.js';
import cardsRouter from './cards.js';
// импортируем обработчики запросов для роутов
import { login, createUser } from '../controllers/users.js';
// импортируем мидлвару авторизации
import auth from '../middlewares/auth.js';
// импортируем валидаторы celebrate
import { celebrateLoginUser, celebrateCreateUser } from '../validators/users.js';
import NotFoundError from '../errors/NotFoundError.js';

const router = express();

// настроим роуты
router.post('/signin', celebrateLoginUser, login);
router.post('/signup', celebrateCreateUser, createUser);

// защитим все остальные роуты авторизацией
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
// для любых других роутов
router.all('*', (req, res, next) => {
  // 404 - был запрошен несушествующий роут
  next(new NotFoundError('Маршрута не найдена, насяльника.'));
});

export default router;
