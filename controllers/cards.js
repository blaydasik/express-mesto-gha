// импортируем константы ошибок
import { constants } from 'http2';
// импортируем схему карточки
import Card from '../models/card.js';

// обработчик запроса всех карточек
export function getCards(req, res) {
  Card.find({})
    .then((users) => res.send(users))
    // 500 - ушипка по умолчанию
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
}

// обработчик запроса пользователя по id
export function deleteCardById(req, res) {
  Card.findById(req.params.userId)
    .then((user) => {
      // проверим, есть ли user в БД
      if (user) {
        res.send(user);
      } else {
        // если пользователь не нашелся в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по указанному _id=${req.params.userId} не найден.` });
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некрректные данные: _id=${req.params.userId} при запросе информации о пользователе.` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса создания пользователя
export function createCard(req, res) {
  const { name, about, avatar } = req.body;
  Card.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // ушипка 400
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}
