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

  },
  removePlayer = (client) => {

    for(p in players) {

      players[p].client.emit('playerLeave', players[client.id].name);

    }

    delete players[client.id];

  },
  startGame = () => {

    if(Object.keys(players).length != config.min_players || status != 'waiting')
      sendAnnouncement('Could not start game, not enough players');

    status = 'running';
    for(p in players) {

      players[p].client.emit('startGame');

    }

  },
  sendMessage = (client, message) => {

    for(p in players) {

      players[p].client.emit('messageReceive', players[client.id].name, message);

    }

  },
  sendAnnouncement = (announcement) => {

    players[p].client.emit('messageReceive', 'Announcement', announcement);

  };

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    addPlayer: addPlayer,
    removePlayer: removePlayer,
    sendMessage: sendMessage,
    startGame: startGame

  };

};
