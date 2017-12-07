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
        password: request.body.password
      }
    : {};

  if (newUser.password.length < 8 || !regexAlphanumericPass.test(newUser.password)) {
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
        response.send(u);
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
      if (!user) return next(errors.invalidUser());

      bcrypt.compare(userLogin.password, user.password).then(valid => {
        if (!valid) return next(errors.invalidUser());

        const NewSession = {
          accessToken: sessionManager.generateAccessToken
        };
        response.status(200);
        response.send(NewSession);
      });
    })
    .catch(err => {
      next(err);
    });
};
