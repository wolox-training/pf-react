const orm = require('./../orm'),
  errors = require('../errors');

exports.createUser = user => {
  return orm.models.user.create(user).catch(error => {
    throw errors.savingDBError(error.errors[0].message);
  });
};

exports.getOne = user => {
  return orm.models.user.findOne({ where: user }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getByEmail = email => {
  return exports.getOne({ email });
};

exports.getById = idUser => {
  return orm.models.user.findById(idUser).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.getAllUsersPaginate = (limit, offset) => {
  return orm.models.user.findAll({ offset, limit }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.countAllUsers = () => {
  return orm.models.user.count().catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.updateByUserId = (fields, userId) => {
  return orm.models.user.update(fields, { where: { id: userId } }).catch(error => {
    throw errors.savingError(error.message);
  });
};
