/**
 * Created by TNA3624 on -17/-13/2017.
 */
exports.neural = function(runtime) {

    var ENCOG = ENCOG || {
            VERSION: '0.1',
            PLATFORM: 'javascript',
            precision: 1e-10,
            NEWLINE: '\n',
            ENCOG_TYPE_ACTIVATION: 'ActivationFunction',
            ENCOG_TYPE_RBF: 'RBF'
        };

    ENCOG.fillArray = function (arr, start, stop, v) {
        'use strict';
        var i;

        for (i = start; i < stop; i += 1) {
            arr[i] = v;
        }
    };

    ENCOG.allocate1D = function (x) {
        'use strict';
        var i, result;

        result = [];
        for (i = 0; i < x; i += 1) {
            result[i] = 0;
        }

        return result;
    };

    ENCOG.Drawing = function(){};
    ENCOG.drawingCreate = function (element, x, y, name,glass) {
        'use strict';
        let result = new ENCOG.Drawing();
        result.y = y;
        result.x = x;
        result.element = element;
        result.canvasDiv = element.component;
        result.canvasWidth = element.width;
        result.canvasHeight = element.height;
        result.width = 1600;
        result.height = 1000;
        result.glass = glass;

        result.foreign = runtime.create("foreignObject");
        runtime.attrNS(result.foreign,"width",result.canvasWidth);
        runtime.attrNS(result.foreign,"height",result.canvasHeight);
        runtime.attrNS(result.foreign,"x",0);
        runtime.attrNS(result.foreign,"y",0);
        runtime.add(result.canvasDiv,result.foreign);
        result.canvas = runtime.createDOM("canvas");
        runtime.attr(result.canvas,"width",result.width);
        runtime.attr(result.canvas,"height",result.height);
        runtime.mark(result.canvas,"draw "+name);
        runtime.add(result.foreign,result.canvas);

        result.drawing = [];
        for(var i = 0;i<result.width;i++)
        {
            let line = [];
            for(var j = 0;j<result.height;j++)
            {
                line.push(0);
            }
            result.drawing.push(line);
        }

        result.started=true;
        return result;
    };

    ENCOG.drawingDelete = function (glass,element) {
        'use strict';
        glass.remove(element);
    };

    ENCOG.Drawing.prototype =
        {
            canvas: null,
            drawingContext: null,
            canvasDiv: null,
            NAME: "Drawing",
            canvasWidth: null,
            canvasHeight: null,
            started: false,
            downsampleHeight: 8,
            downsampleWidth: 5,
            drawing:null,
            currentX:0,
            currentY:0,
            width:0,
            height:0,
            glass:null,

            // Handle events to the canvas.  This allows drawing to occur.
            ev_canvas: function (ev,control) {
                ev._x = Math.round(ev.pageX * 1.25);
                ev._y = Math.round(ev.pageY * 1.25);

                if (ev.type === 'mousemove'||control=="mousemove") {
                    if(this.currentX!=0&&this.currentY!=0) {
                        let dx = ev._x - this.currentX;
                        let dy = ev._y - this.currentY;
                        if (dx < 0) {
                            for (var i = ev._x; i < this.currentX; i++) {
                                let y = Math.round(ev._y + dy * (i - ev._x) / dx);
                                this.drawing[i][y] = 1;
                            }
                        }
                        else {
                            for (var i = ev._x; i > this.currentX; i--) {
                                let y = Math.round(ev._y + dy * (i - ev._x) / dx);
                                this.drawing[i][y] = 1;
                            }
                        }
                    }
                    this.currentX=ev._x;
                    this.currentY=ev._y;
                }

                else if (ev.type === 'touchmove'||control=="touchmove") {
                    ev.touchX=Math.round(ev.touches[0].clientX*1.25);
                    ev.touchY=Math.round(ev.touches[0].clientY*1.25);
                    if(this.currentX!=0&&this.currentY!=0) {
                        let dx = ev.touchX - this.currentX;
                        let dy = ev.touchY- this.currentY;
                        if (dx < 0) {
                            for (var i = ev.touchX; i < this.currentX; i++) {
                                let y = Math.round(ev.touchY+ dy * (i - ev.touchX) / dx);
                                this.drawing[i][y] = 1;
                            }
                        }
                        else {
                            for (var i = ev.touchX; i > this.currentX; i--) {
                                let y = Math.round(ev.touchY+ dy * (i - ev.touchX) / dx);
                                this.drawing[i][y] = 1;
                            }
                        }
                    }
                    this.currentX=ev.touchX;
                    this.currentY=ev.touchY;
                }

                // This is called when you release the mouse button.
                else if(ev.type === 'mouseup'||control=="mouseup"){
                    if (this.started) {
                        this.started = false;
                        ENCOG.drawingDelete(this.glass,this.element);
                    }
                }

                else if(ev.type === 'touchend'||control=="touchend"){
                    if (this.started) {
                        this.started = false;
                        ENCOG.drawingDelete(this.glass,this.element);
                    }
                }
            },

            isHLineClear: function (row) {
                for(var i=0;i<this.width-1;i++)
                {
                    if(this.drawing[i][row]==1)return false;
                }
                return true;
            },

            isVLineClear: function (col) {
                for(var i=0;i<this.height;i++)
                {
                    if(this.drawing[col][i]==1)return false;
                }
                return true;
            },

            // Downsample the drawing area.
            performDownSample: function () {
                'use strict';
                var top, bottom, left, right, cellWidth, cellHeight, result, resultIndex, row, col, x, y, d;

                // first find a bounding rectangle so that we can crop out unused space
                top = 0;
                while (this.isHLineClear(top) && top < this.height - 1) {
                    top++;
                }

                bottom = this.height - 1;
                while (this.isHLineClear(bottom) && bottom > 0) {
                    bottom--;
                }
                left = 0;
                while (this.isVLineClear(left) && left < this.width - 1) {
                    left++;
                }

                right = this.width - 1;
                while (this.isVLineClear(right) && right > 0) {
                    right--;
                }

                if (bottom < top) {
                    result = ENCOG.allocate1D(this.downsampleHeight * this.downsampleWidth);
                    ENCOG.fillArray(result, 0, result.length, -1);
                    return result;
                }

                cellWidth = Math.round((right - left) / this.downsampleWidth);
                cellHeight = Math.round((bottom - top) / this.downsampleHeight);
                result = new Array();
                resultIndex = 0;

                for (row = 0; row < this.downsampleHeight; row++) {
                    for (col = 0; col < this.downsampleWidth; col++) {
                        x = (cellWidth * col) + left;
                        y = (cellHeight * row) + top;
                        // obtain pixel data for the grid square
                        let tab = [];
                        for (var i = x; i < x + cellWidth; i++) {
                            let col = [];
                            for (var j = y; j < y + cellHeight; j++) {
                                col.push(this.drawing[i][j]);
                            }
                            tab.push(col);
                        }

                        d = false;
                        // see if at least one pixel is "black"
                        for (let i = 0; i < tab.length; i++) {
                            for (let j = 0; j < tab[i].length; j++) {
                                if (tab[i][j] == 1) {
                                    d = true;
                                    break;
                                }
                            }
                        }
                        if (d) {
                            result[resultIndex++] = 1.0;
                        } else {
                            result[resultIndex++] = -1.0;
                        }
                    }
                }

                return result;
            },
            clear:function(){
                this.canvas.width=this.canvas.width;
            }
        };

    var DOWNSAMPLE_WIDTH = 5;
    var DOWNSAMPLE_HEIGHT = 8;

    var charData = {};
    var downSampleData = [];
    var numToSend={
        element: "",
        num:""
    };
    var set = false;
    var ondraw=false;

    function init_draw(element,x,y,name,callback,printNumber,prod,glass) {
        let drawingArea;
        let bestchar;
        ondraw=true;
        drawingArea = ENCOG.drawingCreate(element,x,y,name,glass);
        preload();

        runtime.addEvent(drawingArea.canvasDiv,'mouseup', function (e) {
            if(numToSend.element=="") numToSend.element=name;
            bestchar = ev_recognize();
            drawingArea.ev_canvas(e, "mouseup");
            if((bestchar =="click")&&(numToSend.num.length!=0))numToSend.num+="?";
            else numToSend.num += bestchar;
            if(numToSend.num.length<3) {
                printNumber(numToSend.num+"_");
            }
            else {
                printNumber(numToSend.num);
            }
            if (numToSend.num == "click") {
                clearTimeout();
                printNumber("");
                callback(numToSend.num, prod);
                numToSend.num = "";
                numToSend.element = "";
            }
            else {
                if (!set) {
                    set=true;
                    setTimeout((function () {
                        drawingArea.ev_canvas(e, "mouseup");
                        if (isNaN(parseInt(numToSend.num))){
                            numToSend.num = "";
                            printNumber("");
                            callback("?",prod);
                        }
                        if (numToSend.num != "") {
                            printNumber("");
                            callback(numToSend.num, prod);
                        }
                        numToSend.num = "";
                        numToSend.element = "";
                        ondraw = false;
                        set = false;
                    }), 2500);
                }
            }
        });

        runtime.addEvent(drawingArea.canvasDiv,'mousemove', function (e) {
            drawingArea.ev_canvas(e,"mousemove");
        }, true);

        runtime.addEvent(prod.component.component,'touchend', function (e) {
            if(numToSend.element=="") numToSend.element=name;
            bestchar = ev_recognize();
            drawingArea.ev_canvas(e, "touchend");
            if((bestchar =="click")&&(numToSend.num.length!=0))numToSend.num+="?";
            else numToSend.num += bestchar;
            if(numToSend.num.length<3) {
                printNumber(numToSend.num+"_");
            }
            else {
                printNumber(numToSend.num);
            }
            if (numToSend.num == "click") {
                clearTimeout();
                printNumber("");
                callback(numToSend.num,prod);
                numToSend.num = "";
                numToSend.element = "";
            }
            else {
                if (!set) {
                    set=true;
                    setTimeout((function () {
                        drawingArea.ev_canvas(e, "touchend");
                        if (isNaN(parseInt(numToSend.num))){
                            numToSend.num = "";
                            printNumber("");
                            callback("?",prod);
                        }
                        if (numToSend.num != "") {
                            printNumber("");
                            callback(numToSend.num, prod);
                        }
                        numToSend.num = "";
                        numToSend.element = "";
                        ondraw = false;
                        set = false;
                    }), 2500);
                }
            }
        }, true);

        runtime.addEvent(prod.component.component,'touchmove', function (e) {
            drawingArea.ev_canvas(e);
        }, true);
        runtime.addEvent(drawingArea.canvasDiv,'mouseout', function (e) {
            drawingArea.ev_canvas(e,"mouseout");
        }, true);

        function ev_recognize() {
            downSampleData = drawingArea.performDownSample();
            var dessinpropre = "";
            var charchosen = "";
            for (var p in downSampleData) {
                if (p % 5 == 0) {
                    if (downSampleData[p] == "-1") {
                        dessinpropre += "\n0,";
                    } else {
                        dessinpropre += "\n" + downSampleData[p] + ",";
                    }
                } else {
                    if (downSampleData[p] == "-1") {
                        dessinpropre += "0,";
                    } else {
                        dessinpropre += downSampleData[p] + ",";
                    }
                }
            }

            var bestChar = '?';
            var bestScore = 0;

            for (var c in charData) {
                var data = charData[c];
                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    var delta = data[i] - downSampleData[i];
                    sum = sum + (delta * delta);
                }

                sum = Math.sqrt(sum);
                if (sum < bestScore || bestChar == '?') {
                    bestScore = sum;
                    bestChar = c;
                }
            }

            if(bestScore>6.5) bestChar="?";
            drawingArea.clear();
            clearDownSample();
            return bestChar;
        }

        function clearDownSample() {
            downSampleData = ENCOG.allocate1D(DOWNSAMPLE_WIDTH * DOWNSAMPLE_HEIGHT);
            ENCOG.fillArray(downSampleData, 0, downSampleData.length, -1);
        }
    }

    function preload()
    {
        defineChar("click", new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1) );
        defineChar("0", new Array( -1,1,1,1,-1,1,1,-1,1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,1,-1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1 ) );
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

    function defineChar(charEntered, data) {
        charData[charEntered] = data;
    }
    return {
        init_draw : init_draw,
    }
};

