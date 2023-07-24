const socket = io.connect('/chattingRoom');
let userRoomMessage;

socket.on('connect', () => {
  console.log('success connect');
});

socket.on('RoomUserInfo', (RoomUserInfo) => {
  console.log(RoomUserInfo);
  userRoomMessage = RoomUserInfo;
  // if (typeof RoomUserInfo === 'string') {
  //   userRoomMessage = null;
  // } else {
  //   userRoomMessage = RoomUserInfo;
  // }
});

// socket.emit('sendMessage',{roomId,message})

socket.on('errorMessage', (message) => {
  console.log(message);
});

socket.on('disconnect', () => {
  console.log('소켓종료됨');
});
const logoutSocket = () => {
  socket.disconnect();
};
const readyToChatting = () => {
  socket.emit('readyToChatting');
};

const sendMessage = (receiverId) => {
  let roomId = null;
  const message = document.getElementById('message-text').value;

  if (userRoomMessage.ChattingRooms.length) {
    let ChattingRooms = userRoomMessage.ChattingRooms;
    let i, a;
    for (a = 0; a < ChattingRooms.length; a++) {
      if (roomId) {
        break;
      }
      const roomInfo = ChattingRooms[a];
      console.log(roomInfo);
      for (i = 0; i < roomInfo.Users.length; i++) {
        if (Number(roomInfo.Users[i].id) === Number(receiverId)) {
          roomId = userRoomMessage.ChattingRooms[a].id;
          const createdAt = new Date().toJSON();
          roomInfo.ChattingMessages.push({
            userId: userRoomMessage.id,
            message,
            createdAt,
          });
          console.log(userRoomMessage);
          break;
        }
      }
    }
  }

  if (!roomId) {
    console.log('zxcdv');
    socket.emit('sendMessage', {
      roomId,
      message,
      receiverId,
      isExistRoom: false,
    });
  } else {
    socket.emit('sendMessage', {
      roomId,
      message,
      receiverId: null,
      isExistRoom: true,
    });
  }
};

const exitChattingRoom = (roomId) => {
  userRoomMessage.ChattingRooms = userRoomMessage.ChattingRooms.filter(
    (room) => {
      return !room.id === roomId;
    },
  );
  console.log(userRoomMessage);
  socket.emit('exitChattingRoom', { roomId });
};

socket.on('newChattingRoom', (data) => {
  if (!userRoomMessage) {
    userRoomMessage = {};
  } else {
    userRoomMessage.ChattingRooms.push(data);
    console.log('newChattingRoom', userRoomMessage);
  }
  console.log('newChattingRoom', userRoomMessage);
});
