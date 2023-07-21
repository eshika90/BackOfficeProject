const express = require('express');
const { Server } = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const indexRouter = require('./routes/indexRoutes.js');
const http = Server(app);

app.use([express.json(), cookieParser()]);
app.use('/api', indexRouter);

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(express.static('public'));

app.get('/reservation', (req, res) => {
  res.sendFile(__dirname + '/public/mainReservation.html');
});

app.get('/reservation/update', (req, res) => {
  res.sendFile(__dirname + '/public/updateReservation.html');
});

module.exports = http;
