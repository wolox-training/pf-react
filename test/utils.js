const chai = require('chai'),
  server = require('../app');

exports.login = callback => {
  chai
    .request(server)
    .post('/users/sessions')
    .send({
      email: 'admin@wolox.com',
      password: 'falabella2017'
    })
    .end((error, respose) => {
      if (callback) {
        callback(error, respose);
      }
    });
};
