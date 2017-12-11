const users = require('./controllers/users'),
  auth = require('./middlewares/authentication'),
  game = require('./controllers/game');

exports.init = app => {
  app.post('/users', [], users.signup);
  app.post('/users/sessions', [], users.signin);
  app.get('/users', [auth.authentication], users.listUsers);
  app.post('/admin/users', [auth.authentication], users.signupAdministrator);
  app.post('/users/sessions/invalidateAll', [auth.authentication], users.invalidateAllSessions);
  app.post('/users/sessions/renew', [auth.authentication], users.renewSession);

  app.post('/games', [auth.authentication], game.createGame);
  app.get('/games', [auth.authentication], game.listGames);
  app.post('/games/:game_id/match', [auth.authentication], game.matchGame);
  app.get('/games/:game_id/match', [auth.authentication], game.listMatchGames);
};
