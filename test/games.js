const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  sessionManager = require('../app/services/sessionManager'),
  utils = require('./utils'),
  should = chai.should();

describe('games', () => {
  describe('/games POST', () => {
    it('should be success', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .send({
            codeGame: 'wolox-test-001',
            name: 'wolox-test',
            score: 100
          })
          .then(res => {
            res.should.have.status(200);
            dictum.chai(res);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/games GET', () => {
    it('should be success', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/games')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            dictum.chai(res);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/games')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/games/:game_id/match POST', () => {
    it('should be success', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games/1/match')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .send({
            hits: 50
          })
          .then(res => {
            res.should.have.status(200);
            dictum.chai(res);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games/1/match')
          .send({
            hits: 50
          })
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
    it('should fail because hits is not send', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games/1/match')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
    });
    it('should fail because game id is wrong', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .post('/games/uno/match')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .catch(err => {
            err.should.have.status(400);
            done();
          });
      });
    });
  });

  describe('/games/:game_id/match GET', () => {
    it('should be success', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/games/1/match')
          .set(sessionManager.HEADER_NAME_FIELD_TOKEN, loginResponse.body.accessToken)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            dictum.chai(res);
          })
          .then(() => done());
      });
    });
    it('should fail because header with access token is not sent', done => {
      utils.login((loginError, loginResponse) => {
        chai
          .request(server)
          .get('/games/1/match')
          .catch(err => {
            err.should.have.status(401);
            done();
          });
      });
    });
  });
});
