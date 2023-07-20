const express = require('express');
const { Server } = require('http');
const cookieParser = require('cookie-parser');

const app = express();
const indexRouter = require('./routes/indexRoutes.js');
const http = Server(app);

app.use([express.json(), cookieParser()]);
app.use('/api', indexRouter);

module.exports = http;
