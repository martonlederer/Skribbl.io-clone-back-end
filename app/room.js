const config = require('../config.json');

module.exports = (code) => {

  const gameCode = code,
  players = {},
  words = [];

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

  const addPlayer = (name, client) => {

    for(p in players) {

      players[p].client.emit('playerJoin', name);

    }

    players[client.id] = {name: name, client: client};

    if(Object.keys(players).length == config.min_players && status == 'waiting')
      startGame();

  },
  removePlayer = (client) => {

    for(p in players) {

      players[p].client.emit('playerLeave', players[client.id].name);

    }

    delete players[client.id];

  },
  startGame = () => {

    status = 'running';
    for(p in players) {

      players[p].client.emit('startGame');

    }

  },
  sendMessage = (client, message) => {

    for(p in players) {

      players[p].client.emit('messageReceive', players[client.id].name, message);

    }

  };

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    addPlayer: addPlayer,
    sendMessage: sendMessage

  };

};
