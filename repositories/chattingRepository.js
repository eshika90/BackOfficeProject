const { ChattingRooms, Room_Users, Users, Messages } = require("../models");

class ChattingRepository {
    //채팅방 생성
    makeChattingRoom = async (roomInfoObject,options) => {
        return await ChattingRooms.create(roomInfoObject,options);
    };
    //채팅방 유저추가
    addManyUserToRoom = async (roomUserInfoArr, options) => {
        return await Room_Users.bulkCreate(roomUserInfoArr, options);
    };
    addOneUserToRoom = async (roomUserInfo,options)=>{
        return await Room_Users.create(roomUserInfo,options);
    }
    getChattingRoom = async(roomOptions)=>{
        return await ChattingRooms.findOne(roomOptions);
    }

    //특정 유저가 속한 채팅방목록을 가져옴과 동시에 해당 채팅방에 속한 유저의 정보를 가져옴
    getRoomsAndUsers = async (userId) => {
        return await Users.findOne({
            where: {
                id: userId,
            },
            attributes: ["id","name"],
            include: {
                model: ChattingRooms,
                through: { model: Room_Users, attributes: [] },
                include: [
                    {
                        model: Users,
                        attributes: ["id", "name"],
                        through: { model: Room_Users, attributes: [] },
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
        return await Room_Users.destroy(options);
    };
}

module.exports = ChattingRepository;
