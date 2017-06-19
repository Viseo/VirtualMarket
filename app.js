/**
 * Created by GEH3641 on 12/04/2017.
 */
var express = require('express');
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

app.listen(port);

console.log('server open on port ' + port);

binaryServer = BinaryServer({server: app, port: 3030});

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