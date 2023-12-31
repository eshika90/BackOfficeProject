const db = {
  development: {
    username: 'root',
    password: '4321!!!!',
    database: 'reviewtest2',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

const jwt = {
  secretKey: '',
  expireIn: '600s', // accesstoken 유효기간
  expireIn2: '7d', // refreshtoken 유효기간
};

const port = 3000;

const mailer = {
  user: '',
  password: '',
};

module.exports = { db, jwt, port, mailer };
