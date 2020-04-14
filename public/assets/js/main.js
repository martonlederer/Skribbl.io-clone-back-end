const socket = io();

socket.emit('joinGame', 'test name', 1010);

socket.on('joinGame', (success) => {

  console.log(success);

});
