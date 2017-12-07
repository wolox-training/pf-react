const orm = require('./../orm'),
  errors = require('../errors');

exports.createGame = game => {
  return orm.models.game.create(game).catch(error => {
    throw errors.savingError(error.message);
  });
};

exports.getAllGamesPaginate = (limit, offset) => {
  return orm.models.game.findAll({ offset, limit }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.countAllGames = () => {
  return orm.models.game.count().catch(error => {
    throw errors.databaseError(error.message);
  });
};
