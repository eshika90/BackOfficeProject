const socketIo = require('socket.io');
const http = require('./app.js');
const ChattingControllerSocket = require("./controller/chattingController.js");
const chattingController = new ChattingControllerSocket()


const io = socketIo(http);
chattingController.nameSpaceOn(io)