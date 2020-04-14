const config = require('../config.json');

module.exports = (code) => {

  const gameCode = code,
  players = {};

  let round = 1,
  currentDrawer = null,
  status = 'waiting';

  const getGameCode = () => {

    return gameCode;

  },
  getPlayers = () => {

    return players;

  },
  getRound = () => {

    return round;

  };

  const addPlayer = (name, clientid) => {

    players[clientid] = name;

    if(Object.keys(players).length == config.min_players)
      startGame();

  },
  startGame = () => {

    status = 'running';

  };

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    addPlayer: addPlayer

  };

};
