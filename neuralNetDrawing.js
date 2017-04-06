/**
 * Created by TNA3624 on -17/-13/2017.
 */
exports.neural = function(runtime,Canvas) {

    /*
     * Encog(tm) Core v0.1 - Javascript Version
     * http://www.heatonresearch.com/encog/
     * http://code.google.com/p/encog-java/
     * Copyright 2008-2012 Heaton Research, Inc.

    /**
     * The main Encog namespace.  This is the only global property created by Encog.
     * @type {*}
     */
    var ENCOG = ENCOG || {
            /**
             * The version of Encog that this is.
             * @property property
             * @type String
             * @final
             */
            VERSION: '0.1',

            /**
             * The Encog platform being used.
             * @property property
             * @type String
             * @final
             */
            PLATFORM: 'javascript',

            /**
             * The precision that Encog uses.
             * @property precision
             * @type String
             * @final
             */
            precision: 1e-10,
            /**
             * A newline character.
             * @property property
             * @type String
             * @final
             */
            NEWLINE: '\n',

            /**
             * The Encog type for activation functions.
             * @property ENCOG_TYPE_ACTIVATION
             * @type String
             * @final
             */
            ENCOG_TYPE_ACTIVATION: 'ActivationFunction',

            /**
             * The Encog type for RBF functions.
             * @property ENCOG_TYPE_ACTIVATION
             * @type String
             * @final
             */
            ENCOG_TYPE_RBF: 'RBF'
        };

    /**
     * The namespace function, used to define new namespaces.
     * @param namespaceString The namespace that is to be defined.
     * @method namespace
     * @return {Object} The newly created namespace, or existing one.
     */
    ENCOG.namespace = function (namespaceString) {
        'use strict';

    };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ArrayUtil: The following code provides array utilities for Encog                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * The Encog array utilities.
     * @class ArrayUtil
     * @constructor
     */
    ENCOG.ArrayUtil = function(){
        'use strict';
    };
    /**
     * Fill an array with a specific value.
     * @method fillArray
     * @param arr The array to fill.
     * @param start The starting index.
     * @param stop The stopping index.
     * @param v The value to fill.
     */
    ENCOG.ArrayUtil.fillArray = function (arr, start, stop, v) {
        'use strict';
        var i;

        for (i = start; i < stop; i += 1) {
            arr[i] = v;
        }
    };

    /**
     * Allocate an array of zeros of the specified size.
     * @method allocate1D
     * @param x The size of the array.
     */
    ENCOG.ArrayUtil.allocate1D = function (x) {
        'use strict';
        var i, result;

        result = [];
        for (i = 0; i < x; i += 1) {
            result[i] = 0;
        }

        return result;
    };


    ENCOG.namespace('ENCOG.Drawing');
    ENCOG.Drawing = function () {
        'use strict'
    };

    ENCOG.Drawing.create = function (element, x, y, name,glass) {
        'use strict';
        let result = new ENCOG.Drawing();
        result.y = y;
        result.x = x;
        result.element = element;
        result.canvasDiv = element.component;
        result.canvasWidth = element.width;
        result.canvasHeight = element.height;
        result.glass = glass;

        result.foreign = runtime.create("foreignObject");
        runtime.attrNS(result.foreign,"width",result.canvasWidth);
        runtime.attrNS(result.foreign,"height",result.canvasHeight);
        runtime.attrNS(result.foreign,"x",0);
        runtime.attrNS(result.foreign,"y",0);
        runtime.add(result.canvasDiv,result.foreign);
        result.canvas = runtime.createDOM("canvas");
        runtime.attr(result.canvas,"width",2000);
        runtime.attr(result.canvas,"height",2000);
        runtime.mark(result.canvas,"draw "+name);
        runtime.add(result.foreign,result.canvas);

        result.drawing = [];
        for(var i = 0;i<2000;i++)
        {
            let line = [];
            for(var j = 0;j<2000;j++)
            {
                line.push(0);
            }
            result.drawing.push(line);
        }

        result.started=true;
        return result;
    };

    ENCOG.Drawing.delete = function (glass,element) {
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
            width:2000,
            height:2000,
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
                // This is called when you release the mouse button.
                else if (ev.type === 'mouseup'||control=="mouseup") {

                    if (this.started) {
                        this.started = false;
                        ENCOG.Drawing.delete(this.glass,this.element);
                    }
                }
                /*else if (ev.type === 'mouseout'||control=="mouseout") {
                    if (this.started) {
                        this.started = false;
                        ENCOG.Drawing.delete(this.glass,this.element);
                    }
                }
                /*else if (ev.type === 'touchstart') {
                    this.drawingContext.beginPath();
                    this.drawingContext.moveTo(ev._x, ev._y);
                    this.started = true;
                }
                else if (ev.type === 'touchend') {
                    if (this.started) {
                        this.started = false;
                    }
                }
                else if (ev.type === 'touchmove') {
                    if (this.started) {
                        this.drawingContext.lineTo(ev._x, ev._y);
                        this.drawingContext.stroke();
                        ev.preventDefault();
                    }
                }*/
            },
        // Determine if the specificed horizontal line is clear.
        // This is used to find the top and bottom cropping lines.
        isHLineClear: function (row) {
            for(var i=0;i<this.width-1;i++)
            {
                if(this.drawing[i][row]==1)return false;
            }
            return true;
        },

        // Determine if the specificed vertical line is clear.
        // This is used to find the left and right cropping lines.
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
                result = ENCOG.ArrayUtil.allocate1D(this.downsampleHeight * this.downsampleWidth);
                ENCOG.ArrayUtil.fillArray(result, 0, result.length, -1);
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

    function init_draw(element,x,y,name,callback,e,prod,glass) {
        // clearTimeout();
        let drawingArea;
        let bestchar;
        ondraw=true;
        // Find the canvas element.
        drawingArea = ENCOG.Drawing.create(element,x,y,name,glass);
        preload();

        runtime.addEvent(drawingArea.canvas,'mouseup', function (e) {
            if(numToSend.element=="") numToSend.element=name;
            bestchar = ev_recognize();
            drawingArea.ev_canvas(e, "mouseup");
            numToSend.num += bestchar;
            console.log(numToSend.element + " " + numToSend.num);
            if (numToSend.num == "click") {
                clearTimeout();
                callback(numToSend.num, e, prod);
                numToSend.num = "";
                numToSend.element = "";
            }
            else {
                if (!set) {
                    set=true;
                    setTimeout((function () {
                        console.log("current : " + numToSend.num + " de " + numToSend.element);
                        drawingArea.ev_canvas(e, "mouseup");
                        if (isNaN(parseInt(numToSend.num))) numToSend.num = "";
                        if (numToSend.num != "") callback(numToSend.num, e, prod);
                        numToSend.num = "";
                        numToSend.element = "";
                        ondraw = false;
                        set = false;
                    }), 2500);
                }
            }
        });

        runtime.addEvent(drawingArea.canvas,'mousemove', function (e) {
            drawingArea.ev_canvas(e,"mousemove");
        }, true);
        /*runtime.addEvent(drawingArea.canvas,'touchstart', function (e) {
            drawingArea.ev_canvas(e);
        }, true);
        runtime.addEvent(drawingArea.canvas,'touchend', function (e) {
            drawingArea.ev_canvas(e);
        }, true);
        runtime.addEvent(drawingArea.canvas,'touchmove', function (e) {
            drawingArea.ev_canvas(e);
        }, true);
        runtime.addEvent(drawingArea.canvas,'mouseout', function (e) {
            drawingArea.ev_canvas(e,"mouseout");
        }, true);*/

/////////////////////////////////////////////////////////////////////////////
// Event functions
/////////////////////////////////////////////////////////////////////////////

        // Called when we want to recognize what's been drawn
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

            for (var q in charData[bestChar]) {
                if (q % 5 == 0) {

                    if (charData[bestChar][q] == "-1") {
                        charchosen += "\n0,";
                    } else {
                        charchosen += "\n" + charData[bestChar][q] + ",";
                    }
                } else {
                    if (charData[bestChar][q] == "-1") {
                        charchosen += "0,";
                    } else {
                        charchosen += charData[bestChar][q] + ",";
                    }
                }
            }

            if(bestScore>6.5) bestChar="?";
            drawingArea.clear();
            clearDownSample();
            return bestChar;
        }

        function clearDownSample() {
            downSampleData = ENCOG.ArrayUtil.allocate1D(DOWNSAMPLE_WIDTH * DOWNSAMPLE_HEIGHT);
            ENCOG.ArrayUtil.fillArray(downSampleData, 0, downSampleData.length, -1);
        }
    }


// Preload the digits, so that the user can quickly do some OCR if desired.
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

// Define a character, add it to the list and to the map.
    function defineChar(charEntered, data) {
        charData[charEntered] = data;
    }
    return {
        init_draw : init_draw,
    }
};


