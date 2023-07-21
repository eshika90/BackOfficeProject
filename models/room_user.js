"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Room_User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Room_User.belongsTo(models.Users,{
                targetKey:'id',
                foreignKey:'userId'
            })
            Room_User.belongsTo(models.ChattingRooms,{
                targetKey:'id',
                foreignKey:'roomId'
            })
        }
    }
    Room_User.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "CASCADE",
                validate:{
                    isNumeric:{msg:'잘못된 userId 형식입니다'}
                }
            },
            roomId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: "ChattingRooms",
                    key: "id",
                },
                onDelete: "CASCADE",
                validate:{
                    isNumeric:{msg:'잘못된 roomId 형식입니다'}
                }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Room_User",
        }
    );
    return Room_User;
};
