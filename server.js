var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

server.listen(process.env.PORT || 3000)
console.log('server running....')

app.get('/patient', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/doc.html')
})


//open connection with socketio

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('connected: %s sockets connected', connections.length)
//disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length)
  })

  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames()
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
    console.log(users);
  }

  //send message
    //listening for message
  socket.on('send message', function(data){
    console.log(data)
    io.sockets.emit('new message', {msg: data, user:socket.username});
  })
})
