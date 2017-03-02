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
    });

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

    it("ensure that clicking on a product add it to the basket and that you can navigate in it",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit 2]");
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit 3]");
        runtime.event(produit,"click",{});
        runtime.event(produit2,"click",{});
        runtime.event(produit,"click",{});
        runtime.event(produit2,"click",{});
        runtime.event(produit,"click",{});
        runtime.event(produit,"click",{});
        runtime.event(produit,"click",{});
        runtime.advanceAll();
        let chevronH = retrieve(market.component,"[basket].[chevronHBasket]");
        let chevronB = retrieve(market.component,"[basket].[chevronBBasket]");
        let panier = retrieve(market.component,"[basket].[listePanier]");
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
        inspect(panier,{tag:"g",transform:"translate(0 -375)"});
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
        runtime.event(chevronH,"click",{});
        runtime.advanceAll();
        runtime.event(chevronH,"click",{});
        runtime.advanceAll();
        runtime.event(chevronH,"click",{});
        runtime.advanceAll();
        runtime.event(chevronH,"click",{});
        runtime.advanceAll();
        inspect(panier,{tag:"g",transform:"translate(0 0)"});

    });

    it("ensure that we can mouseover and mouseout on a categorie",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        let categories2 = retrieve(market.component,"[categories].[Fruits2]");
        let categorieTitle = retrieve(market.component,"[categories].[Fruits title]");
        runtime.event(categories,"mouseenter",{});
        runtime.advanceAll();
        inspect(categories,{tag:"image",href:"img/fruits.jpg",opacity:"0"});
        inspect(categories2,{tag:"image",href:"img/fruits2.jpg",opacity:"1"});
        runtime.event(categorieTitle,"mouseenter",{});
        runtime.advanceAll();
        runtime.event(categories,"mouseout",{});
        runtime.advanceAll();
        inspect(categories,{tag:"image",href:"img/fruits.jpg",opacity:"1"});
        inspect(categories2,{tag:"image",href:"img/fruits2.jpg",opacity:"0"});
    });

    it("ensure that we can mouseover and mouseout on a product",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit2]");
        let produit3 = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit3]");

        runtime.event(produit2,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"405",height:"405"});

        runtime.event(produit2,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"373",height:"373"});

        runtime.event(produit3,"mouseenter");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"405",height:"405"});

        runtime.event(produit3,"mouseout");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"373",height:"373"});
    })

    it("ensure that clicking on a product in the basket print the corresponding section",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        let categories2 = retrieve(market.component,"[categories].[Légumes]");
        runtime.event(categories,"click",{});
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayon].[Produit 2]");
        runtime.advanceAll();
        runtime.event(categories2,"click",{});
        let produit2 = retrieve(market.component,"[Rayon Légumes].[listeRayon].[Produit 3]");
        runtime.event(produit2,"click",{});
        runtime.advanceAll();

        let produitBasket1 = retrieve(market.component,"[basket].[listePanier].[]");
    });

});
