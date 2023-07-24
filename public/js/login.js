const emailVerify = async () => {
  const email = document.getElementById('email').value;
  const response = await fetch('http://localhost:3000/api/users/verifyemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const responseJson = await response.json();
  const responseMessage = responseJson.message;
};
const mailCodeVerify = async () => {
  const email = document.getElementById('email').value;
  const code = document.getElementById('code').value;
  const response = await fetch(
    'http://localhost:3000/api/users/verifyemailcode',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    },
  );
  const responseJson = await response.json();
  const responseMessage = responseJson.message;
};
const login = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const status = response.status;
  let messages;
  if (status === 200) {
    messages = readyToChatting();
  }
  return messages;
};

const sendMessageToUser = () => {
  const userId = document.getElementById('userId').value;
  const message = document.getElementById('message').value;
  sendMessage(userId, message);
};

const exitChattingRoomEvent = (roomId) => {
  exitChattingRoom(roomId);
};

document
  .getElementById('exitChattingRoom')
  .addEventListener('click', exitChattingRoomEvent);

document
  .getElementById('messageButton')
  .addEventListener('click', sendMessageToUser);
document.getElementById('login').addEventListener('click', login);
