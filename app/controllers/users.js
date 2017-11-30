'use strict';

const bcrypt = require('bcrypt'),
  errors = require('../errors'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager');

exports.signup = (request, response, next) => {
  const saltRounds = 10;
  const regexValidEmail = /^[A-Za-z0-9._%+-]+@wolox.com$/;
  const regexAlphanumericPass = /^[a-z0-9]+$/i;

  const newUser = request.body
    ? {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        is_administrator: false
      }
    : {};

  if (newUser.password.length < 8 && !regexAlphanumericPass.test(newUser.password)) {
    return next(errors.defaultError('the password must be 8 characters long and alphanumeric'));
  }

  if (!regexValidEmail.test(newUser.email)) {
    return next(errors.defaultError('it must be a valid wolox.com email'));
  }

  bcrypt.hash(newUser.password, saltRounds).then(hash => {
    newUser.password = hash;
    userService
      .createUser(newUser)
      .then(u => {
        response.status(200);
        response.send();
      })
      .catch(err => {
        next(err);
      });
  });
};

exports.signin = (request, response, next) => {
  const regexValidEmail = /^[A-Za-z0-9._%+-]+@wolox.com$/;

  const userLogin = request.body
    ? {
        email: request.body.email,
        password: request.body.password
      }
    : {};

  if (!request.body.email || !request.body.password) {
    return next(errors.defaultError('email and password are required'));
  }

  if (!regexValidEmail.test(userLogin.email)) {
    return next(errors.defaultError('it must be a valid wolox.com email'));
  }

  userService
    .getByEmail(userLogin.email)
    .then(user => {
      if (user != null) {
        bcrypt.compare(userLogin.password, user.password).then(valid => {
          if (valid) {
            sessionManager.generateAccessToken(user.id).then(accessToken => {
              userService
                .updateByUserId({ auth_code_validation: accessToken.authCode }, user.id)
                .then(success => {
                  response.status(200);
                  response.send({
                    accessToken: accessToken.accessToken,
                    refreshToken: accessToken.refreshToken
                  });
                });
            });
          } else {
            next(errors.invalidUser());
          }
        });
      } else {
        next(errors.invalidUser());
      }
    })
    .catch(err => {
      next(err);
    });
};

exports.listUsers = (request, response, next) => {
  const userLogged = request.user;
  if (userLogged) {
    const limit = request.query.limit ? parseInt(request.query.limit) : 10;
    const offset = request.query.offset ? parseInt(request.query.offset) : 0;

    userService.getAllUsersPaginate(limit, offset).then(users => {
      if (users != null) {
        userService.countAllUsers().then(count => {
          const usersFiltered = users.map(user => {
            return {
              id: user.id,
              firsName: user.firsName,
              lastName: user.lastName,
              email: user.email,
              isAdministrator: user.isAdministrator,
              created_at: user.created_at,
              updated_at: user.updated_at
            };
          });
          response.status(200);
          response.send({
            paging: {
              total: count,
              limit,
              offset
            },
            users: usersFiltered
          });
        });
      } else {
        return next(errors.defaultError('Error to trying to find all users'));
      }
    });
  } else {
    response.status(401);
    response.send();
  }
};

exports.signupAdministrator = (request, response, next) => {
  const userLogged = request.user;
  if (userLogged && userLogged.is_administrator) {
    const saltRounds = 10;
    const regexValidEmail = /^[A-Za-z0-9._%+-]+@wolox.com$/;
    const regexAlphanumericPass = /^[a-z0-9]+$/i;

    const newUser = request.body
      ? {
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          email: request.body.email,
          password: request.body.password,
          is_administrator: true
        }
      : {};

    if (newUser.password.length < 8 && !regexAlphanumericPass.test(newUser.password)) {
      return next(errors.defaultError('La password debe ser alfanumerica y de 8 caracteres'));
    }

    if (!regexValidEmail.test(newUser.email)) {
      return next(errors.defaultError('Debe ser un correo valido de wolox.com'));
    }

    bcrypt.hash(newUser.password, saltRounds).then(hash => {
      newUser.password = hash;
      userService
        .getByEmail(newUser.email)
        .then(user => {
          if (user != null) {
            user.isAdministrator = true;
            user.save();
            response.status(200);
            response.send();
          } else {
            userService
              .createUser(newUser)
              .then(u => {
                response.status(200);
                response.send();
              })
              .catch(err => {
                next(err);
              });
          }
        })
        .catch(err => {
          next(err);
        });
    });
  } else {
    response.status(401);
    response.send();
  }
};

exports.invalidateAllSessions = (request, response, next) => {
  const userLogged = request.user;
  if (userLogged) {
    userLogged.auth_code_validation = null;
    userLogged.save();
    response.status(200);
    response.send();
  } else {
    response.status(401);
    response.send();
  }
};

exports.renewSession = (request, response, next) => {
  const userLogged = request.user;
  const accessToken = request.accessToken;
  if (userLogged) {
    sessionManager.generateAccessToken(userLogged.id).then(newAccessToken => {
      userLogged.auth_code_validation = newAccessToken.authCode;
      userLogged.save().then(success => {
        response.status(200);
        response.send({
          accessToken: newAccessToken.accessToken,
          refreshToken: newAccessToken.refreshToken
        });
      });
    });
  } else {
    response.status(401);
    response.send();
  }
};
