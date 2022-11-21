import { Router } from 'express';

// импортируем обработчики запросов для роутов
import {
  getUsers, getUserById, getCurrenUser, updateProfile, updateAvatar,
} from '../controllers/users.js';

// импортируем валидаторы celebrate
import {
  celebrategetUserById, celebrateupdateProfile, celebrateupdateAvatar,
} from '../validators/users.js';

// настроим маршруты для users
const usersRouter = Router();

// получим всех пользоватлей
usersRouter.get('/', getUsers);

// получим информацию о текущем пользователе
usersRouter.get('/me', getCurrenUser);

// получим пользователя по его id
usersRouter.get('/:userId', celebrategetUserById, getUserById);

// обновим информацию о пользователе
usersRouter.patch('/me', celebrateupdateProfile, updateProfile);

// обновим аватар
usersRouter.patch('/me/avatar', celebrateupdateAvatar, updateAvatar);

// экспортируем роутер
export default usersRouter;
