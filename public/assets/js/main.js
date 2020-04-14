const socket = io();

document.querySelector('#joinGame').addEventListener('click', () => {

  socket.emit('joinGame', document.querySelector('#name').value, document.querySelector('#gameCode').value);

  socket.on('joinGame', (success) => {

    console.log(success);

  });

});
