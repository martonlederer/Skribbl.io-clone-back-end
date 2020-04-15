module.exports = (client) => {

  client.on('joinGame', (name, gameCode, callback) => {

    if(client.currentGameCode != null)
      rooms[gameCode].removePlayer(client);

    if(!(gameCode in rooms))
      rooms[gameCode] = room(gameCode);

    rooms[gameCode].addPlayer(name, client);
    client.currentGameCode = gameCode;

    callback(true);

  });

  client.on('sendMessage', (message) => {

    if(client.currentGameCode == null)
      return;

    rooms[client.currentGameCode].sendMessage(client, message);

  });

};
