module.exports = (client) => {

  client.on('joinGame', (name, gameCode, callback) => {

    if(client.Room != null)
      client.Room.removePlayer(client)

    if(!(gameCode in rooms))
      rooms[gameCode] = room(gameCode)

    rooms[gameCode].addPlayer(name, client)
    client.Room = rooms[gameCode]

    //removing client
    const safePlayers = {}

    for(p in client.Room.getPlayers()) {

      safePlayers[p] = {name: client.Room.getPlayers()[p].name, points: client.Room.getPlayers()[p].points}

    }

    callback(true, safePlayers, client.Room.getStatus(), client.id, client.Room.getWords().length)

  })

  client.on('sendMessage', (message) => {

    if(client.Room == null)
      return

    client.Room.sendMessage(client, message)

  })

  client.on('addWord', (words) => {

    if(client.Room == null)
      return

    for(let i = 0; i < words.length; i++) {

      client.Room.addWord(words[i])

    }

  })

  client.on('roundNumberChange', (rounds) => {

    if(client.Room == null)
      return

    client.Room.updateRoundNumber(rounds)

  })

  client.on('getWordsCount', (callback) => {

    if(client.Room == null)
      return

    callback(client.Room.getWords().length)

  })

  client.on('startGame', () => {

    if(client.Room == null)
      return

    client.Room.startGame()

  })

  client.on('drawingData', newLine => {

    if(client.Room == null)
      return

    if(client.id != client.Room.getCurrentDrawer())
      return

    client.Room.handleDrawingData(newLine)

  })

  client.on('backgroundColorChange', bgColor => {

    if(client.Room == null)
      return

    if(client.id != client.Room.getCurrentDrawer())
      return

    client.Room.handleBackgroundColorChange(bgColor)

  })

  client.on('rubber', (offsetX, offsetY) => {

    if(client.Room == null)
      return

    if(client.id != client.Room.getCurrentDrawer())
      return

    client.Room.erease(offsetX, offsetY)

  })

  client.on('disconnect', () => {

    if(client.Room == null)
      return

    client.Room.removePlayer(client)

    if(Object.keys(client.Room.getPlayers()).length == 0)
      delete rooms[client.Room.getGameCode()]

    client.Room = null

  })

}
