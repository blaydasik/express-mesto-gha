/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
  // имя карточки
    name: {
      type: String,
      minlength: [2, 'поле имя [{VALUE}] содержит менее 2 символов'],
      maxlength: [30, 'поле имя [{VALUE}] содержит более 30 символов'],
      required: [true, 'поле имя не заполнено'],
    },
    // ссылка на картинку
    link: {
      type: String,
      required: [true, 'поле ссылки на картинку не заполнено'],
    },
    // ссылка на модель автора карточки
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    // список лайкнувших пост пользователей
    likes: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      }],
      // зададим значение по умолчанию
      default: [],
    },
    // дата создания
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // уберем лишний для нас ключ с версией документа
  { versionKey: false },
);

// метод схемы для проверки, что текущий пользователь - владелец карточки
cardSchema.statics.checkCardOwner = function (cardId, ownerId) {
  return this.findOne(cardId)
    .then((card) => {
      // проверим, нашлась ли карточка в базе
      if (card) {
        // вернем результат проверки принадлежности карточки текущему пользователю
        if(card.owner === ownerId) {
          return true;
        } else {
          return Promise.reject(new Error('Зафиксирована попытка удаления чужой карточки :-('));
        }
      } // иначе отклоняем промис с ошибкой
      return Promise.reject(new Error('Указанная карточка в базе не найдена :-('));
    });
};

// создадим и экспортируем модель card
export default mongoose.model('card', cardSchema);
