var app = require('express')()
var cors = require('cors');
var http = require('http').Server(app)
var io = require('socket.io')(http)
let users = []

// io.set('origins', 'http://localhost:3001:80')

app.use(cors({
  origin: 'http://localhost:3001'
}));


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
  socket.on('chat message', function (msg, username, timestamp) {
    // console.log('message: ' + msg + ' from: ' + username)
    io.emit('chat message', msg, username, timestamp)
  })
  socket.on('join room', function (username) {
    let obj = new Object()
    obj.name = username
    obj.id = socket.id
    obj.typing = false
    users.push(obj)
    io.emit('join room', users)
  })
  socket.on('typing', function (username) {
    io.emit('typing', username)  
  })
  socket.on('error', (error) => {
    console.log('Error(s): ' + error)
  })
})

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000')
})
