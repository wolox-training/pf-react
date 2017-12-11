const bcrypt = require('bcrypt'),
  errors = require('../errors'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  moment = require('moment');

exports.authentication = (request, response, next) => {
  const accessTokenEncrypted = request.headers[sessionManager.HEADER_NAME_FIELD_TOKEN];
  if (accessTokenEncrypted) {
    const accessToken = sessionManager.decode(accessTokenEncrypted);
    userService
      .getById(accessToken.userId)
      .then(user => {
        if (user) {
          if (
            moment().isBefore(accessToken.expirationDate) &&
            accessToken.authCode === user.auth_code_validation
          ) {
            request.user = user;
            request.accessToken = accessTokenEncrypted;
          } else {
            response.status(401);
          }
          next();
        } else {
          response.sendStatus(401);
        }
      })
      .catch(error => {
        response.sendStatus(401);
      });
  } else {
    response.sendStatus(401);
  }
};
