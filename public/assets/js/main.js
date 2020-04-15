const socket = io();

document.querySelector('#joinGame').addEventListener('click', () => {

  if(document.querySelector('.join input[name=join-nameCode]').value == null || document.querySelector('.join input[name=join-name]').value == null || document.querySelector('.join input[name=join-nameCode]').value == '' || document.querySelector('.join input[name=join-name]').value == '')
    return;

  socket.emit('joinGame', document.querySelector('.join input[name=join-name]').value, document.querySelector('.join input[name=join-nameCode]').value, (success) => {

    console.log(success ? 'Joined game' : 'Could not join game');

  });

});

document.querySelector('#createGame').addEventListener('click', () => {

  if(document.querySelector('.join input[name=create-name]').value == null || document.querySelector('.join input[name=create-name]').value == '')
    return;

  const gameCode = Math.floor(Math.random() * 89999999 + 10000000);

  socket.emit('joinGame', document.querySelector('.join input[name=create-name]').value, gameCode, (success) => {

    console.log(success ? `Created game width code: ${gameCode}` : 'Could not join game');

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
