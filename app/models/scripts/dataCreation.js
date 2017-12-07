const bcrypt = require('bcrypt'),
  faker = require('faker');

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
          password: hash
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email2@wolox.com',
          password: hash
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email3@wolox.com',
          password: hash
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: 'email4@wolox.com',
          password: hash
        })
      );

      return Promise.all(inserts);
    })
    .catch(error => {
      throw error;
    });
};
