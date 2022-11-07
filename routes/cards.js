import { Router } from 'express';

// импортируем обработчики запросов для роутов
import { getCards, deleteCardById, createCard } from '../controllers/cards.js';

// настроим маршруты для cards
const cardsRouter = Router();

// получим все карточки
cardsRouter.get('/', getCards);

// получим пользователя по его id
cardsRouter.get('/:cardId', deleteCardById);

// создадим карточку
cardsRouter.post('/', createCard);

// экспортируем роутер
export default cardsRouter;
