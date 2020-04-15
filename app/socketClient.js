module.exports = (client) => {

  client.on('joinGame', (name, gameCode, callback) => {

    if(client.Room != null)
      client.Room.removePlayer(client);

    if(!(gameCode in rooms))
      rooms[gameCode] = room(gameCode);

    rooms[gameCode].addPlayer(name, client);
    client.Room = rooms[gameCode];

    //removing client
    const safePlayers = {};

    for(p in client.Room.getPlayers()) {

      safePlayers[p] = {name: client.Room.getPlayers()[p].name, points: client.Room.getPlayers()[p].points}

    }

    callback(true, safePlayers, client.Room.getStatus(), client.id);

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
