module.exports = (code) => {

  const gameCode = code,
  players = {};

  let round = 1;

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

  };

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    addPlayer: addPlayer

  };

};
