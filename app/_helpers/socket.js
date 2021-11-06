const WebSocket = require('ws');
let ws;
try{ws = new WebSocket.Server({port: 8080});}catch (e) {
    console.log(e);

}

// ws.on('open', function open() {
//     ws.send('something');
// });
//
// ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
// });

// const io = require('socket.io')();
// io.on('connection', client => { console.log('connected') });
// io.listen(3000);

module.exports = ws;