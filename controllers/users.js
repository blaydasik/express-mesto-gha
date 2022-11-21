import dotenv from 'dotenv';
// импортируем модуль для хэширования
import bcrypt from 'bcryptjs';
// импортируем пакет для создания JWT токена
import jwt from 'jsonwebtoken';
// импортируем классы ошибок
import HTTPError from '../errors/HTTPError.js';
import InternalServerError from '../errors/InternalServerError.js';
import NotFoundError from '../errors/NotFoundError.js';
import UnathorizedError from '../errors/UnathorizedError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
// импортируем схему пользователя
import User from '../models/user.js';

// длина модификатора входа хэш-функции
const saltLength = 10;

// добавим env-переменные из файла в process.env
dotenv.config();
// получим секретный ключ
const { NODE_ENV, JWT_SECRET } = process.env;

// обработчик запроса всех пользователей
export function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    // 500 - ушипка по умолчанию
    .catch((err) => next(new InternalServerError(err.message)));
}

// обработчик запроса пользователя по id
export function getUserById(req, res, next) {
  User.findById(req.params.userId === 'me' ? req.user._id : req.params.userId)
    .then((user) => {
      // проверим, есть ли user в БД
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        throw new NotFoundError(`Пользователь с указанным _id=${req.params.userId} не найден.`);
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: _id=${req.params.userId} при запросе информации о пользователе.`));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса создания пользователя
export function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хэшируем пароль
  bcrypt.hash(password, saltLength)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хэш вместо пароля в БД
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // ушипка 400 - данные для создания пользователя не прошли валидацию
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${Object.values(err.errors)[0].message}`));
      } else if (err.code === 11000) {
        // указан уже существующий email - ушипка 409
        next(new ConflictError('Нарушено условие на уникальность поля email :-('));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса обновления профиля
export function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      // проверим, найден ли пользователь
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        throw new NotFoundError(`Пользователь с указанным _id=${req.user._id} не найден.`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        // ушипка 400
        next(new BadRequestError(`Переданы некорректные данные при обновлении пользователя: ${Object.values(err.errors)[0].message}`));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса обновления аватара
export function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      // проверим, найден ли пользователь
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        throw new NotFoundError(`Пользователь c указанным _id=${req.user._id} не найден.`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // ушипка 400
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара :-('));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик залогинивания
export function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        // пэйлоуд токена
        { _id: user._id },
        // секретный ключ подписи
        NODE_ENV === 'production' ? JWT_SECRET : 'super_duper_crypto_strong_key',
        // объект опций - срок действия токена
        { expiresIn: '7d' },
      );
      // отправим токен клиенту, браузер сохранит его в куках
      res.cookie('jwt', token, {
        // срок хранения куки
        maxAge: 3600000 * 24 * 7,
        // защитим токен
        httpOnly: true,
        // защита от автоматической отправки кук
        sameSite: true,
      })
        .end(); // у ответа нет тела, используем метод end
    })
    .catch(() => {
      // 401 - ушипка авторизации
      next(new UnathorizedError('Передан неверный логин или пароль :-('));
    });
}
