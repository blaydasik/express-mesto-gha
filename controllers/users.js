// импортируем константы ошибок
import { constants } from 'http2';
// импортируем схему пользователя
import User from '../models/user.js';

// обработчик запроса всех пользователей
export function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    // 500 - ушипка по умолчанию
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
}

// обработчик запроса пользователя по id
export function getUserById(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      // проверим, есть ли user в БД
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь с указанным _id=${req.params.userId} не найден.` });
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные: _id=${req.params.userId} при запросе информации о пользователе.` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса создания пользователя
export function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // ушипка 400
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса обновления профиля
export function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      // проверим, найден ли пользователь
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь c указанным _id=${req.user._id} не найден.` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // ушипка 400
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса обновления аватара
export function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      // проверим, найден ли пользователь
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь c указанным _id=${req.user._id} не найден.` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // ушипка 400
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}
