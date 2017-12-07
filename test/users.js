const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  faker = require('faker'),
  should = chai.should();

faker.locale = 'es_MX';

describe('users', () => {
  describe('/users POST', () => {
    it('should be success', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: 'falabella2017',
          email: 'email5@wolox.com'
        })
        .then(res => {
          res.should.be.json;
          res.should.have.status(200);
          res.body.should.have.property('id').not.be.equal(0);
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('password');
          res.body.should.have.property('email');
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because email exist', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: 'falabella2017',
          email: 'email1@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error').equal('email must be unique');
        })
        .then(res => done());
    });
    it('should fail because password requirements', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: 'fala1',
          email: 'email7@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have
            .property('error')
            .equal('the password must be 8 characters long and alphanumeric');
        })
        .then(() => done());
    });
    it('should fail because required parameters are missing', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: faker.name.firstName(),
          password: 'falabella2017',
          email: 'email8@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error').equal('lastName cannot be null');
        })
        .then(() => done());
    });
  });

  describe('/users/sessions POST', () => {
    it('should be success', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'email1@wolox.com',
          password: 'falabella2017'
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because required parameters are missing', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'email1@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
        })
        .then(() => done());
    });
  });
});
