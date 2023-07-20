const ChattingRepository = require('../repositories/chattingRepository.js');
const { authMiddlewareSocket } = require('../middlewares/auth-middleware.js');
const {
  TransactionManager,
  Transaction,
} = require('../service/transactionManagerService.js');
const MakeError = require('../utils/makeErrorUtil.js');
const { sequelize } = require('../models');

class ChattingServiceSocket {
  constructor() {
    this.chattingRepository = new ChattingRepository();
    this.chattingServiceHTTP = new ChattingServiceHTTP();
  }

  readyToChatting = async (socket, isOnline, rooms) => {
    try {
      const user = authMiddlewareSocket(socket);
      const userId = user.id;
      socket.userId = userId;

      if (!user) {
        socket.disconnect();
      } else {
        const RoomsAndMessages = await this.chattingRepository.getRoomsAndUsers(
          userId,
        );
        const roomInfoArr = RoomsAndMessages.ChattingRooms.map((data) => {
          if (!rooms[data.id]) {
            socket.join(data.id);
            const userInfoObj = {};
            data.Users.forEach((user) => {
              userInfoObj[user.id] = user.name;
            });

            rooms[data.id] = {
              password: data.password,
              name: data.name,
              users: userInfoObj,
            };
          } else {
            rooms[data.id].users.push(RoomsAndMessages.id);
          }
          return data.ChattingRoom.id;
        });
        isOnline[userId] = roomInfoArr;
        socket.emit('RoomUserInfo', RoomsAndMessages);
      }
    } catch (err) {
      throw err;
    }
  };

  handleSendMessage = (socket) => {
    return socket.on('sendMessage', async (data) => {
      const { roomId, userId, message } = data;
      const sendMessage = { userId, message };
      await this.chattingServiceHTTP.storeMessage(data);
      socket.broadcast.to(roomId).emit('sendMessage', sendMessage);
    });
  };

  handleExitChattingRoom = (socket, isOnline, rooms) => {
    return socket.on('exitChattingRoom', async (data) => {
      try {
        const { roomId, userId } = data;
        if (
          isNaN(Number(roomId)) ||
          isNaN(Number(userId)) ||
          !roomId ||
          !userId
        ) {
          throw new MakeError(
            400,
            '채팅방정보 또는 유저정보가 잘못되었습니다',
            'invalid request',
          );
        }
        const roomIndex = isOnline[userId].indexOf(roomId);
        isOnline[userId][roomIndex] = null;
        delete rooms[roomId].users[userId];

        this.chattingServiceHTTP.exitChattingRoom(data);

        socket.broadcast.to(roomId).emit('exitUserInfo', userId);
      } catch (err) {}
    });
  };

  handleDisconnect = (socket, isOnline, rooms) => {
    return socket.on('disconnection', () => {
      const userId = socket.userId;
      isOnline[userId].forEach((roomId) => {
        delete rooms[roomId][userId];
      });
      delete isOnline[userId];
    });
  };

  getChattingMessage = async (socket) => {
    return socket.on('getMessages', async (data) => {
      const { roomId, offset } = data;
      const messages = this.chattingRepository.getChattingMessage({
        roomId: Number(roomId),
        offset: Number(offset),
      });
      return socket.emit('getMessage', messages);
    });
  };
}

class ChattingServiceHTTP {
  constructor() {
    this.transactionManager = TransactionManager(
      sequelize,
      Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    );
    this.chattingRepository = new ChattingRepository();
  }

  makeChattingRoom = async (roomInfoObject, userInfoArr) => {
    const transactionManager = await TransactionManager(
      sequelize,
      Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    );
    const transaction = transactionManager.getTransaction();

    try {
      const { name, password } = roomInfoObject;
      const chattingRoom = await this.chattingRepository.makeChattingRoom(
        { name, password },
        {
          transaction,
        },
      );
      // 2. 중간테이블에 User들과 채팅방 추가 by bulkCreate
      const roomId = chattingRoom.id;
      const roomUserInfoArr = userInfoArr.map((userId) => {
        return { roomId, userId };
      });
      await this.chattingRepository.addManyUserToRoom(roomUserInfoArr, {
        transaction,
      });

      await transactionManager.commitTransaction();
    } catch (err) {
      await transactionManager.rollbackTransaction();
      throw err;
    }
  };

  storeMessage = async (data) => {
    try {
      const result = await this.chattingRepository.storeMessage(data);
      if (!result) {
        throw new MakeError(
          401,
          '메세지 저장에 실패하였습니다',
          'failed to store message',
        );
      }
      return true;
    } catch (err) {
      throw err;
    }
  };

  joinChattingRoom = async (joinChattingRoomOptions) => {
    try {
      const transaction = this.transactionManager.getTransaction();
      const { roomId, userId, password } = joinChattingRoomOptions;
      const roomInfo = await this.chattingRepository.getChattingRoom({
        where: { id: roomId, password },
        transaction,
      });

      if (!roomInfo) {
        throw new MakeError(
          401,
          '채팅방 가입 권한이 존재하지 않습니다',
          'invalid chattingRoom auth',
        );
      }

      const roomUserInfo = await this.chattingRepository.addOneUserToRoom(
        { roomId, userId },
        { transaction },
      );

      if (!roomUserInfo) {
        throw new MakeError(
          500,
          '채팅방 가입에 실패하였습니다',
          'failed to join chattingRoom',
        );
      }
      await this.transactionManager.commitTransaction();
    } catch (err) {
      await this.transactionManager.rollbackTransaction();
      throw err;
    }
  };

  exitChattingRoom = async (options) => {
    try {
      const { roomId, userId } = options;
      const isExitRoom = this.chattingRepository.exitChattingRoom({
        where: { userId, roomId },
      });
      if (!isExitRoom) {
        throw new MakeError(
          401,
          '채팅방 탈퇴에 실패하였습니다',
          'failed to exit chattingRoom',
        );
      }
    } catch (err) {
      throw err;
    }
  };

  getChattingMessage = async (options) => {
    try {
      const { roomId, offset } = options;
      if ((isNaN(roomId), isNaN(offset))) {
        throw new MakeError(400, '요청값이 잘못되었습니다', 'invalid request');
      }
      const message = this.chattingRepository.getChattingMessage({
        where: { roomId },
        order: [['createdAt', 'ASC']],
        offset: offset,
      });
      return message;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = { ChattingServiceSocket, ChattingServiceHTTP };
