var http = require('http');
var express = require('express');
var path = require('path');
var port = process.env.port || 1337;

var app = express();

app.set('port', port);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/Chat', function (req, res) {
    res.render('index');
});

var server = http.createServer(app);
var socket = require('socket.io')(server);

server.listen(port, function () {
    console.log('Listening on port '.concat(app.get('port')));
});

socket.on('connection', function (websocket) {
    console.log('User connected');
    
    websocket.on('disconnect', function () {
        console.log('user disconnected');
    })
        
    websocket.on('chat', function (getmsg) {        
        var webtext = getmsg['text'];
        var webfrom = getmsg['from'];
        var webroom = getmsg['room'];
        
        console.log('Room: '.concat(webroom));
        console.log(' Address: '.concat(websocket.handshake.address).concat(' from ').concat(webfrom).concat(': ').concat(webtext));
        websocket.emit('chat', {room: webroom, text: webfrom.concat(': ').concat(webtext) } );
    });    
});