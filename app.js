var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.json(JSON.stringify({name: 'Hello World!'}));
});

app.get('/test', function (res, res) {
    res.send('Hello World!');
});

// use port 3000 unless there exists a preconfigured port
var port = process.env.PORT || 3000;

app.listen(port);