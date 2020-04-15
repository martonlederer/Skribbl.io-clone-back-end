const socket = io();

document.querySelector('#joinGame').addEventListener('click', () => {

  socket.emit('joinGame', document.querySelector('#name').value, document.querySelector('#gameCode').value, (success) => {

    console.log(success ? 'Joined game' : 'Could not join game');

  });

});

document.querySelector('#sendMessage').addEventListener('click', () => {

  socket.emit('sendMessage', document.querySelector('#message').value);

});

document.querySelector('#addWord').addEventListener('click', () => {

  socket.emit('addWord', document.querySelector('#customword').value);

});

socket.on('playerJoin', (playerName) => {

  console.log(`${playerName} joined the game.`);

});

socket.on('playerLeave', (playerName) => {

  console.log(`${playerName} left the game.`);

});

socket.on('startGame', () => {

  console.log('Starting game...');

});

socket.on('messageReceive', (name, message) => {

  const msgEl = document.createElement('P');
  msgEl.appendChild(document.createTextNode(`${name}: ${message}`));

  document.querySelector('#console').appendChild(msgEl);

});
