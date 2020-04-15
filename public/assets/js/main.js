const socket = io();

let gameStatus = '',
playerData = {};

document.querySelector('#joinGame').addEventListener('click', () => {

  if(document.querySelector('.join input[name=join-nameCode]').value == null || document.querySelector('.join input[name=join-name]').value == null || document.querySelector('.join input[name=join-nameCode]').value == '' || document.querySelector('.join input[name=join-name]').value == '')
    return;

  const gameCode = document.querySelector('.join input[name=join-nameCode]').value,
  name = document.querySelector('.join input[name=join-name]').value;

  socket.emit('joinGame', name, gameCode, (success, players, status, playerID) => {

    console.log(success ? 'Joined game' : 'Could not join game');

    if(!success)
      return;

    gameStatus = status;
    playerData = {id: playerID, name: name, gameCode: gameCode, points: 0};

    if(status == 'waiting') {

      switchToGameManager(gameCode, players);

    }else {

      //TODO: switch to game directly

    }

  });

});

document.querySelector('#createGame').addEventListener('click', () => {

  if(document.querySelector('.join input[name=create-name]').value == null || document.querySelector('.join input[name=create-name]').value == '')
    return;

  const gameCode = Math.floor(Math.random() * 89999999 + 10000000),
  name = document.querySelector('.join input[name=create-name]').value;

  socket.emit('joinGame', name, gameCode, (success, players, status, playerID) => {

    console.log(success ? `Created game width code: ${gameCode}` : 'Could not create game');

    if(!success)
      return;

    gameStatus = status;
    playerData = {id: playerID, name: name, gameCode: gameCode, points: 0};

    if(status == 'waiting') {

      switchToGameManager(gameCode, players);

    }else {

      //TODO: switch to game directly

    }

  });

});

document.querySelector('#sendMessage').addEventListener('click', () => {

  socket.emit('sendMessage', document.querySelector('#message').value);

});

document.querySelector('#addWord').addEventListener('click', () => {

  socket.emit('addWord', document.querySelector('.gameManager textarea[name=words]').value.split('\n'));
  document.querySelector('.gameManager textarea[name=words]').value = '';

});

socket.on('playerJoin', (playerName, playerID) => {

  console.log(`${playerName} joined the game.`);
  addChatMessage('Announcement', `${playerName} joined the game.`);
  addPlayerToList(playerName, 0, playerID, gameStatus == 'waiting' ? document.querySelector('.gameManager .players') : document.querySelector('.game .players'));

});

socket.on('playerLeave', (playerName, playerID) => {

  console.log(`${playerName} left the game.`);
  addChatMessage('Announcement', `${playerName} left the game.`);
  removePlayer(playerID, gameStatus == 'waiting' ? document.querySelector('.gameManager .players') : document.querySelector('.game .players'));

});

socket.on('wordAdded', (count) => {

  document.querySelector('.gameManager h2 span.wordsCount').innerText = count;

});

socket.on('startGame', () => {

  console.log('Starting game...');
  addChatMessage('Announcement', 'Starting game...');

});

socket.on('messageReceive', (name, message) => {

  addChatMessage(name, message);

});

function switchToGameManager(gameCode, players) {

  document.querySelector('.join').style.display = 'none';
  document.querySelector('.gameManager').style.display = 'block';

  document.querySelector('.gameManager h1 span.inGameCode').innerText = gameCode;

  for(p in players) {

    addPlayerToList(p == playerData.id ? `${players[p].name} (You)` : players[p].name, players[p].points, p, document.querySelector('.gameManager .players'));

  }

  socket.emit('getWordsCount', (count) => {

    document.querySelector('.gameManager h2 span.wordsCount').innerText = count;

  });

}

function addPlayerToList(playerName, playerPoints, playerID, listEl) {

  const playerElement = document.createElement('div'),
  playerNameElement = document.createElement('h1'),
  playerPointsElement = document.createElement('p');

  playerElement.classList.add('player');
  playerElement.setAttribute('playerID', playerID);

  playerNameElement.appendChild(document.createTextNode(playerName));
  playerPointsElement.appendChild(document.createTextNode(`Points: ${playerPoints}`));
  playerElement.appendChild(playerNameElement);
  playerElement.appendChild(playerPointsElement);
  listEl.appendChild(playerElement);

}

function removePlayer(playerID, listEl) {

  listEl.querySelector(`.player[playerID=${playerID}]`).remove();

}

function addChatMessage(sender, message) {

  const msgEl = document.createElement('P');
  msgEl.appendChild(document.createTextNode(`${sender}: ${message}`));

  document.querySelector('#console').appendChild(msgEl);

}
