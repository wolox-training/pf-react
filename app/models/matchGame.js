const Sequelize = require('sequelize');

exports.getModel = db => {
  return db.define(
    'matchGame',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hits: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      underscored: true
    }
  );
};
