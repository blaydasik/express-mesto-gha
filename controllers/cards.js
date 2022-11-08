/* eslint-disable linebreak-style */
// импортируем константы ошибок
import { constants } from 'http2';
// импортируем схему карточки
import Card from '../models/card.js';

// обработчик запроса всех карточек
export function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send(cards))
    // 500 - ушипка по умолчанию
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
}

// обработчик запроса удаления карточки по id
export function deleteCardById(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      // проверим, есть ли карточка в БД
      if (card) {
        res.send(card);
      } else {
        // если карточка не нашлась в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Карточка с указанным _id=${req.params.cardId} не найдена.` });
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные: _id=${req.params.cardId} для удаления карточки.` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса создания карточки
export function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // ушипка 400
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки: ${Object.values(err.errors)[0].message}` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса постановки лайка
export function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      // проверим, есть ли карточка в БД
      if (card) {
        res.send(card);
      } else {
        // если карточка не нашлась в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Передан несуществующий _id=${req.params.cardId} карточки.` });
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные: _id=${req.params.cardId} для постановки лайка.` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}

// обработчик запроса снятия лайка
export function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      // проверим, есть ли карточка в БД
      if (card) {
        res.send(card);
      } else {
        // если карточка не нашлась в БД, то ушипка 404
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: `Передан несуществующий _id=${req.params.cardId} карточки.` });
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные: _id=${req.params.cardId} для снятия лайка.` });
      } else {
        // 500 - ушипка по умолчанию
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
      }
    });
}
