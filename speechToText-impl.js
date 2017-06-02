/**
 * Created by TNA3624 on 01/06/2017.
 */

exports.speechToText=class {
    listen(micro,market){
        var voice=[];
        let timer;
        let recording=false;
        window.launchSTT = ()=>{
            if (!recording) {
                voice = [];
                startRecording();
                recording = true;
                console.log("je record");
                micro.url("img/microphone.gif");
                setTimeout(()=>{
                    stopRecording();
                    micro.url("img/microphoneload.gif");
                    console.log("je record plus");
                    let i = 0;
                    timer = setInterval(()=>{
                        i++;
                        voice = getMessage();
                        if ((voice['transcript'].length != 0 && voice['transcript'] != "Je n'ai pas compris") || i == 15) {
                            clearInterval(timer);
                            console.log(voice['transcript']);
                            if (i == 25) console.log("qsdqsd");//textToSpeech("Je n'ai rien entendu", "FR");
                            else if (voice['confidence'] > 0.5) {
                                market.vocalRecognition(voice['transcript']);
                            }
                            else {
                                console.log("je n'ai pas bien saisi votre demande : " + voice['transcript']);
                                market.textToSpeech("Je n'ai pas bien compris votre demande", "fr");
                            }
                            i = 0;
                            micro.url("img/microphone.png");
                            voice = [];
                            recording = false;
                            bool=false;
                        }
                    }, 200);
                }, 4000);

            }
        };
    }

    writeLog(msg){
        writeLog(msg);
    }
};