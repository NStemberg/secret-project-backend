var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

app.get('/', function (req, res) {
    res.json(JSON.stringify({name: 'Hello World!'}));
});

app.get('/test', function (res, res) {
    res.send('Hello World!');
});

// use port 3000 unless there exists a preconfigured port
var port = process.env.PORT || 3000;

io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        x: 100,
        y: 450,
        playerId: socket.id,
    };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);
    console.log(players);
    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete players[socket.id];
        io.emit('disconnect', socket.id);

    })
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });;
});

server.listen(port);