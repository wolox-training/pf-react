const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('users', () => {
  describe('/users POST', () => {
    it('should be success', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'persona5',
          lastName: 'apellido5',
          password: 'falabella2017',
          email: 'email5@wolox.com'
        })
        .then(res => {
          res.should.have.status(200);
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because email exist', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'persona6',
          lastName: 'apellido6',
          password: 'falabella2017',
          email: 'email5@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
        })
        .then(() => done());
    });
    it('should fail because password requirements', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'persona7',
          lastName: 'apellido7',
          password: 'fala1',
          email: 'email7@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
        })
        .then(() => done());
    });
    it('should fail because required parameters are missing', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'persona8',
          password: 'falabella2017',
          email: 'email8@wolox.com'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
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
