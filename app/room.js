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

  },
  getStatus = () => {

    return status;

  },
  getWords = () => {

    return words;

  };

  const addPlayer = (name, client) => {

    for(p in players) {

      players[p].client.emit('playerJoin', name, client.id);

    }

    players[client.id] = {name: name, client: client, points: 0};

  },
  addWord = (word) => {

    if(words.includes(word.toLowerCase()))
      return;

    words.push(word.toLowerCase());

    for(p in players) {

      players[p].client.emit('wordAdded', words.length);

    }

  },
  removePlayer = (client) => {

    for(p in players) {

      players[p].client.emit('playerLeave', players[client.id].name, client.id);

    }

    delete players[client.id];

  },
  startGame = () => {

    if(Object.keys(players).length != config.min_players || status != 'waiting') {

      sendAnnouncement(`Could not start game, not enough players (minimum ${config.min_players})`);
      return;

    }

    if(words.length < config.min_words) {

      sendAnnouncement(`Could not start game, not enough words (minimum ${config.min_words})`);
      return;

    }

    status = 'running';
    for(p in players) {

      players[p].client.emit('startGame');
      players[p].client.emit('statusChange', status);

    }

  },
  sendMessage = (client, message) => {

    if(message == null || message == '')
      return;

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
    getStatus: getStatus,
    getWords: getWords,
    addPlayer: addPlayer,
    addWord: addWord,
    removePlayer: removePlayer,
    sendMessage: sendMessage,
    startGame: startGame

  };

};
