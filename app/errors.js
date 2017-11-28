exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.defaultError = message => {
  return {
    statusCode: 400,
    message
  };
};

exports.savingDBError = message => {
  return {
    statusCode: 400,
    message
  };
};

exports.databaseError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.invalidUser = () => {
  return {
    statusCode: 500,
    message: 'Invalid user or password'
  };
};
