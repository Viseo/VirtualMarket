/**
 * Created by GEH3641 on 12/04/2017.
 */
var fs = require('fs');
var google = require('googleapis');
var async = require('async');
var speech = google.speech('v1beta1').speech;

function getAuthClient(callback) {
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      return callback(err);
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/cloud-platform'
      ]);
    }

    return callback(null, authClient);
  });
}

function prepareRequest(inputFile, callback) {
  // inputFile.volume=1;
  fs.readFile(inputFile, function(err, audioFile) {
    if (err) {
      return callback(err);
    }

    console.log('Got audio file!');
    var encoded = new Buffer(audioFile).toString('base64');
    var payload = {
      config: {
        encoding: 'LINEAR16',
        languageCode: 'fr-FR',
        sampleRate: 44100,
      },
      audio: {
        content: encoded
      }
    };

    return callback(null, payload);
  });
}

function recognize(inputFile, callback, client) {
  var requestPayload;

  async.waterfall([
    function(cb) {
      prepareRequest(inputFile, cb);
    },
    function(payload, cb) {
      requestPayload = payload;
      getAuthClient(cb);
    },
    function sendRequest(authClient, cb) {
      console.log('I am analyzing speech...');


      speech.syncrecognize({
          auth: authClient,
          resource: requestPayload
        },
        function(err, result) {
          if (err) {
            return cb(err);
          }

          // TODO: verifier que la connection client est toujours active.
          try {
            client.send(JSON.stringify(result));
            console.log(JSON.stringify(result, null, 2));
            }
            catch (exception) {
              console.log("erreur server :",  exception)
            }
          });
    }
  ], callback);
}

exports.recognize = recognize;
