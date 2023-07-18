'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservations.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'userId',
      });
      Reservations.belongsTo(models.PetSitterInfos, {
        targetKey: 'id',
        foreignKey: 'petSitterId',
      });
      Reservations.hasOne(models.Reviews, {
        sourceKey: 'id',
        foreignKey: 'reservationId',
      });
    }
  }
  Reservations.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      petSitterId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'PetSitterInfos',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      petType: {
        type: DataTypes.STRING,
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      totalPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Reservations',
    },
  );
  return Reservations;
};
