const Sequelize = require('sequelize');

exports.getModel = db => {
  return db.define(
    'user',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      authCodeValidation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isAdministrator: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      underscored: true
    }
  );
};
