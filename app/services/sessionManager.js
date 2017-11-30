const jwt = require('jwt-simple'),
  config = require('../../config'),
  bcrypt = require('bcrypt'),
  errors = require('../errors'),
  moment = require('moment');

const SECREY_KEY_TOKEN = config.common.session.secret;
const EXPIRATION_DATE = 2;
const SALT_ROUNDS = 10;

const expirationDate = () => {
  return moment().add(EXPIRATION_DATE, 'days');
};

exports.HEADER_NAME_FIELD_TOKEN = config.common.session.header_name;

exports.encode = textToEncode => {
  return jwt.encode(textToEncode, SECREY_KEY_TOKEN);
};

exports.decode = textToDecode => {
  return jwt.decode(textToDecode, SECREY_KEY_TOKEN);
};

exports.generateAccessToken = userIdToEncode => {
  const authCodeValidation = exports.generateAuthCodeValidation();

  const accessTokenEncoded = exports.encode({
    expirationDate: expirationDate(),
    userId: userIdToEncode,
    authCode: authCodeValidation
  });

  return bcrypt.genSalt(SALT_ROUNDS).then(saltGenerated => {
    return {
      accessToken: accessTokenEncoded,
      authCode: authCodeValidation
    };
  });
};

exports.generateAuthCodeValidation = () => {
  const randomNumber = Math.random() * (1 - 9999) + 9999;
  return exports.encode(randomNumber);
};
