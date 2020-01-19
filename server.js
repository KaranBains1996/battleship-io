const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const favicon = require('serve-favicon')

// set up static routes
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use(favicon(path.join(__dirname, 'public', 'assets', 'favicons', 'favicon.ico')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

let users = [];
let queue = [];

io.on('connection', socket => {
  users.push({
    id: socket.id,
    username: socket.handshake.query.username,
    board: null
  });
  
  console.log('user ' + socket.id + ' connected');

  // look for players handlers
  socket.on('look for players', board => {
    userIndex = users.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      users[userIndex].board = board;
    }
    if (queue.length) {
      const matchedOpponent = queue.shift();
      
      // send opponent found event to matched players
      socket.emit('opponent found', matchedOpponent);
      socket.to(matchedOpponent.id).emit('opponent found', users[userIndex])
      
    } else {
      queue.push(users[userIndex]);
    }
  });
  
  // disconnect handler
  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
    users = users.filter(u => u.id !== socket.id);
  });
});

http.listen(3000, () => {
  console.log('listening on 127.0.0.1:3000');
});