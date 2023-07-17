const socketIo = require('socket.io');
const http = require('./app.js');

const io = socketIo(http);
io.on('connection', (socket) => {});
