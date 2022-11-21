import { celebrate, Joi } from 'celebrate';
import urlRegex from '../utils/constants.js';

// валидатор id карточки при удалении, лайке и дизлайке
export const celebrateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

// валидатор полей при создании карточки
export const celebrateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
  }),
});
