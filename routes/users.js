import { Router } from 'express';

// импортируем обработчики запросов для роутов
import {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} from '../controllers/users.js';

// настроим маршруты для users
const usersRouter = Router();

// получим всех пользоватлей
usersRouter.get('/', getUsers);

// получим пользователя по его id
usersRouter.get('/:userId', getUserById);

// создадим пользователя
usersRouter.post('/', createUser);

// обновим информацию о пользователе
usersRouter.patch('/me', updateProfile);

// обновим аватар
usersRouter.patch('/me/avatar', updateAvatar);

// экспортируем роутер
export default usersRouter;
