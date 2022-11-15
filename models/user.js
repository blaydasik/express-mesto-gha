import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
  // имя пользователя
    name: {
      type: String,
      minlength: [2, 'поле имя `{VALUE}` содержит менее 2 символов.'],
      maxlength: [30, 'поле имя `{VALUE}` содержит более 30 символов.'],
      default: 'Жак-Ив Кусто',
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: [2, 'поле о пользователе `{VALUE}` содержит менее 2 символов.'],
      maxlength: [30, 'поле о пользователе `{VALUE}` содержит более 30 символов.'],
      default: 'Исследователь',
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    // email
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'поле email `{VALUE}` не прошло валидацию.',
      },
      required: [true, 'поле email не заполнено.'],
    },
    // пароль
    password: {
      type: String,
      required: [true, 'поле пароль не заполнено.'],
    },
  },
  // уберем лишний для нас ключ с версией документа
  { versionKey: false },
);

// создадим и экспортируем модель user
export default mongoose.model('user', userSchema);
