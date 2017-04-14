(function(window) {
  var client = new BinaryClient('ws://localhost:3030');
  var launch=false;
  var voice ="";
  client.on('open', function() {
    // window.Stream = client.createStream();
      // window.Stream.on('data', function(data){
      //     console.log("putaiiiiiiiin"+data);
      // });

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
        window.Stream = client.createStream();
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

      audioInput.connect(recorder)
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
  client.on('stream', function(stream, meta) {
      console.log('on a un stream client');
      stream.on('data', function(data){
          if(data){
              voice=JSON.parse(data)['results'][0]['alternatives'][0];
              // console.log(voice);
              launch=true;
          }

      });
      window.getMessage=function (){
          if(voice){
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
   });

})(this);
// var client = new BinaryClient('ws://localhost:3030');
// // Received new stream from server!
// client.on('stream', function(stream){
//     // Buffer for parts
//     var parts = [];
//     // Got new data
//     console.log(stream);
//     stream.on('data', function(data){
//         console.log('ok');
//         console.log(data);
//     });
//     stream.on('end', function(){
//         // Display new data in browser!
//         var img = document.createElement("img");
//         img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
//         document.body.appendChild(img);
//         console.log('ok');
//     });
// });






















