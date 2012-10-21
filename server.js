var io = require('socket.io');
var express = require('express');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

server.listen(4000);

// app.use("/javascripts", express.static(__dirname + '/javascripts'));
// app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
// app.use("/images", express.static(__dirname + '/images'));
// app.use("/sounds", express.static(__dirname + '/sounds'));
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var clients = new Array();

io.sockets.on('connection', function (socket) {
  clients.push(socket.id);

  console.log('New client connected: ' + socket.id + ' total clients connected: ' + clients.length);

  socket.emit('news', { hello: 'world' });

  socket.broadcast.emit('playerConnected', { clientid: socket.id });

  socket.on('playerPos', function (data) {
    socket.broadcast.emit('playerPos', { clientid: socket.id, pos: data });
  });


  socket.on('disconnect', function () {
    // send a disconnected client message to notify all connected clients of a player disconnecting from the game
    io.sockets.emit('playerDisconnected', { clientid: socket.id, roomName: socket.roomName});
    // remove the disconnected client from our clients array
    for(var i = 0; i < clients.length; i++) {
      if(clients[i] == socket.id) {
        clients.splice(i, 1);
      }
    }   
    
    console.log('Client disconnected: ' + socket.id + ' total clients connected: ' + clients.length);    
  });  
    

});