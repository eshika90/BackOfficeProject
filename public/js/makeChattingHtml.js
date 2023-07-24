const chattingRoomHtml = (petSitterId, petSitterName) => {
  const chattingRoomContainer = document.getElementById(
    'chattingRoomContainer',
  );
  const roomName = document.getElementById('roomName');
  const chattingRoomDiv = document.getElementById('chatRoom');
  const senderName = userRoomMessage.name;
  const senderId = userRoomMessage.id;
  const receiverId = Number(petSitterId);
  const receiverName = petSitterName;
  let roomId;
  let chattingUsers = {};
  console.log(receiverId);
  console.log(senderId);
  console.log(chattingRoomContainer.style.display);
  if (receiverId === senderId) {
    alert('자기자신한테는못보냅니다');
    return;
  }
  if (chattingRoomContainer.style.display !== 'block') {
    chattingRoomContainer.style.display = 'block';
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', () => {
      const receiverIdInEvent = receiverId;
      sendMessage(receiverIdInEvent);
    });
    roomName.innerText = `펫시터 ${receiverName}의 채팅방`;
    userRoomMessage.ChattingRooms.forEach((room) => {
      room.Users.forEach((user) => {
        if (user.id === receiverId) {
          //채팅방 html만드는 로직
          room.Users.forEach((user) => {
            chattingUsers[user.id] = user.name;
          });
          let roomHtml = '';
          chattingRoomDiv.innerHTML = '';
          room.ChattingMessages.forEach((message) => {
            if (message.userId === senderId) {
              console.log('sender');
              chattingRoomDiv.innerHTML += `
                <p class = senderName>${senderName}</p>
                <p class=senderMessage>${message.message}</p>`;
            } else {
              console.log('receiver');
              chattingRoomDiv.innerHTML += `
            <p class = receiverName>${receiverName}</p>
            <p class=receiverMessage>${message.message}</p>`;
            }
          });
        }
      });
    });
  } else {
    console.log('displayNone');
    chattingRoomContainer.style.display = 'none';
  }
  console.log(userRoomMessage);
};
