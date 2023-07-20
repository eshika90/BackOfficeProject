const { ChattingServiceSocket } = require('../service/chattingService');

class ChattingControllerSocket {
  nameSpaceOn = (io) => {
    // 네임스페이스 연결
    // 클라이언트가 연결을 요청한경우 => readyToChatting을 통해 권한을 인증하고, 필요한 정보를 받아오기
    const chattingRoom = io.of('/chattingRoom'); //채팅방 네임스페이스 생성
    const isOnline = {}; //userId를 저장
    const rooms = {};
    const chattingServiceSocket = new ChattingServiceSocket();

    return chattingRoom.on('connection', (socket) => {
      chattingServiceSocket.readyToChatting(socket, isOnline, rooms);

      chattingServiceSocket.handleSendMessage(socket);

      chattingServiceSocket.getChattingMessage(socket);

      chattingServiceSocket.handleExitChattingRoom(socket, isOnline, rooms);

      chattingServiceSocket.handleDisconnect(socket, isOnline, rooms);
    });
  };
}

module.exports = ChattingControllerSocket