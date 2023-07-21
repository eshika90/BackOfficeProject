const express = require('express');
const { Server } = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const indexRouter = require('./routes/indexRoutes.js');
const http = Server(app);

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use([express.json(), cookieParser()]);
app.use('/api', indexRouter);
app.use(express.static('public'));

module.exports = http;
