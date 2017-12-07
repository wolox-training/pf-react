const jwt = require('jwt-simple'),
  config = require('../../config'),
  bcrypt = require('bcrypt'),
  errors = require('../errors'),
  moment = require('moment');

const SECREY_KEY_TOKEN = config.common.session.secret;
const EXPIRATION_DATE = 2;

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
  const tokenToEncode = {
    expirationDate: expirationDate(),
    userId: userIdToEncode
  };

  return exports.encode(tokenToEncode);
};
