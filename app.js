//require modules, server and config
const express = require('express'),
bodyParser = require('body-parser'),
app = express(),
config = require('./config.json');

//using public folder for get requests
app.use(express.static(__dirname + '/public', {extensions: ['html']}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//API handlers
app.all('/api/*', function(request, response, next) {

  try {

    const handler = require(`./app/api/${request.method.toLowerCase()}.js`);
    handler.handle(request, response, next);

  }catch(exception) {

    response.json({'error': true, 'message': 'Unsupported request type.'});

  }

});

app.listen(config.port, function() {

  console.log(`Server started on port ${config.port}`);

});
