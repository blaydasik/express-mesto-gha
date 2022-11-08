import { Router } from 'express';

// импортируем обработчики запросов для роутов
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards.js';

// настроим маршруты для cards
const cardsRouter = Router();

// получим все карточки
cardsRouter.get('/', getCards);

// получим пользователя по его id
cardsRouter.delete('/:cardId', deleteCardById);

// создадим карточку
cardsRouter.post('/', createCard);

// поставим лайк карточке
cardsRouter.put('/:cardId/likes', likeCard);

// уберем лайк с карточки
cardsRouter.delete('/:cardId/likes', dislikeCard);

// экспортируем роутер
export default cardsRouter;
