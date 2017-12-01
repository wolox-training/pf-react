const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('../app/services/sessionManager'),
  should = chai.should();

const login = callback => {
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

describe('games', () => {
  describe('/games POST', () => {
    it('should be success', done => {
      login((loginError, loginResponse) => {
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
  });

  describe('/games GET', () => {
    it('should be success', done => {
      login((loginError, loginResponse) => {
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
  });

  describe('/games/:game_id/match POST', () => {
    it('should be success', done => {
      login((loginError, loginResponse) => {
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
  });

  describe('/games/:game_id/match GET', () => {
    it('should be success', done => {
      login((loginError, loginResponse) => {
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
  });
});
