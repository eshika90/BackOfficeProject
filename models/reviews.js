'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Users 1:N 관계
      this.belongsTo(models.Users, {
        targetKey: 'id',
        foreignKey: 'userId',
      });

      // PetSitterInfos 1:N 관계
      this.belongsTo(models.PetSitterInfos, {
        targetKey: 'id',
        foreignKey: 'petSitterId',
      });

      // Reservations 1:1 관계
      this.belongsTo(models.Reservations, {
        targetKey: 'id',
        foreignKey: 'reservationId',
      });
    }
  }
  Reviews.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      reservationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: 'Reservations',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      rating: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      comment: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: tru,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Reviews',
    },
  );
  return Reviews;
};
