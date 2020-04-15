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

  client.on('addWord', (words) => {

    for(let i = 0; i < words.length; i++) {

      client.Room.addWord(words[i]);

    }

  });

  client.on('disconnect', () => {

    if(client.Room == null)
      return;

    client.Room.removePlayer(client);

    if(Object.keys(client.Room.getPlayers()).length == 0)
      delete rooms[client.Room.getGameCode()];

    client.Room = null;

  });

};
