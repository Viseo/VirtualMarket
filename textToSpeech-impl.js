/**
 * Created by TNA3624 on 01/06/2017.
 */

exports.speech=class {
    talk(msg){
        var speak = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(speak);
    }
};