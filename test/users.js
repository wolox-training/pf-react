const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  faker = require('faker'),
  sessionManager = require('../app/services/sessionManager'),
  utils = require('./utils'),
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
          email: 'email5@wolox.com',
          isAdmnistrator: false
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
    it('should be success', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'email1@wolox.com',
          password: 'falabella2017'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
  });

  describe('/users/sessions/renew POST', () => {
    it('should be success renew session', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/users/sessions/renew')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .then(response => {
            response.should.have.status(200);
            response.should.be.json;
            done();
          });
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/users/sessions/renew')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/users/sessions/invalidateAll POST', () => {
    it('should be success invalidation', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/users/sessions/invalidateAll')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .then(response => {
            response.should.have.status(200);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/users/sessions/invalidateAll')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/users GET', () => {
    it('should be successful', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/users')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .then(response => {
            response.should.have.status(200);
            response.should.be.json;
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/users')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/admin/users POST', () => {
    it('should be successful', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .send({
            firstName: 'personaAdmin',
            lastName: 'admin',
            password: 'falabella2017',
            email: 'admin2@wolox.com',
            isAdmnistrator: true
          })
          .then(response => {
            response.should.have.status(200);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/admin/users')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
});
