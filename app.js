var express = require('express');
var EventEmitter = require('events');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
var x = 0;
var host = '';

const emitter = new EventEmitter();

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
        y: 350,
        score: 0,
        playerId: socket.id,
    };
    if(host === '') {
        host = socket.id;
    }
    if(socket.id === host){
        setInterval(() => {
            const coord = (100 + (Math.random() * 300));
            socket.emit('createObst', {y: coord});
            socket.broadcast.emit('createObst', {y: coord});
        }, 1000)
    }
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);
    console.log(players);
    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete players[socket.id];
        io.emit('disconnect', socket.id);

    })
    socket.on('collision', function() {
        players[socket.id].score += 1;
        socket.emit('collision', players);
        socket.broadcast.emit('collision', players);
    })
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
});

server.listen(port);