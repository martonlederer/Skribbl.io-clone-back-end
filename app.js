//require modules, server and config
const express = require('express'),
bodyParser = require('body-parser'),
app = express(),
server = require('http').Server(app);
io = require('socket.io')(server);
config = require('./config.json'),
room = require('./app/room.js'),
rooms = {};

//using public folder for get requests
app.use(express.static(__dirname + '/public', {extensions: ['html']}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

server.listen(config.port, () => {

  console.log(`Server started on port ${config.port}`);

});

io.on('connection', (client) => {

  client.on('joinGame', (name, gameCode) => {

    if(!(gameCode in rooms))
      rooms[gameCode] = room(gameCode);

    rooms[gameCode].addPlayer(name, client.id);

    client.emit('joinGame', true);

  });

});
