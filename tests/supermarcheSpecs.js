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
         inspect(categories,{tag:"g",transform:"translate(-925 0)"});
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
         let rayon = retrieve(market.component,"[Rayon Fruits].[listeRayonH]");
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
        let rayon = retrieve(market.component,"[Rayon Fruits].[listeRayonH]");
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

        let categories2 = retrieve(market.component,"[categories].[Légumes]");
        runtime.event(categories2,"click",{});
        let rayon2 = retrieve(market.component,"[Rayon Légumes].[listeRayonH]");
        inspect(rayon2,{tag:"g",transform:"translate(0 0)"});
        let chevronW2 = retrieve(market.component,"[Rayon Légumes].[chevronWRayon]");
        let chevronE2 = retrieve(market.component,"[Rayon Légumes].[chevronERayon]");
        runtime.event(chevronE2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronE2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW2,"click",{});
        runtime.advanceAll();
        inspect(rayon2,{tag:"g",transform:"translate(0 0)"});

    });

    it("ensure that clicking on a product add it to the basket and that you can navigate in it",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit 2]");
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit 3]");
        let produit3= retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit 4]");
        let produit4 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit 5]");
        let produit5 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit 6]");
        let produit6 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit 7]");
        let produit7 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit 8]");
        runtime.event(produit,"mousedown",{});
        runtime.advanceAll();
        let vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        inspect(vignette,{tag:"g",transform:"translate(0 0)"});
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit2,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit3,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit4,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit5,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit6,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();

        runtime.event(produit7,"mousedown",{});
        runtime.advanceAll();
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
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
        runtime.event(categories2,"mouseenter",{});
        runtime.advanceAll();
        inspect(categories,{tag:"image",href:"img/categories/fruits.jpg",opacity:"0"});
        inspect(categories2,{tag:"image",href:"img/categories/fruits2.jpg",opacity:"1"});
        runtime.event(categorieTitle,"mouseenter",{});
        runtime.advanceAll();
        runtime.event(categories2,"mouseout",{});
        runtime.advanceAll();
        inspect(categories,{tag:"image",href:"img/categories/fruits.jpg",opacity:"1"});
        inspect(categories2,{tag:"image",href:"img/categories/fruits2.jpg",opacity:"0"});
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        runtime.event(categories2,"mouseenter",{});
        runtime.advanceAll();
        runtime.event(categories2,"mouseout",{});
        runtime.advanceAll();
        runtime.event(categories,"mouseout",{});
        runtime.advanceAll();
    });

    it("ensure that we can mouseover and mouseout on a product and it title",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit2]");
        let produit3 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit3]");
        let title2 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Title2]");
        let title3 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Title3]");

        runtime.event(produit2,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"373",height:"373"});

        runtime.event(produit2,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"345",height:"345"});

        runtime.event(produit3,"mouseenter");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"373",height:"373"});

        runtime.event(produit3,"mouseout");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"345",height:"345"});

        runtime.event(title2,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"373",height:"373"});

        runtime.event(title2,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image",width:"345",height:"345"});

        runtime.event(title3,"mouseenter");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"373",height:"373"});

        runtime.event(title3,"mouseout");
        runtime.advanceAll();
        inspect(produit3,{tag:"image",width:"345",height:"345"});
    });

    it("ensure that clicking on a product in the basket print the corresponding section",function(){
        let market = main(svg,"");
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit 0]");
        runtime.advanceAll();
        runtime.event(produit,"click",{});
        runtime.advanceAll();
        let categories2 = retrieve(market.component,"[categories].[Légumes]");
        runtime.event(categories2,"click",{});
        let produit2 = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[Produit 0]");
        runtime.advanceAll();
        runtime.event(produit2,"click",{});
        runtime.advanceAll();
        let categories3 = retrieve(market.component,"[categories].[Voyages]");
        runtime.event(categories3,"click",{});
        let produitBasket1 = retrieve(market.component,"[basket].[listePanier].[Bananes]");
        let produitBasket2 = retrieve(market.component,"[basket].[listePanier].[Carottes]");
        runtime.event(produitBasket1,"click",{});
        let rayonFruits = retrieve(market.component,"[Rayon Fruits]");
        runtime.advanceAll();
        inspect(rayonFruits,{tag:"g",transform:"translate(0 0)"});
        runtime.event(produitBasket2,"click",{});
        let rayonLegumes = retrieve(market.component,"[Rayon Légumes]");
        runtime.advanceAll();
        inspect(rayonLegumes,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that adding the same product in the basket add it to its quantity ",function(){
        let market = main(svg,"");
        let catMode = retrieve(market.component,"[categories].[Mode]");
        runtime.event(catMode,"click",{});
        let produit = retrieve(market.component,"[Rayon Mode].[listeRayonB].[Produit 1]");
        runtime.advanceAll();
        runtime.event(produit,"mousedown",{});
        let vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();
        let Price = retrieve(market.component,"[basket].[Price]");
        let montre = retrieve(market.component,"[basket].[listePanier].[Montre]");
        inspect(montre,{tag:"image", href:"img/produits/Mode/montre.jpg"});
        inspect(Price,{tag:"text"});
        assert.equal(Price["font-size"], 30);
        runtime.event(produit,"mousedown",{});
        vignette = retrieve(market.component,"[Glass].[GlassVignette]");
        runtime.event(vignette,"mouseup",{});
        runtime.advanceAll();
        let bigPrice = retrieve(market.component,"[basket].[bigPrice]");
        inspect(bigPrice,{tag:"text"});
        assert.equal(bigPrice["font-size"], 25);
        let produit2 = retrieve(market.component,"[Rayon Mode].[listeRayonH].[Produit 0]");
        runtime.event(produit2,"click",{});
        runtime.advanceAll();
        let costume = retrieve(market.component,"[basket].[listePanier].[Costume]");
        inspect(costume,{tag:"image", href:"img/produits/Mode/costume.jpg"})
    });

    it("ensure that drag an item from ray to basket is adding it to the basket ",function(){
        let market = main(svg,"");

    });


});
