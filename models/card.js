import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
  // имя карточки
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    // ссылка на картинку
    link: {
      type: String,
      required: true,
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

// создадим и экспортируем модель user
export default mongoose.model('card', cardSchema);
