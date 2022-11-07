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
    .then((user) => res.send(user))
    .catch((err) => {
      // если пользователь не нашелся в БД, то ушипка 404
      // поскольку mongoose выдает CastError, если не смогла найти пользователя в базе
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по указанному _id=${req.params.userId} не найден.` });
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
