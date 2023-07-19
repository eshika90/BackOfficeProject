'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Datatypes) => {
  class Users extends Model {
    static associate(models) {
      this.hasMany(models.Reviews, {
        sourceKey: 'id',
        foreignKey: 'userId',
      });
      this.hasMany(models.PetSitterInfos,{
        sourceKey:'id',
        foreignKey:'userId'
      })
      this.belongsToMany(models.PetSitterInfos, {
        through: 'Reservations',
        foreignKey: 'userId',
        otherKey: 'petSitterId',
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
