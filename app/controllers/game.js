'use strict';

const bcrypt = require('bcrypt'),
  errors = require('../errors'),
  sessionManager = require('../services/sessionManager'),
  gameService = require('../services/games'),
  matchGameService = require('../services/matchGame');

exports.createGame = (request, response, next) => {
  const userLogged = request.user;

  if (userLogged && userLogged.is_administrator) {
    const newGame = request.body
      ? {
          codeGame: request.body.codeGame,
          name: request.body.name,
          score: request.body.score
        }
      : {};

    gameService
      .createGame(newGame)
      .then(u => {
        response.status(200);
        response.end();
      })
      .catch(err => {
        next(err);
      });
  } else {
    response.status(401);
    response.end();
  }
};

exports.listGames = (request, response, next) => {
  const userLogged = request.user;

  const limit = request.query.limit ? parseInt(request.query.limit) : 10;
  const offset = request.query.offset ? parseInt(request.query.offset) : 0;

  gameService.getAllGamesPaginate(limit, offset).then(games => {
    if (games != null) {
      gameService.countAllGames().then(count => {
        const gamesFiltered = games.map(game => {
          return {
            id: game.id,
            codeGame: game.codeGame,
            name: game.name,
            score: game.score,
            created_at: game.created_at,
            updated_at: game.updated_at
          };
        });

        response.status(200);
        response.send({
          paging: {
            total: count,
            limit,
            offset
          },
          games: gamesFiltered
        });
      });
    } else {
      return next(errors.defaultError('Error to trying to find all games'));
    }
  });
};

exports.matchGame = (request, response, next) => {
  const userLogged = request.user;

  if (!request.params.game_id && !Number.isInteger(request.params.game_id)) {
    return next(errors.defaultError('you must enter the game id'));
  }

  if (!request.body.hits) {
    return next(errors.defaultError('you must enter the game hits'));
  }

  const newMatchGame = {
    userId: userLogged.id,
    gameId: request.params.game_id,
    hits: request.body.hits
  };

  matchGameService
    .createMatch(newMatchGame)
    .then(u => {
      response.status(200);
      response.end();
    })
    .catch(err => {
      next(err);
    });
};

exports.listMatchGames = (request, response, next) => {
  const userLogged = request.user;

  if (!request.params.game_id) {
    return next(errors.defaultError('you must enter the game id'));
  }

  const limit = request.query.limit ? parseInt(request.query.limit) : 10;
  const offset = request.query.offset ? parseInt(request.query.offset) : 0;
  const gameId = request.params.game_id;

  matchGameService.getAllMatchGamesPaginateByGameId(limit, offset, gameId).then(match => {
    if (match != null) {
      matchGameService.countAllMatchGames().then(count => {
        const matchFiltered = match.map(matchMap => {
          return {
            id: matchMap.id,
            userId: matchMap.userId,
            hits: matchMap.hits,
            created_at: matchMap.created_at,
            updated_at: matchMap.updated_at
          };
        });

        response.status(200);
        response.send({
          paging: {
            total: count,
            limit,
            offset
          },
          match: matchFiltered
        });
      });
    } else {
      return next(errors.defaultError('Error to trying to find all match of the game'));
    }
  });
};
