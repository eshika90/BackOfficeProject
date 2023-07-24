'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChattingRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChattingRooms.hasMany(models.Messages, {
        sourceKey: 'id',
        foreignKey: 'roomId',
        as: 'ChattingMessages',
      });
      ChattingRooms.hasMany(models.Room_Users, {
        sourceKey: 'id',
        foreignKey: 'roomId',
        as: 'RoomUsers',
      });
      ChattingRooms.belongsToMany(models.Users, {
        through: 'Messages',
        foreignKey: 'roomId',
        otherKey: 'userId',
      });
      ChattingRooms.belongsToMany(models.Users, {
        through: 'Room_Users',
        foreignKey: 'roomId',
        otherKey: 'userId',
      });
    }
  }
  ChattingRooms.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
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
      modelName: 'ChattingRooms',
    },
  );
  return ChattingRooms;
};
