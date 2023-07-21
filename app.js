const express = require('express');
const { Server } = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const indexRouter = require('./routes/indexRoutes.js');
const http = Server(app);

app.use([express.json(), cookieParser(), cors()]);
app.use(express.static('public'));
app.use('/api', indexRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/mainReservation.html');
});

app.get('/reservation/create', (req, res) => {
  res.sendFile(__dirname + '/public/html/createReservation.html');
});

module.exports = http;
