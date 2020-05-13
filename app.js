//require modules, server and config
const express = require('express'),
bodyParser = require('body-parser'),
app = express(),
server = require('http').Server(app);
io = require('socket.io')(server);
config = require('./config.json'),
socketClient = require('./app/socketClient'),
room = require('./app/room'),
rooms = {};

//using public folder for get requests
app.use(express.static(__dirname + '/public', {extensions: ['html']}));
app.get('*', (req, res) => {

  res.send('public/index.html')

})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

server.listen(config.port, () => {

  console.log(`Server started on port ${config.port}`);

});

io.on('connection', socketClient);
