/**
 * Created by GEH3641 on 12/04/2017.
 */


var express = require('express');
var http = require('http');
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var fs = require('fs');

var recognize=require("./lib/recognize").recognize;

var port = 5000;
var outFile = 'demo.wav';
var app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.render('index.html');
});

console.log('server open on port ' + port);
server=http.createServer(app);

binaryServer = BinaryServer({server: server});
server.listen(port);

binaryServer.on('connection', function(client) {
    console.log('new connection');
    client.on('stream', function(stream, meta) {
        console.log(meta.event);
        switch (meta.event){
            case 'log':
                stream.on('data', function (log) {
                    fs.open('vocal_recognition_log.txt', 'a', 666, function( e, id ) {
                        fs.write( id, log+"\r\n", null, 'utf8', function(){
                            fs.close(id, function(){
                                console.log('file closed');
                            });
                        });
                    });
                });
                break;

            case 'request':
                var fileWriter = new wav.FileWriter(outFile, {
                    channels: 1,
                    sampleRate: 44100,
                });
                console.log('new stream');

                stream.pipe(fileWriter);
                stream.on('end', function() {
                    // stream.write('hola');
                    fileWriter.end();
                    console.log('wrote to file ' + outFile);
                    recognize(outFile, console.log,client);

                });
                break;
        }
    });
});

//
// var WebSocketServer = require('ws').Server,
//     fs = require('fs');
//
//
// var cfg = {
//     ssl: true,
//     port: 3000,
//     ssl_key: '/path/to/apache.key',
//     ssl_cert: '/path/to/apache.crt'
// };
//
// var httpServ = ( cfg.ssl ) ? require('https') : require('http');
//
// var app      = null;
//
// var processRequest = function( req, res ) {
//
//     res.writeHead(200);
//     res.end("All glory to WebSockets!\n");
// };
//
// if ( cfg.ssl ) {
//
//     app = httpServ.createServer({
//
//         // providing server with  SSL key/cert
//         key: fs.readFileSync( cfg.ssl_key ),
//         cert: fs.readFileSync( cfg.ssl_cert )
//
//     }, processRequest ).listen( cfg.port );
//
// } else {
//
//     app = httpServ.createServer( processRequest ).listen( cfg.port );
// }
//
// var wss = new WebSocketServer( { server: app } );
//
// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message);
//
//         ws.send(message);
//
//     });
//
//     ws.send('something');
// });