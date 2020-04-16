const config = require('../config.json');

module.exports = (code) => {

  const gameCode = code,
  players = {},
  words = [];

  let round = 1,
  currentDrawer = null,
  currentWord = null,
  playersOrder = [],
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
    playersOrder.push(client.id);

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
  shufflePlayers = () => {

    let currentIndex = playersOrder.length,
    temporaryValue = null,
    randomIndex = null;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = playersOrder[currentIndex];
      playersOrder[currentIndex] = playersOrder[randomIndex];
      playersOrder[randomIndex] = temporaryValue;

    }

  },
  startDrawing = (callback) => {

    players[currentPlayer].client.emit('drawWord', currentWord);
    sendAnnouncement(`${players[currentPlayer].name} is drawing!`);

    setTimeout(() => {

      callback();

    }, config.timeout);

  },
  startRound = async (callback) => {

    shufflePlayers();

    for(let i = 0; i < playersOrder.length; i++) {

      currentWord = words[Math.floor(Math.random() * words.length)],
      currentPlayer = playersOrder[0];

      await startDrawing(() => {

        console.log('End of drawing');

        if(i == (playersOrder.length - 1)) {

          console.log('Round ended');
          callback();

        }

      });

    }

  },
  startGame = async () => {

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

    for(let i = 0; i < config.rounds; i++) {

      round = i + 1;

      await startRound(() => {

        if(round == config.rounds)
          console.log('game ended');

      });

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

    for(p in players) {

      players[p].client.emit('messageReceive', 'Announcement', announcement);

    }

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
