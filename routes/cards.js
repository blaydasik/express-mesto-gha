import { Router } from 'express';

// импортируем обработчики запросов для роутов
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards.js';

// импортируем валидаторы
import {
  celebrateCardId, celebrateCreateCard,
} from '../validators/cards.js';

// настроим маршруты для cards
const cardsRouter = Router();

// получим все карточки
cardsRouter.get('/', getCards);

// удалим карточку по еe id
cardsRouter.delete('/:cardId', celebrateCardId, deleteCardById);

// создадим карточку
cardsRouter.post('/', celebrateCreateCard, createCard);

// поставим лайк карточке
cardsRouter.put('/:cardId/likes', celebrateCardId, likeCard);

// уберем лайк с карточки
cardsRouter.delete('/:cardId/likes', celebrateCardId, dislikeCard);

// экспортируем роутер
export default cardsRouter;
