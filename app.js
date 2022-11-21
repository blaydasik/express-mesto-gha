import express from 'express';
import process from 'process';

// подключаем ODM
import mongoose from 'mongoose';
// импортируем парсеры данных
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// импортируем мидлвэр для обработки ошибок celebrate
import { errors } from 'celebrate';
// импортируем константы ошибок
import { constants } from 'http2';
// импортируем роутеры
import usersRouter from './routes/users.js';
import cardsRouter from './routes/cards.js';
// импортируем обработчики запросов для роутов
import { login, createUser } from './controllers/users.js';
// импортируем мидлвару авторизации
import auth from './middlewares/auth.js';
// импортируем валидаторы celebrate
import { celebrateLoginUser, celebrateCreateUser } from './validators/users.js';

// установим порт для запуска сервера, получим секретный ключ
const { PORT = 3000 } = process.env;

process.on('unhandledRejection', (err) => {
  console.log(`Unexpected error: ${err}`);
  process.exit(1);
});

const app = express();
// задействуем нужные методы для парсеров данных
app.use(bodyParser.json());
app.use(cookieParser());

// включим валидацию для обновления документов
mongoose.set({ runValidators: true });
// подключимся к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .catch((err) => {
    console.log(`Connection to DB mestodb has failed with error: ${err}`);
  });

// настроим роуты
app.post('/signin', celebrateLoginUser, login);
app.post('/signup', celebrateCreateUser, createUser);

// защитим все остальные роуты авторизацией
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
// для любых других роутов
app.all('*', (req, res) => {
  // 404 - был запрошен несушествующий роут
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Маршрута не найдена, насяльника.' });
});

// обработчик ошибок celebrate
app.use(errors());

// мидлвэр для централизованной обработки ошибок
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    message = 'На сервере произошла необработанная нами ушипка.';
  }
  // если ошибка сгенерирована не нами
  res.status(statusCode).send({ message });
  next();
});

// запустим сервер на выбранном порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
