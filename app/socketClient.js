module.exports = (client) => {

  client.on('joinGame', (name, gameCode, callback) => {

    if(client.Room != null)
      client.Room.removePlayer(client);

    if(!(gameCode in rooms))
      rooms[gameCode] = room(gameCode);

    rooms[gameCode].addPlayer(name, client);
    client.Room = rooms[gameCode];

    callback(true);

  });

  client.on('sendMessage', (message) => {

    if(client.Room == null)
      return;

    rooms[client.currentGameCode].sendMessage(client, message);

  });

  client.on('disconnect', () => {

    if(client.Room == null)
      return;

    client.Room.removePlayer(client);

  });

};
