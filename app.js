import express from 'express';
import process from 'process';

// подключаем ODM
import mongoose from 'mongoose';
// импортируем парсеры данных
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// импортируем мидлвэр для обработки ошибок celebrate
import { errors } from 'celebrate';
// импортируем роутер
import router from './routes/index.js';
// импортируем миддлвару централизованнйо обработки ошибок
import proceedErrors from './middlewares/proceedErrors.js';

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

// подключим роуты
app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// подключим мидлвэр для централизованной обработки ошибок
app.use(proceedErrors);

// запустим сервер на выбранном порту
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
