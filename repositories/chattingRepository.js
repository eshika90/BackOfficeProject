const { ChattingRooms, Room_User, Users, Messages } = require("../models");

class ChattingRepository {
    //채팅방 생성
    makeChattingRoom = async (roomInfoObject) => {
        return await ChattingRooms.create(roomInfoObject);
    };

    //채팅방 유저추가
    addUserToRoom = async (roomUserInfoArr, options) => {
        return await Room_User.bulkCreate(roomUserInfoArr, options);
    };

    //특정 유저가 속한 채팅방목록을 가져옴과 동시에 해당 채팅방에 속한 유저의 정보를 가져옴
    getRoomsAndUsers = async (userId) => {
        return await Users.findOne({
            where: {
                id: userId,
            },
            attributes: ["id"],
            include: {
                model: ChattingRooms,
                through: { model: Room_User, attributes: [] },
                include: [
                    {
                        model: Users,
                        attributes: ["id", "name"],
                        through: { model: Room_User, attributes: [] },
                    },
                    {
                        model: Messages,
                        as: "ChattingMessages",
                        attributes: ["userId", "message", "createdAt"],
                        order: [["createdAt", "ASC"]],
                        separate: true,
                    },
                ],
            },
        });
    };

    storeMessage = async (messageInfo, options) => {
        return await Messages.create(messageInfo, options);
    };

    //특정 채팅방에 속한 메세지를 가져옴
    getChattingMessage = async (messageOptions) => {
        return await Messages.findAll(messageOptions);
    };

    //채팅방 탈퇴
    exitChattingRoom = async (options) => {
        return await Room_User.destroy(options);
    };
}

module.exports = ChattingRepository;
