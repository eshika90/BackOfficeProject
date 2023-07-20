'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Datatypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Reviews, {
        sourceKey: 'id',
        foreignKey: 'userId',
      });
      Users.hasMany(models.PetSitterInfos, {
        sourceKey: 'id',
        foreignKey: 'userId',
      });
      Users.belongsToMany(models.PetSitterInfos, {
        through: 'Reservations',
        foreignKey: 'userId',
        otherKey: 'petSitterId',
      });
      Users.hasMany(models.Messages, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'UserMessages',
      });
      Users.hasMany(models.Room_User, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'RoomUsers',
      });
      Users.belongsToMany(models.ChattingRooms, {
        through: 'Messages',
        foreignKey: 'userId',
        otherKey: 'roomId',
      });
      Users.belongsToMany(models.ChattingRooms, {
        through: 'Room_User',
        foreignKey: 'userId',
        otherKey: 'roomId',
      });
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Datatypes.INTEGER,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Datatypes.STRING,
      },
      name: {
        allowNull: false,
        type: Datatypes.STRING,
      },
      password: {
        allowNull: false,
        type: Datatypes.STRING,
      },
      isPetSitter: {
        type: Datatypes.BOOLEAN,
        defaultValue: false,
      },
      refreshToken: {
        allowNull: true,
        type: Datatypes.STRING,
      },
      profileImage: {
        allowNull: true,
        type: Datatypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Datatypes.DATE,
        defaultValue: Datatypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: Datatypes.DATE,
        defaultValue: Datatypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Users',
    },
  );
  return Users;
};
