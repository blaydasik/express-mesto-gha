import express from 'express';
import process from 'process';
// подключаем ODM
import mongoose from 'mongoose';
// импортируем парсер данных
import bodyParser from 'body-parser';
// импортируем константы ошибок
import { constants } from 'http2';
// импортируем роутеры
import usersRouter from './routes/users.js';
import cardsRouter from './routes/cards.js';

// установим порт для запуска сервера
const { PORT = 3000 } = process.env;

const app = express();
// задействуем нужные методы для парсера данных
app.use(bodyParser.json());

// включим валидацию для обновления документов
mongoose.set({ runValidators: true });
// подключимся к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .catch((err) => {
    console.log(`Connection to DB mestodb has failed with error: ${err}`);
  });

// мидлвэр, чтобы захардкорить id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '63690a244baa787d63252bb2',
  };
  next();
});

// настроим роуты
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
// для любых других роутов
app.all('*', (req, res) => {
  // 404 - был запрошен несушествующий роут
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Маршрута не найдена, насяльника.' });
});

// запустим сервер на выбранном порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
