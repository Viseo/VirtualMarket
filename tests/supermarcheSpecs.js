/**
 * Created by MZA3611 on 24/02/2017.
 */
let SVG = require("../lib/svghandler").SVG;
let assert = require("assert");
let testUtil = require ("./testutils");
let mockRuntime = require("../lib/runtimemock").mockRuntime;
let main = require("../supermarche").main;

let runtime;
let svg;
let inspect = testUtil.inspect;
let retrieve = testUtil.retrieve;


describe("Test",function (){
    beforeEach(function(){
        runtime = mockRuntime();
        runtime.declareAnchor("content");
        svg = SVG(runtime);
    });

    it("ensure that page structure is ok at start",function(){
        let market = main(svg,"");
        assert.ok(market);
        inspect(market.component,{tag:"svg",width:1500,height:1000,children:[
            {tag:"g",transform:"translate(0 0)",id:"header"}
        ]});

    });

    it("ensure that header is well formed",function(){
        let market = main(svg,"");
        let header = retrieve(market.component,"[header]");
        inspect(header,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that categories is well formed",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories]");
        inspect(categories,{tag:"g",transform:"translate(0 0)"});
    })

    it("ensure that we can click on fruits and rayon fruits is well formed",function(){
        let market = main(svg,"");
        let categories0 = retrieve(market.component,"[categories].[Produits laitiers]");
        runtime.event(categories0,"click",{});
        let categories1 = retrieve(market.component,"[categories].[Légumes]");
        runtime.event(categories1,"click",{});
        let categories2 = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories2,"click",{});
        let rayon = retrieve(market.component,"[Rayon Fruits]");
        inspect(rayon,{tag:"g",transform:"translate(0 0)"});
    });

     it("ensure that chevronECategorie is working",function(){
         let market = main(svg,"");
         let categories = retrieve(market.component,"[listeCategories]");
         let chevronW = retrieve(market.component,"[categories].[chevronWCategorie]");
         let chevronE= retrieve(market.component,"[categories].[chevronECategorie]");
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronW,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         inspect(categories,{tag:"g",transform:"translate(-1325 0)"});
     });

     it("ensure that chevronWCategorie is working",function(){
         let market = main(svg,"");
         let categories = retrieve(market.component,"[listeCategories]");
         let chevronW = retrieve(market.component,"[categories].[chevronWCategorie]");
         let chevronE= retrieve(market.component,"[categories].[chevronECategorie]");
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronW,"click",{});
         runtime.advanceAll();
         runtime.event(chevronW,"click",{});
         runtime.advanceAll();
         inspect(categories,{tag:"g",transform:"translate(0 0)"});

     });

     it("ensure that chevronERayon is working",function(){
         let market = main(svg,"");
         let categories = retrieve(market.component,"[categories].[Fruits]");
         runtime.event(categories,"click",{});
         let rayon = retrieve(market.component,"[Rayon Fruits].[listeRayon]");
         inspect(rayon,{tag:"g",transform:"translate(0 0)"});
         let chevronE = retrieve(market.component,"[Rayon Fruits].[chevronERayon]");
         let chevronW = retrieve(market.component,"[Rayon Fruits].[chevronWRayon]");
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         runtime.event(chevronW,"click",{});
         runtime.advanceAll();
         runtime.event(chevronE,"click",{});
         runtime.advanceAll();
         inspect(rayon,{tag:"g",transform:"translate(-2475 0)"});

     });

    it("ensure that chevronWRayon is working",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let rayon = retrieve(market.component,"[Rayon Fruits].[listeRayon]");
        inspect(rayon,{tag:"g",transform:"translate(0 0)"});
        let chevronE = retrieve(market.component,"[Rayon Fruits].[chevronERayon]");
        let chevronW = retrieve(market.component,"[Rayon Fruits].[chevronWRayon]");
        runtime.event(chevronE,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW,"click",{});
        runtime.advanceAll();
        inspect(rayon,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that clicking on a product add it to the basket",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit 2]");
        runtime.event(produit,"click",{});
        //let produitBasket = retrieve(market.component,"[].[].[]");
    });

});
