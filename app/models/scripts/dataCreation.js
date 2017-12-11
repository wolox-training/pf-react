const bcrypt = require('bcrypt'),
  faker = require('faker'),
  sessionManager = require('../../services/sessionManager');

faker.locale = 'es_MX';

exports.execute = db => {
  return bcrypt
    .hash('falabella2017', 10)
    .then(hash => {
      const inserts = [];

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email1@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email2@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email3@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email4@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: 'administrator',
          lastName: 'administrator',
          email: 'admin@wolox.com',
          password: hash,
          isAdministrator: true,
          authCodeValidation: sessionManager.generateAuthCodeValidation()
        })
      );
      return Promise.all(inserts);
    })
    .catch(error => {
      throw error;
    });
};
