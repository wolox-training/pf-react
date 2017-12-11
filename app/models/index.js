const user = require('./user'),
  game = require('./game'),
  mathGame = require('./matchGame');

exports.define = db => {
  user.getModel(db);
  game.getModel(db);
  mathGame.getModel(db);
};
