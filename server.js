const http = require('./app');
require('./socket.js');

http.listen(3000, () => {
  console.log('서버가 정상적으로 열렸습니다');
});
