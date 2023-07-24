// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('LEVEL4_PROJECT', 'root', '4321aaaa', {
//   host: 'express-database.c6fzjazd8zwu.ap-northeast-2.rds.amazonaws.com',
//   dialect: 'mysql',
// });

// const { Room_Users, Users, Messages, ChattingRooms } = require('./models');
// const getRoomsAndUsers = async (userId) => {
// //   return await Users.findOne({
// //     where: {
// //       id: userId,
// //     },
// //     attributes: ['id', 'name'],
// //     include: {
// //       model: ChattingRooms,
// //       through: { model: Room_Users, attributes: [] },
// //       include: [
// //         {
// //           model: Users,
// //           attributes: ['id', 'name'],
// //           through: { model: Room_Users, attributes: [] },
// //         },
// //         {
// //           model: Messages,
// //           as: 'ChattingMessages',
// //           attributes: ['userId', 'message', 'createdAt'],
// //           order: [['createdAt', 'ASC']],
// //           separate: true,
// //         },
// //       ],
// //     },
// //   });
//   const getRoomInfo=await ChattingRooms.findOne({
//     where: { id: 22 },
//       attributes: ['id', 'password', 'name','createdAt','updatedAt'],
//       include: {
//         model: Users,
//         attributes: ['id', 'name'],
//         through: {
//           model: Room_Users,
//           attributes: [],
//         },
//         raw: true,
//       },

//     });
//     const createdAt = new Date().toJSON();
//     const chattingRoomInfo = getRoomInfo.toJSON()

//     chattingRoomInfo.ChattingMessages = [{ userId:1,message: 'message', createdAt }];
//     console.log(chattingRoomInfo)

//     // const chattingRoomInfo=getRoomInfo[0]
//     // chattingRoomInfo.ChattingMessages = [{userId:1,message:"a",createdAt}]
//     // const rooms = {}
//     // let users = {};
//     // getRoomInfo.Users.forEach((userInfo) => {
//     //   users[userInfo.id] = userInfo.name;
//     // });
//     // rooms[getRoomInfo.id] = {
//     //   password: getRoomInfo.password,
//     //   name: getRoomInfo.name,
//     //   users
//     // };
//     // return chattingRoomInfo
// };

// (async () => {
//   try {
//     await sequelize.authenticate(); // DB 연결 테스트
//     console.log('Database connected!');

//     // mock userId

//     // 모델들의 관계 설정 확인
//     const roomsAndUsers = await getRoomsAndUsers(1);
//     // console.log(JSON.stringify(roomsAndUsers, null, 2));

//     // 연결 종료
//     await sequelize.close();
//     console.log('Database connection closed!');
//   } catch (err) {
//     console.error(err);
//   }
// })();

const qqq = {
  24: {
    password: 'a',
    name: 'room',
    users: { 1: '장봉준', 2: '장봉준네이버버' },
  },
};
delete qqq[String(24)].users[String(1)];

console.log(qqq);
