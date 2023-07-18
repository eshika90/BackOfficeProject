const express = require('express');
const { Server } = require('http');
const cookieParser = require('cookie-parser');

const app = express();
const router = require('./routes/index.js');
const http = Server(app);

app.use([express.json(), cookieParser()]);
app.use('/', router);

module.exports = http;
