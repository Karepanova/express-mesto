const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  createUser,
  login,
} = require('./controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.post('/signin', validateLogin, login); // вход

app.post('/signup', validateCreateUser, createUser); // регистрация

app.use(auth); // авторизация

app.use('/users', require('./routes/users')); // все операции с пользователями (получить, удалить, изменить)

app.use('/cards', require('./routes/cards')); // все операции с карточками

app.use((req, res) => res.status(404).send({ message: 'Ресурс не найден' }));

app.use(errors);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  /* eslint no-console: "off" */
  console.log(`App listening on port ${PORT}`);
});
