import mongoose from 'mongoose';
// импортируем регулярку
import urlRegex from '../utils/constants.js';

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
      validate: {
        validator: (url) => urlRegex.test(url),
        message: 'поле адрес картинки `{VALUE}` не прошло валидацию.',
      },
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

// создадим и экспортируем модель card
export default mongoose.model('card', cardSchema);
