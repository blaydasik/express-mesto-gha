/* eslint-disable linebreak-style */
import { Router } from 'express';

// импортируем обработчики запросов для роутов
import { getUsers, getUserById, createUser } from '../controllers/users.js';

// настроим маршруты для users
const usersRouter = Router();

// получим всех пользоватлей
usersRouter.get('/', getUsers);

// получим пользователя по его id
usersRouter.get('/:userId', getUserById);

// создадим пользователя
usersRouter.post('/', createUser);

// экспортируем роутер
export default usersRouter;
