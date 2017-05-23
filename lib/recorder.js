/**
 * Created by GEH3641 on 12/04/2017.
 */
(function(window) {
  var client = new BinaryClient('ws://localhost:3030');
  var launch=false;
  var voice ="";
  client.on('open', function() {
      console.log('client open');

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

    window.startRecording = function() {
        window.Stream = client.createStream({event:'request'});
        recording = true;
        return recording;
    }

    window.stopRecording = function() {
      recording = false;
      window.Stream.end();
        return recording;
    };

      function success(e) {
          audioContext = window.AudioContext || window.webkitAudioContext;
          context = new audioContext();
          let analyseur = context.createAnalyser();
          analyseur.minDecibels = -90;
          analyseur.maxDecibels = -10;
          analyseur.smoothingTimeConstant = 0.85;
          // var distorsion = context.createWaveShaper();
          // var gainVolume = context.createGain();
          // var filtreAccordable = context.createBiquadFilter();



          source = context.createMediaStreamSource(e);
          source.connect(analyseur);
          // analyseur.connect(distorsion);
          // distorsion.connect(filtreAccordable);
          // filtreAccordable.connect(gainVolume);
          // gainVolume.connect(context.destination);

          // analyser.fftSize = 256;
          // var bufferLength = analyser.frequencyBinCount;
          // console.log(bufferLength);
          // var dataArray = new Uint8Array(bufferLength);

          analyseur.fftSize = 256;
          var tailleBuffer = analyseur.frequencyBinCount;
          var tableauDonnees = new Uint8Array(tailleBuffer);
          window.bool= false;
          // analyseur.getByteTimeDomainData(tableauDonnees);
          //   analyser.getByteFrequencyData(dataArray);
          analyseur.getByteFrequencyData(tableauDonnees);
          console.log(tableauDonnees)
          function step(timestamp) {
              requestAnimationFrame(step);
              // console.log(gainVolume)
              analyseur.getByteFrequencyData(tableauDonnees);
              var sum = tableauDonnees.reduce(function(a, b) { return a + b; });
              var avg = sum / tableauDonnees.length;
              if(avg>70){
                  setTimeout(function(){
                      analyseur.getByteFrequencyData(tableauDonnees);
                      var sum = tableauDonnees.reduce(function(a, b) { return a + b; });
                      var avg = sum / tableauDonnees.length;
                      if(avg>70 && bool==false) {
                          console.log('tu as parlé?');
                          bool=true;
                          launchSTT();
                      }
                  },1000)
              }
              // console.log(tableauDonnees)
          }
          requestAnimationFrame(step)
          // the sample rate is in context.sampleRate
          audioInput = context.createMediaStreamSource(e);

          var bufferSize = 4096;
          recorder = context.createScriptProcessor(bufferSize, 1, 1);

          recorder.onaudioprocess = function(e){
              if(!recording) return;
              console.log ('recording');
              var buffer = e.inputBuffer.getChannelData(0);
              window.Stream.write(convertoFloat32ToInt16(buffer));
          }
          console.log('test')
          audioInput.connect(recorder);
          recorder.connect(context.destination);
      }

    function convertoFloat32ToInt16(buffer) {

      var l = buffer.length;
      var buf = new Int16Array(l)

        while (l--) {
            s = Math.max(-1, Math.min(1, buffer[l]));
            buf[l] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

      return buf.buffer
    }


  });
window.getMessage=function (){
    if(voice!=""){
        if(voice['transcript'].length != 0 && launch==true){
            launch=false;
            return voice;
        }else if(launch==true){
            launch=false;
            return {'transcript':"pas de voice","confidence":1};
        }else{
            return {'transcript':"","confidence":1};
        }
    }else{
        launch=false;
        return {'transcript':"Je n'ai pas compris","confidence":1};
    }

};

  window.writeLog=function (log){
      client.send(log,{event:'log'});
  };
  client.on('stream', function(stream, meta) {
      console.log('on a un stream client');
      stream.on('data', function(data){
          if(data){
              voice=JSON.parse(data)['results'][0]['alternatives'][0];
              // console.log(voice);
              launch=true;
          }

      });

   });

})(this);























