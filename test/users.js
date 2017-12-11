const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('../app/services/sessionManager'),
  utils = require('./utils'),
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
          email: 'email5@wolox.com',
          isAdmnistrator: false
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
