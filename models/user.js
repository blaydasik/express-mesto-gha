import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
  // имя пользователя
    name: {
      type: String,
      minlength: [2, 'поле имя [{VALUE}] содержит менее 2 символов'],
      maxlength: [30, 'поле имя [{VALUE}] содержит более 30 символов'],
      required: [true, 'поле имя не заполнено'],
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: [2, 'поле о пользователе [{VALUE}] содержит менее 2 символов'],
      maxlength: [30, 'поле о пользователе [{VALUE}] содержит более 30 символов'],
      required: [true, 'поле о пользователе не заполнено'],
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      required: [true, 'поле ссылка на аватар не заполнено'],
    },
  },
  // уберем лишний для нас ключ с версией документа
  { versionKey: false },
);

// создадим и экспортируем модель user
export default mongoose.model('user', userSchema);
