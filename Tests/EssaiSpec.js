let SVG = require("../lib/svghandler").SVG;
let assert = require('assert');
let testutil = require("../lib/testutils");
let mockRuntime = require("../lib/runtimemock").mockRuntime;

let svg = SVG(mockRuntime());
let inspect = testutil.inspect;
let runtime = mockRuntime();
let retrieve = testutil.retrieve;

let buildIHM = function(){
    let drawing = new svg.Drawing(500,500);
    let rect = new svg.Rect(200,200).mark('truc');
    rect.onClick(function(){
        rect.dimension(100,200);
    });
    drawing.add(rect);
    return drawing;
};

describe("Test HelloWorld", function(){
    it("ensure that test tools are opeartional",function(){
        let drawing = buildIHM();
        let rectDOM = retrieve(drawing.component,"[truc]");
        inspect(rectDOM,{tag:"rect",width:200,height:200});
        //rectDOM.handler.dimension(100,200);
        runtime.event(rectDOM,"click",{});
        inspect(rectDOM,{width:100,height:200});
    });

    it("ensures we have 2 tests", function(){
        let drawing = buildIHM();
        let rectDOM = retrieve(drawing.component,"[truc]");
        inspect(rectDOM,{tag:"rect",width:200,height:200});
        //rectDOM.handler.dimension(100,200);
        runtime.event(rectDOM,"click",{});
        inspect(rectDOM,(width=100,height=200));
    });
});