const orm = require('./../orm'),
  errors = require('../errors');

exports.createMatch = match => {
  return orm.models.matchGame.create(match).catch(error => {
    throw errors.savingError(error.message);
  });
};

exports.getAllMatchGamesPaginateByGameId = (limit, offset, gameId) => {
  return orm.models.matchGame.findAll({ offset, limit, where: { gameId } }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.countAllMatchGames = () => {
  return orm.models.matchGame.count().catch(error => {
    throw errors.databaseError(error.message);
  });
};
