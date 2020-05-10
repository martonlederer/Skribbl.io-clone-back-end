const config = require('../config.json');

module.exports = (code) => {

  const gameCode = code,
  players = {},
  words = []

  let round = 1,
  rounds = 10,
  currentDrawer = null,
  currentWord = null,
  currentWordHelp = null,
  playersOrder = [],
  status = 'waiting',
  drawingData = []

  const getGameCode = () => {

    return gameCode;

  },
  getPlayers = () => {

    return players

  },
  getRound = () => {

    return round

  },
  getStatus = () => {

    return status

  },
  getWords = () => {

    return words

  },
  getRounds = () => {

    return rounds

  },
  getCurrentDrawer = () => {

    return currentDrawer

  }

  const addPlayer = (name, client) => {

    players[client.id] = { name: name, client: client, points: 0 }
    playersOrder.push(client.id)

    for(p in players) {

      players[p].client.emit('playerJoin', name, client.id)

    }

    sendAnnouncement(`${name} joined the game`)

  },
  addWord = (word) => {

    if(words.includes(word.toLowerCase()))
      return

    words.push(word.toLowerCase());

    for(p in players) {

      players[p].client.emit('wordAdded', words.length)

    }

  },
  removePlayer = (client) => {

    for(p in players) {

      players[p].client.emit('playerLeave', players[client.id].name, client.id)

    }

    sendAnnouncement(`${players[client.id].name} left the game`)

    delete players[client.id]

  },
  updateRoundNumber = (n) => {

    rounds = n

    for(p in players) {

      players[p].client.emit('roundNumberChangeClient', rounds)

    }

  },
  shufflePlayers = () => {

    let currentIndex = playersOrder.length,
    temporaryValue = null,
    randomIndex = null

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = playersOrder[currentIndex]
      playersOrder[currentIndex] = playersOrder[randomIndex]
      playersOrder[randomIndex] = temporaryValue

    }

  },
  startRound = async (callback) => {

    shufflePlayers()

    for(let i = 0; i < playersOrder.length; i++) {

      currentWord = words[Math.floor(Math.random() * words.length)],
      currentWordHelp = '',
      currentDrawer = playersOrder[i]
      drawingData = []

      sendAnnouncement(`${players[currentDrawer].name} is drawing!`)

      for(p in players) players[p].client.emit('receiveDrawingData', drawingData)

      for(let j = 0; j < currentWord.length; j++) currentWordHelp += '_'

      let startDrawing = new Promise((resolve, reject) => {

        for(p in players) {

          players[p].client.emit('currentDrawer', currentDrawer)

          if(p == currentDrawer) {

            players[p].client.emit('drawWord', currentWord)
            continue

          }

          players[p].client.emit('drawWord', currentWordHelp)

        }

        setTimeout(() => {

          //we'll send the winner from here later, for now it's just 1
          resolve(1)

        }, config.timeout)

      }),
      drawingResult = await startDrawing

      if(i == (playersOrder.length - 1)) {

        if(round == rounds) {

          sendAnnouncement(`Game ended!`)
          return

        }

        sendAnnouncement(`Round ${round} ended!`)
        round++
        startRound()

      }

    }

  },
  startGame = () => {

    if(Object.keys(players).length != config.min_players || status != 'waiting') {

      sendAnnouncement(`Could not start game, not enough players (minimum ${config.min_players})`)
      return

    }

    if(words.length < config.min_words) {

      sendAnnouncement(`Could not start game, not enough words (minimum ${config.min_words})`)
      return

    }

    status = 'running'

    for(p in players) {

      players[p].client.emit('startGame')
      players[p].client.emit('statusChange', status)

    }

    startRound()

  },
  handleDrawingData = (newLine) => {

    drawingData = newLine

    for(p in players) {

      if(p == currentDrawer)
        continue

      players[p].client.emit('receiveDrawingData', newLine)

    }

  },
  sendMessage = (client, message) => {

    if(message == null || message == '')
      return

    for(p in players) {

      players[p].client.emit('messageReceive', players[client.id].name, message)

    }

  },
  sendAnnouncement = (announcement) => {

    for(p in players) {

      players[p].client.emit('messageReceive', 'Announcement', announcement)

    }

  }

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    getStatus: getStatus,
    getWords: getWords,
    getRounds: getRounds,
    getCurrentDrawer: getCurrentDrawer,
    updateRoundNumber: updateRoundNumber,
    addPlayer: addPlayer,
    addWord: addWord,
    removePlayer: removePlayer,
    sendMessage: sendMessage,
    startGame: startGame,
    handleDrawingData: handleDrawingData

  }

}
