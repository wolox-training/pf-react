const users = require('./controllers/users'),
  auth = require('./middlewares/authentication');

exports.init = app => {
  app.post('/users', [], users.signup);
  app.post('/users/sessions', [], users.signin);
  app.get('/users', [auth.authentication], users.listUsers);
  app.post('/admin/users', [auth.authentication], users.signupAdministrator);
  app.post('/users/sessions/invalidateAll', [auth.authentication], users.invalidateAllSessions);
  app.post('/users/sessions/renew', [auth.authentication], users.renewSession);
};
