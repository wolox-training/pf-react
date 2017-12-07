const orm = require('./../orm'),
  errors = require('../errors');

exports.createUser = user => {
  return orm.models.user.create(user).catch(error => {
    throw errors.savingDBError(error.errors[0].message);
  });
};

exports.getByEmail = emailSearch => {
  const whereClause = {
    where: {
      email: emailSearch
    }
  };

  return orm.models.user.findOne(whereClause).catch(error => {
    throw errors.databaseError(error.message);
  });
};
