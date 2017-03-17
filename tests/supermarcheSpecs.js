/**
 * Created by MZA3611 on 24/02/2017.
 */
let SVG = require("../lib/svghandler").SVG;
let assert = require("assert");
let testUtil = require ("./testutils");
let mockRuntime = require("../lib/runtimemock").mockRuntime;
let main = require("../supermarche").main;
let GUI = require("../lib/svggui").Gui;

let DATA = require("../data").data;
let data = DATA();
var jsonProduits = data.getJson();

let runtime;
let svg;
let inspect = testUtil.inspect;
let retrieve = testUtil.retrieve;
let market;


describe("Test",function (){
    beforeEach(function(){
        runtime = mockRuntime();
        runtime.declareAnchor("content");
        svg = SVG(runtime);
        gui = GUI((svg),"");
        market = main(svg,gui,{jsonData : jsonProduits});
    });

    it("ensure that page structure is ok at start",function(){
        assert.ok(market);
        inspect(market.component,{tag:"svg",width:1500,height:1000,children:[
            {tag:"g",transform:"translate(0 0)",id:"categories"}
        ]});
    });

    it("ensure that header is well formed",function(){
        let header = retrieve(market.component,"[header]");
        inspect(header,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that categories is well formed",function(){
        let categories = retrieve(market.component,"[categories]");
        inspect(categories,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that we can click on fruits and rayon fruits is well formed",function(){
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
         inspect(rayon,{tag:"g",transform:"translate(-1725 0)"});

     });

    it("ensure that chevronWRayon is working",function(){
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
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});

        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Bananes]");
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit Citron vert]");
        let produit3= retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Framboises]");
        let produit4 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit Fraises]");
        let produit5 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Clementines]");
        let produit6 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit Kiwi]");
        let produit7 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Mangue]");

        //let glass = retrieve(market.component,"[Glass]");
        let panier = retrieve(market.component,"[basket]");
        let listePanier = retrieve(market.component,"[basket].[listePanier]");

        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        assert.ok(tmp);
        runtime.event(tmp,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let panierProd = retrieve(market.component,"[basket].[listePanier].[Bananes]");
        assert.ok(panierProd);

        runtime.event(produit2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp2 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[tmp]");
        runtime.event(tmp2,"mousedown",{ pageX:10, pageY:800});
        runtime.event(tmp2,"mousemove",{ pageX:market.width*0.95, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmp2,"mouseup",{ pageX:market.width*0.95, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(produit3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp3 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        runtime.event(tmp3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(produit4,"mousedown",{ pageX:5, pageY:5});
        let tmp4 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[tmp]");
        runtime.advanceAll();
        runtime.event(tmp4,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(produit5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp5 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        runtime.event(tmp5,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(produit6,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp6 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[tmp]");
        runtime.event(tmp6,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(produit7,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp7 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        runtime.event(tmp7,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        //console.log(listePanier);

        let chevronH = retrieve(market.component,"[basket].[chevronHBasket]");
        let chevronB = retrieve(market.component,"[basket].[chevronBBasket]");
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
        inspect(listePanier,{tag:"g",transform:"translate(0 -373)"});
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
        inspect(listePanier,{tag:"g",transform:"translate(0 2)"});
    });

    it("ensure that we can mouseover and mouseout on a categorie",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        let categories2 = retrieve(market.component,"[categories].[Fruits2]");
        let categorieTitle = retrieve(market.component,"[categories].[Fruits title]");
        runtime.event(categories,"mouseenter",{});
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
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let produit2 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Clementines].[Image Clementines]");
        let produit3 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit Fraises].[Image Fraises]");
        let title2 = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Clementines].[Title Clementines]");
        let title3 = retrieve(market.component,"[Rayon Fruits].[listeRayonB].[Produit Fraises].[Title Fraises]");

        runtime.event(produit2,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(produit2,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(produit3,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(produit3,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(title2,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(title2,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(title3,"mouseenter");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});

        runtime.event(title3,"mouseout");
        runtime.advanceAll();
        inspect(produit2,{tag:"image"});
    });

    it("ensure that clicking on a product in the basket print the corresponding section",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Bananes]");
        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        assert.ok(tmp);
        runtime.event(tmp,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let categories2 = retrieve(market.component,"[categories].[Légumes]");
        runtime.event(categories2,"click",{});

        let produit2 = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[Produit Carottes]");
        runtime.event(produit2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp2 = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[tmp]");
        runtime.event(tmp2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let produit3 = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[Produit Concombre]");
        runtime.event(produit3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp3 = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[tmp]");
        runtime.event(tmp3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(produit3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp3bis = retrieve(market.component,"[Rayon Légumes].[listeRayonH].[tmp]");
        runtime.event(tmp3bis,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let produit4 = retrieve(market.component,"[Rayon Légumes].[listeRayonB].[Produit Oignon]");
        runtime.event(produit4,"mousedown",{ pageX:5, pageY:5});
        let tmp4 = retrieve(market.component,"[Rayon Légumes].[listeRayonB].[tmp]");
        runtime.advanceAll();
        runtime.event(tmp4,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let produit5 = retrieve(market.component,"[Rayon Légumes].[listeRayonB].[Produit Tomates]");
        runtime.event(produit5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp5 = retrieve(market.component,"[Rayon Légumes].[listeRayonB].[tmp]");
        runtime.event(tmp5,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(categories,"click",{});
        let basketProduct1 = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes]");
        runtime.event(basketProduct1,"mousedown",{ pageX:10, pageY:10});
        runtime.advanceAll();
        let tmpBasket = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket,"mouseup",{ pageX:10, pageY:10});
        runtime.advanceAll();

        runtime.event(categories,"click",{});
        runtime.event(basketProduct1,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket2 = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket2,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket2,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket2,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(basketProduct1,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket4 = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket4,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket4,"mousemove",{ pageX:100, pageY:100});
        runtime.advanceAll();
        runtime.event(tmpBasket4,"mouseup",{ pageX:100, pageY:100});
        runtime.advanceAll();

        let basketProduct3 = retrieve(market.component,"[basket].[listePanier].[Produit panier Tomates]");
        runtime.event(basketProduct3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket3 = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket3,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket3,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket3,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        let basketProduct5 = retrieve(market.component,"[basket].[listePanier].[Produit panier Concombre]");
        runtime.event(basketProduct5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket5 = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket5,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket5,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket5,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(basketProduct5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket6 = retrieve(market.component,"[basket].[listePanier].[tmp]");
        runtime.event(tmpBasket6,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket6,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket6,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        let chevronB = retrieve(market.component,"[basket].[chevronBBasket]");
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
    });

    it("ensure that hoovering a product in the basket add a red cross, and that clicking on it delete this product from the basket",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let produit = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[Produit Bananes]");
        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp = retrieve(market.component,"[Rayon Fruits].[listeRayonH].[tmp]");
        assert.ok(tmp);
        runtime.event(tmp,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let imagePanier = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes].[Bananes]");
        let fondPanier = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes].[fond Bananes]");
        let titlePanier = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes].[title Bananes]");
        let crossPanier = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes].[cross Bananes]");
        let compPanier = retrieve(market.component,"[basket].[listePanier].[Produit panier Bananes]");

        runtime.event(imagePanier,"mouseenter");
        runtime.advanceAll();
        runtime.event(fondPanier,"mouseenter");
        runtime.advanceAll();
        runtime.event(compPanier,"mouseout");
        runtime.advanceAll();
        runtime.event(titlePanier,"mouseenter");
        runtime.advanceAll();
        runtime.event(crossPanier,"mouseenter");
        runtime.advanceAll();

        runtime.event(compPanier,"mousedown",{ pageX:10, pageY:10});
        runtime.advanceAll();
        let crossTmp = retrieve(market.component,"[basket].[listePanier].[tmp].[cross]");
        runtime.event(crossTmp,"mouseup",{ pageX:10, pageY:10});
    });


    it("ensure that adding the same product in the basket is working ",function(){
        let catMode = retrieve(market.component,"[categories].[Mode]");
        runtime.event(catMode,"click",{});

        let produit = retrieve(market.component,"[Rayon Mode].[listeRayonB].[Produit Montre]");
        runtime.advanceAll();
        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp = retrieve(market.component,"[Rayon Mode].[listeRayonB].[tmp]");
        runtime.event(tmp,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let Price = retrieve(market.component,"[basket].[Price]");
        let montre = retrieve(market.component,"[basket].[listePanier].[Produit panier Montre]");
        inspect(montre,{tag:"g"});
        inspect(Price,{tag:"text"});
        assert.equal(Price["font-size"], 30);
        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp2 = retrieve(market.component,"[Rayon Mode].[listeRayonB].[tmp]");
        runtime.event(tmp2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let bigPrice = retrieve(market.component,"[basket].[bigPrice]");
        inspect(bigPrice,{tag:"text"});
        assert.equal(bigPrice["font-size"], 25);

        let produit2 = retrieve(market.component,"[Rayon Mode].[listeRayonH].[Produit Costume]");
        runtime.advanceAll();
        runtime.event(produit2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp3 = retrieve(market.component,"[Rayon Mode].[listeRayonH].[tmp]");
        runtime.event(tmp3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let costume = retrieve(market.component,"[basket].[listePanier].[Produit panier Costume]");
        inspect(costume,{tag:"g"});
    });

    it("ensure that drag an item from ray to the void is not adding it to the basket ",function(){
        let catMode = retrieve(market.component,"[categories].[Mode]");
        runtime.event(catMode,"click",{});
        let produit = retrieve(market.component,"[Rayon Mode].[listeRayonB].[Produit Montre]");
        runtime.advanceAll();
        runtime.event(produit,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmp = retrieve(market.component,"[Rayon Mode].[listeRayonB].[tmp]");
        runtime.event(tmp,"mouseup",{ pageX:500, pageY:500});
        runtime.advanceAll();
        let montre = retrieve(market.component,"[basket].[listePanier].[Montre]");
        assert.ok(!montre);
    });
});
