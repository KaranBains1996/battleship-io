const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const favicon = require('serve-favicon')

// set up static routes
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use(favicon(path.join(__dirname, 'public', 'assets', 'favicons', 'favicon.ico')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', socket => {
  console.log('user ' + socket.id + ' connected');
  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on 127.0.0.1:3000');
});