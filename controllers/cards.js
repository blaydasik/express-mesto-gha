// импортируем классы ошибок
import HTTPError from '../errors/HTTPError.js';
import InternalServerError from '../errors/InternalServerError.js';
import NotFoundError from '../errors/NotFoundError.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import BadRequestError from '../errors/BadRequestError.js';
// импортируем схему карточки
import Card from '../models/card.js';

// обработчик запроса всех карточек
export function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.send(cards))
    // 500 - ушипка по умолчанию
    .catch((err) => next(new InternalServerError(err.message)));
}

// обработчик запроса удаления карточки по id
export function deleteCardById(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      // проверим, нашлась ли карточка в базе
      if (!card) {
        // если карточка не нашлась в БД, то ушипка 404
        throw new NotFoundError('Указанная карточка в базе не найдена :-(');
        // проверим принадлежность карточки текущему пользователю
      } else if (card.owner.toString() !== req.user._id) {
        // если карточка не принадлежит пользователю, то ушипка 403
        throw new ForbiddenError('Зафиксирована попытка удаления чужой карточки :-(');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((result) => {
            res.send(result);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // ушипка 400
        next(new BadRequestError('Переданы некорректные данные для удаления карточки :-('));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса создания карточки
export function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // ушипка 400
        next(new BadRequestError(`Переданы некорректные данные при создании карточки: ${Object.values(err.errors)[0].message}`));
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса постановки лайка
export function likeCard(req, res, next) {
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
        throw new NotFoundError(`Передан несуществующий _id=${req.params.cardId} карточки.`);
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: _id=${req.params.cardId} для постановки лайка.`));
      } if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}

// обработчик запроса снятия лайка
export function dislikeCard(req, res, next) {
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
        throw new NotFoundError(`Передан несуществующий _id=${req.params.cardId} карточки.`);
      }
    })
    .catch((err) => {
      // если передан некорректный _id - ушипка 400
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: _id=${req.params.cardId} для постановки лайка.`));
      } if (err instanceof HTTPError) {
        next(err);
      } else {
        // 500 - ушипка по умолчанию
        next(new InternalServerError(err.message));
      }
    });
}
