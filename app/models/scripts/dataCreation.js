const bcrypt = require('bcrypt'),
  sessionManager = require('../../services/sessionManager');

exports.execute = db => {
  return bcrypt
    .hash('falabella2017', 10)
    .then(hash => {
      const inserts = [];

      inserts.push(
        db.models.user.create({
          firstName: 'persona1',
          lastName: 'apellido1',
          email: 'email1@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: 'persona2',
          lastName: 'apellido2',
          email: 'email2@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: 'persona3',
          lastName: 'apellido3',
          email: 'email3@wolox.com',
          password: hash,
          isAdministrator: false
        })
      );

      inserts.push(
        db.models.user.create({
          firstName: 'persona4',
          lastName: 'apellido4',
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
