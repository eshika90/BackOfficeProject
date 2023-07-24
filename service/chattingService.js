const ChattingRepository = require('../repositories/chattingRepository.js');
const { authMiddlewareSocket } = require('../middlewares/auth-middleware.js');
const {
  TransactionManager,
  Transaction,
} = require('../service/transactionManagerService.js');
const MakeError = require('../utils/makeErrorUtil.js');
const { sequelize, Users, Room_Users } = require('../models');
const chattingRepository = new ChattingRepository();
let isFirstMessage = true;
class ChattingServiceHTTP {
  constructor() {
    this.transactionManager = TransactionManager(
      sequelize,
      Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    );
  }

  makeChattingRoom = async (roomInfoObject, userInfoArr) => {
    const transactionManager = await TransactionManager(
      sequelize,
      Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    );
    const transaction = transactionManager.getTransaction();

    try {
      const { name, password } = roomInfoObject;
      const chattingRoom = await chattingRepository.makeChattingRoom(
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
      await chattingRepository.addManyUserToRoom(roomUserInfoArr, {
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
      const result = await chattingRepository.storeMessage(data);
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
      const roomInfo = await chattingRepository.getChattingRoom({
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

      const roomUserInfo = await chattingRepository.addOneUserToRoom(
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
      const isExitRoom = chattingRepository.exitChattingRoom({
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
      const message = chattingRepository.getChattingMessage({
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

const chattingServiceHTTP = new ChattingServiceHTTP();

class ChattingServiceSocket {
  readyToChatting = async (socket, isOnline, rooms) => {
    try {
      await authMiddlewareSocket(socket);
      const userId = socket.userId;
      console.log(userId);
      delete socket.userId;
      if (!userId) {
        throw new MakeError(401, '로그인을 진행해주세요', 'invalid userInfo');
      }
      const RoomsAndMessagesDb = await chattingRepository.getRoomsAndUsers(
        userId,
      );
      const RoomsAndMessages = RoomsAndMessagesDb.toJSON();
      socket.emit('RoomUserInfo', RoomsAndMessages);

      if (!RoomsAndMessages) {
        throw new MakeError(401, '로그인 해라잉', 'invalid userInfo');
      } else if (!RoomsAndMessages.ChattingRooms.length) {
        console.log(RoomsAndMessages);
        socket.emit('RoomUserInfo', RoomsAndMessages);
        return;
      }
      const roomInfoArr = RoomsAndMessages.ChattingRooms.map((data) => {
        if (!rooms[data.id]) {
          socket.join(data.id);
          const userInfoObj = {};
          data.Users.forEach((user) => {
            userInfoObj[user.id] = user.name;
          });
          const name = userInfoObj[userId];
          const users = {};
          users[userId] = userInfoObj[userId];
          rooms[data.id] = {
            password: data.password,
            name: data.name,
            users,
            allUsers: userInfoObj,
          };
        } else {
          rooms[data.id].users[userId] = RoomsAndMessages.name;
        }
        return data.id;
      });
      isOnline[userId] = roomInfoArr;
      console.log('isOnline', isOnline);
      console.log('rooms', rooms);
    } catch (err) {
      console.log(err);
    }
  };

  handleSendMessage = (socket, isOnline, rooms) => {
    return socket.on('sendMessage', async (data) => {
      try {
        await authMiddlewareSocket(socket);
        const senderId = socket.userId;
        let { roomId, message, receiverId, isExistRoom } = data;
        let isNewChattingRoom = false;
        let roomData;

        if (!isExistRoom) {
          isNewChattingRoom = true;
          roomData = await chattingRepository.makeChattingRoom({
            name: 'room',
            password: 'a',
          });
          await chattingRepository.addManyUserToRoom([
            { userId: senderId, roomId: roomData.id },
            { userId: receiverId, roomId: roomData.id },
          ]);
          roomId = roomData.id;
          this.setChattingObj(
            socket,
            senderId,
            roomId,
            isOnline,
            rooms,
            message,
          );
        }
        const sendMessage = {
          roomId,
          userId: senderId,
          message,
          isNewChattingRoom,
        };
        socket.broadcast.to(roomId).emit('sendMessage', sendMessage);
        chattingServiceHTTP.storeMessage(sendMessage);
        delete socket.userId;
      } catch (err) {
        console.log(err);
      }
    });
  };
  async setChattingObj(socket, userId, roomId, isOnline, rooms, message) {
    try {
      const getRoomInfo = await chattingRepository.getChattingRoom({
        where: { id: roomId },
        attributes: ['id', 'password', 'name', 'createdAt', 'updatedAt'],
        include: {
          model: Users,
          attributes: ['id', 'name'],
          through: {
            model: Room_Users,
            attributes: [],
          },
        },
        separate: true,
      });
      if (isFirstMessage) {
        isOnline[userId] = [roomId];
        const userInfoObj = {};
        getRoomInfo.Users.forEach((userInfo) => {
          userInfoObj[userInfo.id] = userInfo.name;
        });
        rooms[roomId] = {
          password: getRoomInfo.password,
          name: getRoomInfo.name,
          users: userInfoObj,
        };
        isFirstMessage = false;
      } else {
        isOnline[userId].push(roomId);
      }
      const createdAt = new Date().toJSON();
      const chattingRoomInfo = getRoomInfo.toJSON();
      chattingRoomInfo.ChattingMessages = [{ userId, message, createdAt }];
      socket.emit('newChattingRoom', chattingRoomInfo);
    } catch (err) {
      console.log(err);
      // i++
      // if(i>3){
      //   console.log(err)
      //   return err;
      // }
      // setChattingObj(userId, roomId, isOnline, rooms)
    }
  }

  handleExitChattingRoom = (socket, isOnline, rooms) => {
    return socket.on('exitChattingRoom', async (data) => {
      try {
        //join된 룸에서 나가기
        await authMiddlewareSocket(socket);
        const roomId = Number(data.roomId);
        const userId = Number(socket.userId);
        delete socket.userId;
        if (isNaN(roomId) || isNaN(userId) || !roomId || !userId) {
          throw new MakeError(
            400,
            '채팅방정보 또는 유저정보가 잘못되었습니다',
            'invalid request',
          );
        }
        const roomIndex = isOnline[userId].indexOf(roomId);
        isOnline[userId][roomIndex] = null;
        console.log('aaa', rooms);
        if (!Object.keys(rooms[roomId].allUsers).length === 1) {
          chattingRepository.exitChattingRoom({ where: { roomId } });
          delete rooms[roomId];
        } else {
          delete rooms[roomId].users[String(userId)];
          chattingRepository.exitChattingRoom({
            where: { userId: Number(userId) },
          });
        }
        chattingServiceHTTP.exitChattingRoom({ userId, roomId });

        socket.broadcast.to(roomId).emit('exitUserInfo', userId);
      } catch (err) {
        console.log(err);
      }
    });
  };

  handleDisconnect = (socket, isOnline, rooms) => {
    return socket.on('disconnect', async () => {
      try {
        await authMiddlewareSocket(socket);
        const userId = socket.userId;
        delete socket.userId;
        console.log(isOnline);
        isOnline[userId].forEach((roomId) => {
          if (Object.keys(rooms[String(roomId)].users).length === 1) {
            delete rooms[roomId];
          } else {
            delete rooms[roomId].users[userId];
          }
        });
        delete isOnline[userId];
        console.log('eixt isOnline :', isOnline);
        console.log('rooms :', rooms);
      } catch (err) {
        console.log(err);
      }
    });
  };

  getChattingMessage = (socket) => {
    return socket.on('getMessages', async (data) => {
      await authMiddlewareSocket(socket);
      delete socket.userId;
      const { roomId, offset } = data;
      const messages = await chattingRepository.getChattingMessage({
        roomId: roomId,
        offset: offset,
        order: [['createdAt', 'ASC']],
      });
      return socket.emit('getMessage', messages);
    });
  };
}

module.exports = { ChattingServiceSocket, ChattingServiceHTTP };
