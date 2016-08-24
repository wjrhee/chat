var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio(server);
var path = require('path');
var bodyParser = require('body-parser');
var models = require('./models/db');
var User = models.User;
var Message = models.Message;



// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');
// app.engine('html', swig.renderFile);


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('./public'));
app.use('./components', express.static('./CryptoJS/components'));
// app.use('/rollups', express.static(__dirname, '/CryptoJS/rollups'));

io.on('connection', function(socket){
  console.log('a user has connected');
  console.log(socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  })
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  })
})
console.log(User);
User.sync({force:true})
.then(function(){
  Message.sync({force:true})
  .then(function(){
    server.listen(3000, function(){
      console.log('listening on 3000');
    })
  })
})
.catch(console.error);
