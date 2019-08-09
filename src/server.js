const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 12222
const {program} = require('./db-events')

server.listen(port, '10.14.2.230');
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

let cb = (rows) => {
    io.emit('update title', {title: rows[0].after.title})
}

program(cb)
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);
