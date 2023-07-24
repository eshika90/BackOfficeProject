const { ChattingServiceSocket } = require('../service/chattingService');
const MakeError = require('../utils/makeErrorUtil');

class ChattingControllerSocket {
  nameSpaceOn = async (io) => {
    // 네임스페이스 연결
    // 클라이언트가 연결을 요청한경우 => readyToChatting을 통해 권한을 인증하고, 필요한 정보를 받아오기
    const chattingRoom = io.of('/chattingRoom');

    const isOnline = {}; //userId를 저장
    const rooms = {};
    const chattingServiceSocket = new ChattingServiceSocket();

    return chattingRoom.on('connection', async (socket) => {
      try {
        await chattingServiceSocket.readyToChatting(socket, isOnline, rooms);

        await socket.on('readyToChatting', async () => {
          await chattingServiceSocket.readyToChatting(socket, isOnline, rooms);
        });

        await chattingServiceSocket.handleSendMessage(socket, isOnline, rooms);

        await chattingServiceSocket.getChattingMessage(socket);

        await chattingServiceSocket.handleExitChattingRoom(
          socket,
          isOnline,
          rooms,
        );

        chattingServiceSocket.handleDisconnect(socket, isOnline, rooms);
      } catch (err) {
        console.log(err);
        if (err instanceof MakeError) {
          console.log('qw');
          socket.emit('errorMessage', err.message);
          return;
        }
        return await socket.emit('errorMessage', 'Server Error');
      }
    });
  };
}

module.exports = ChattingControllerSocket;
