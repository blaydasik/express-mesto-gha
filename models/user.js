import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
  // имя пользователя
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    // информация о пользователе
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    // ссылка на аватарку
    avatar: {
      type: String,
      required: true,
    },
  },
  // уберем лишний для нас ключ с версией документа
  { versionKey: false },
);

// создадим и экспортируем модель user
export default mongoose.model('user', userSchema);
