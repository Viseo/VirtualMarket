let SVG = require("../lib/svghandler").SVG;
let assert = require('assert');
let testutil = require("../lib/testutil.js");
let mochRuntime = require("../lib/runtimemock").mochRuntime;
let main = require("../supermarche").main;

let svg = SVG(mochRuntime);
let inspect = testutil.inspect;

describe("Test HelloWorld", function(){
    beforeEach(function(){
        runtime = mochRuntime();
        runtime.declareAnchor("content");
        svg = SVG(runtime);
    })
;    it("ensure that page structure is ok at start ",function(){
        let market = main(svg,"");
        assert.ok(market);
        inspect(market.component,{tag:"svg",width:1500,height:1000,children:[
            {
                tag:"g",transform:"translate(0 0)", id:"header"
            }
        ]

        });
    });

    it ("ensure that header is well found",function(){
        let market = main(svg,"");
        let header = retrieve(market.component,"(header)");
        inspect(header,{tag:"g", width:200 height});
    })

});