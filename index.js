var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
let users = []

io.set('origins', 'localhost:3001:80')


io.on('connection', function (socket) {
  console.log('a user has connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
    users = users.filter((userObj) => {
      return userObj['id'] !== socket.id
    })
    console.log(users)
    io.emit('leave room', users)
  })
  socket.on('chat message', function (msg, username) {
    // console.log('message: ' + msg + ' from: ' + username)
    io.emit('chat message', msg, username)
  })
  socket.on('join room', function (username) {
    let obj = new Object()
    obj.name = username
    obj.id = socket.id
    users.push(obj)
    io.emit('join room', users)
  })
  socket.on('error', (error) => {
    console.log('Error(s): ' + error)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
