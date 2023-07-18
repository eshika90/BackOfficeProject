'use strict';
const { Model } = require('sequelize');
const reservations = require('./reservations');
module.exports = (sequelize, DataTypes) => {
  class PetSitterInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Users, {
        through: 'Reservations',
        foreignKey: 'petSitterId',
        otherKey: 'userId',
      });
      this.hasMany(models.Reviews, {
        sourceKey: 'id',
        foreignKey: 'reviewId',
      });
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'userId',
      });
    }
  }
  PetSitterInfos.init(
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
      homeType: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      summaryTitle: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      summary: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      introduction: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      career: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'PetSitterInfos',
    },
  );
  return PetSitterInfos;
};
