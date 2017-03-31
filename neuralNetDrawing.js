/**
 * Created by TNA3624 on -17/-13/2017.
 */

var DOWNSAMPLE_WIDTH = 5;
var DOWNSAMPLE_HEIGHT = 8;

var lstLetters, downsampleArea;
var charData = {};
var downSampleData = [];

function init_draw(element,x,y,name,callback) {
    let drawingArea;
    let bestchar;
    // Find the canvas element.
    drawingArea = ENCOG.GUI.Drawing.create(element,x,y,name);
    //downSampleData = drawingArea.performDownSample(x,y);
    preload();

    element.component.addEventListener("mouseup", function(){
        bestchar=ev_recognize();
        callback(bestchar);
    });

    /////////////////////////////////////////////////////////////////////////////
// Event functions
/////////////////////////////////////////////////////////////////////////////

    // Called when we want to recognize what's been drawn
    function ev_recognize (ev)
    {
        downSampleData = drawingArea.performDownSample();
        var dessinpropre="";
        var charchosen="";
        for (var p in downSampleData){
            if(p%5==0){
                if(downSampleData[p]=="-1"){
                    dessinpropre+="\n0,";
                }else{
                    dessinpropre+="\n"+downSampleData[p]+",";
                }
            }else{
                if(downSampleData[p]=="-1"){
                    dessinpropre+="0,";
                }else{
                    dessinpropre+=downSampleData[p]+",";

                }
            }
        }

        var bestChar = '??';
        var bestScore = 0;

        for(var c in charData )
        {
            var data = charData[c];
            var sum = 0;
            for(var i = 0; i<data.length; i++ )
            {
                var delta = data[i] - downSampleData[i];
                sum = sum + (delta*delta);
            }

            sum = Math.sqrt(sum);

            if( sum<bestScore || bestChar=='??' )
            {
                bestScore = sum;
                bestChar = c;
            }

        }

        for (var q in charData[bestChar]){
            if(q%5==0){
                if(charData[bestChar][q]=="-1"){
                    charchosen+="\n0,";
                }else{
                    charchosen+="\n"+charData[bestChar][q]+",";
                }
            }else{
                if(charData[bestChar][q]=="-1"){
                    charchosen+="0,";
                }else{
                    charchosen+=charData[bestChar][q]+",";

                }
            }
        }

        drawingArea.clear();
        clearDownSample();
        return bestChar;
    }

    function clearDownSample() {
        downSampleData = ENCOG.ArrayUtil.allocate1D(DOWNSAMPLE_WIDTH*DOWNSAMPLE_HEIGHT);
        ENCOG.ArrayUtil.fillArray(downSampleData,0,downSampleData.length,-1);
    }
}


// Preload the digits, so that the user can quickly do some OCR if desired.
function preload()
{
    defineChar("1", new Array( -1,-1,-1,-1,1,-1,-1,-1,1,1,-1,-1,1,1,1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,1,1) );
    defineChar("2", new Array(1,1,1,-1,-1,-1,-1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,1,1,1,1,-1,1,-1,1,1,-1,1,1,1,1,1) );
    defineChar("3", new Array(1,1,1,1,-1,-1,-1,-1,1,1,-1,-1,-1,1,1,-1,-1,1,1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,1,1,1,1,1) );
    defineChar("4", new Array(1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,1) );
    defineChar("5", new Array(1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,1,1,1,1,1) );
    defineChar("6", new Array(-1,1,1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,1,1,1,1,1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,1) );
    defineChar("7", new Array(1,1,1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,-1,-1,-1,1,1,-1,-1,-1,1,-1,-1,-1,1,1,-1,-1,-1,1,-1,-1,-1) );
    defineChar("8", new Array(1,1,1,1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,1,-1,-1,-1,1,1,1,1,1,1) );
    defineChar("9", new Array(1,1,1,1,1,1,1,-1,-1,1,1,-1,-1,-1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1,-1,1) );

}

// Define a character, add it to the list and to the map.
function defineChar(charEntered,data)
{
    charData[charEntered] = data;
}


