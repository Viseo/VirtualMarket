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

let runtime;
let svg;
let inspect = testUtil.inspect;
let retrieve = testUtil.retrieve;
let market;

describe("Test",function (){
    this.timeout(30000);
    beforeEach(function(){
        runtime = mockRuntime();
        runtime.declareAnchor("content");
        svg = SVG(runtime);
        gui = GUI((svg),"");
        market = main(svg,gui,{data});
    });

    it("ensure that page structure is ok at start",function(){
        assert.ok(market);
        inspect(market.component,{tag:"svg",width:1500,height:1000,children:[
            {tag:"g",transform:"translate(0 0)",id:"categories"}
        ]});

        let defaultRay = retrieve(market.component,"[ray HighTech]");
        assert.ok(defaultRay);
    });

    it("ensure that header is well formed",function(){
        let header = retrieve(market.component,"[header]");
        inspect(header,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that categories is well formed",function(){
        let categories = retrieve(market.component,"[categories]");
        inspect(categories,{tag:"g",transform:"translate(0 0)"});
    });

    it("ensure that we can click on fruits and ray fruits is well formed",function(){
        let categoriesMilk = retrieve(market.component,"[categories].[Produits laitiers]");
        runtime.event(categoriesMilk,"click",{});
        let categoriesVegetables = retrieve(market.component,"[categories].[Legumes]");
        runtime.event(categoriesVegetables,"click",{});
        let categoriesFruits = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categoriesFruits,"click",{});
        let ray = retrieve(market.component,"[ray Fruits]");
        inspect(ray,{tag:"g",transform:"translate(0 0)"});
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

     it("ensure that chevronEray is working",function(){
         let categories = retrieve(market.component,"[categories].[Fruits]");
         runtime.event(categories,"click",{});
         let ray = retrieve(market.component,"[ray Fruits].[listRayUp]");
         inspect(ray,{tag:"g",transform:"translate(0 0)"});
         let chevronE = retrieve(market.component,"[ray Fruits].[chevronERay]");
         let chevronW = retrieve(market.component,"[ray Fruits].[chevronWRay]");
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
         inspect(ray,{tag:"g",transform:"translate(-2475 0)"});

     });

    it("ensure that chevronWray is working",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        let ray = retrieve(market.component,"[ray Fruits].[listRayUp]");
        inspect(ray,{tag:"g",transform:"translate(0 0)"});
        let chevronE = retrieve(market.component,"[ray Fruits].[chevronERay]");
        let chevronW = retrieve(market.component,"[ray Fruits].[chevronWRay]");
        runtime.event(chevronE,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW,"click",{});
        runtime.advanceAll();
        inspect(ray,{tag:"g",transform:"translate(0 0)"});

        let categories2 = retrieve(market.component,"[categories].[Legumes]");
        runtime.event(categories2,"click",{});
        let ray2 = retrieve(market.component,"[ray Legumes].[listRayUp]");
        inspect(ray2,{tag:"g",transform:"translate(0 0)"});
        let chevronW2 = retrieve(market.component,"[ray Legumes].[chevronWRay]");
        let chevronE2 = retrieve(market.component,"[ray Legumes].[chevronERay]");
        runtime.event(chevronE2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronE2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW2,"click",{});
        runtime.advanceAll();
        runtime.event(chevronW2,"click",{});
        runtime.advanceAll();
        inspect(ray2,{tag:"g",transform:"translate(0 0)"});

    });

    /*
    it("ensure that clicking on a product add it to the basket and that you can navigate in it",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});

        let product = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Banane]");
        let product2 = retrieve(market.component,"[ray Fruits].[listRayDown].[Product Citron vert]");
        let product3= retrieve(market.component,"[ray Fruits].[listRayUp].[Product Framboise]");
        let product4 = retrieve(market.component,"[ray Fruits].[listRayDown].[Product Fraise]");
        let product5 = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Clementine]");
        let product6 = retrieve(market.component,"[ray Fruits].[listRayDown].[Product Kiwi]");
        let product7 = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Mangue]");

        let listBasket = retrieve(market.component,"[basket].[listBasket]");
        assert.ok(listBasket);
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let basketProd = retrieve(market.component,"[basket].[listBasket].[Banane]");
        assert.ok(basketProd);

        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged2 = retrieve(market.component,"[ray Fruits].[listRayDown].[dragged]");
        runtime.event(dragged2,"mousedown",{ pageX:10, pageY:800});
        runtime.event(dragged2,"mousemove",{ pageX:market.width*0.95, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(dragged2,"mouseup",{ pageX:market.width*0.95, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(product3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged3 = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        runtime.event(dragged3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product4,"mousedown",{ pageX:5, pageY:5});
        let dragged4 = retrieve(market.component,"[ray Fruits].[listRayDown].[dragged]");
        runtime.advanceAll();
        runtime.event(dragged4,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged5 = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        runtime.event(dragged5,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product6,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged6 = retrieve(market.component,"[ray Fruits].[listRayDown].[dragged]");
        runtime.event(dragged6,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product7,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged7 = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        runtime.event(dragged7,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        //console.log(listBasket);

        let chevronH = retrieve(market.component,"[basket].[chevronUpBasket]");
        let chevronB = retrieve(market.component,"[basket].[chevronDownBasket]");
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
        inspect(listBasket,{tag:"g",transform:"translate(0 -373)"});
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
        inspect(listBasket,{tag:"g",transform:"translate(0 2)"});
    });*/

    it("ensure that we can mousehover and mouseout on a categorie",function(){
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
        let product2 = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Clementine].[Image Clementine]");
        let product3 = retrieve(market.component,"[ray Fruits].[listRayDown].[Product Fraise].[Image Fraise]");
        let title2 = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Clementine].[Title Clementine]");
        let title3 = retrieve(market.component,"[ray Fruits].[listRayDown].[Product Fraise].[Title Fraise]");

        runtime.event(product2,"mouseenter");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(product2,"mouseout");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(product3,"mouseenter");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(product3,"mouseout");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(title2,"mouseenter");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(title2,"mouseout");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(title3,"mouseenter");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});

        runtime.event(title3,"mouseout");
        runtime.advanceAll();
        inspect(product2,{tag:"image"});
    });

    /*it("ensure that clicking on a product in the basket print the corresponding section",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let product = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Banane]");
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let categories2 = retrieve(market.component,"[categories].[Legumes]");
        runtime.event(categories2,"click",{});

        let product2 = retrieve(market.component,"[ray Legumes].[listRayUp].[Product Carotte]");
        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged2 = retrieve(market.component,"[ray Legumes].[listRayUp].[dragged]");
        runtime.event(dragged2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let product3 = retrieve(market.component,"[ray Legumes].[listRayUp].[Product Concombre]");
        runtime.event(product3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged3 = retrieve(market.component,"[ray Legumes].[listRayUp].[dragged]");
        runtime.event(dragged3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged3bis = retrieve(market.component,"[ray Legumes].[listRayUp].[dragged]");
        runtime.event(dragged3bis,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let product4 = retrieve(market.component,"[ray Legumes].[listRayDown].[Product Oignon]");
        runtime.event(product4,"mousedown",{ pageX:5, pageY:5});
        let dragged4 = retrieve(market.component,"[ray Legumes].[listRayDown].[dragged]");
        runtime.advanceAll();
        runtime.event(dragged4,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let product5 = retrieve(market.component,"[ray Legumes].[listRayDown].[Product Tomate]");
        runtime.event(product5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged5 = retrieve(market.component,"[ray Legumes].[listRayDown].[dragged]");
        runtime.event(dragged5,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(categories,"click",{});
        let basketproduct1 = retrieve(market.component,"[basket].[listBasket].[Product basket Banane]");
        runtime.event(basketproduct1,"mousedown",{ pageX:10, pageY:10});
        runtime.advanceAll();
        let draggedBasket = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(draggedBasket,"mouseup",{ pageX:10, pageY:10});
        runtime.advanceAll();

        runtime.event(categories,"click",{});
        runtime.event(basketproduct1,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let tmpBasket2 = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(tmpBasket2,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket2,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket2,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(basketproduct1,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let draggedBasket4 = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(draggedBasket4,"mousedown",{ pageX:10, pageY:10});
        runtime.event(draggedBasket4,"mousemove",{ pageX:100, pageY:100});
        runtime.advanceAll();
        runtime.event(draggedBasket4,"mouseup",{ pageX:100, pageY:100});
        runtime.advanceAll();

        let basketproduct3 = retrieve(market.component,"[basket].[listBasket].[Product basket Tomate]");
        runtime.event(basketproduct3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let draggedBasket3 = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(draggedBasket3,"mousedown",{ pageX:10, pageY:10});
        runtime.event(draggedBasket3,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(draggedBasket3,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        let basketproduct5 = retrieve(market.component,"[basket].[listBasket].[Product basket Concombre]");
        runtime.event(basketproduct5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let draggedBasket5 = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(draggedBasket5,"mousedown",{ pageX:10, pageY:10});
        runtime.event(draggedBasket5,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(draggedBasket5,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        runtime.event(basketproduct5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let draggedBasket6 = retrieve(market.component,"[basket].[listBasket].[dragged]");
        runtime.event(draggedBasket6,"mousedown",{ pageX:10, pageY:10});
        runtime.event(draggedBasket6,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(draggedBasket6,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();

        let chevronB = retrieve(market.component,"[basket].[chevronDownBasket]");
        runtime.event(chevronB,"click",{});
        runtime.advanceAll();
    });*/

    /*it("ensure that hoovering a product in the basket add a red cross, and that clicking on it delete this product from the basket",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let product = retrieve(market.component,"[ray Fruits].[listRayUp].[Product Banane]");
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged = retrieve(market.component,"[ray Fruits].[listRayUp].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let imagebasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[Banane]");
        let fondbasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[background Banane]");
        let titlebasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[title Banane]");
        let crossbasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[cross Banane]");
        let compbasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane]");

        runtime.event(imagebasket,"mouseenter");
        runtime.advanceAll();
        runtime.event(fondbasket,"mouseenter");
        runtime.advanceAll();
        runtime.event(compbasket,"mouseout");
        runtime.advanceAll();
        runtime.event(titlebasket,"mouseenter");
        runtime.advanceAll();
        runtime.event(crossbasket,"mouseenter");
        runtime.advanceAll();

        runtime.event(compbasket,"mousedown",{ pageX:10, pageY:10});
        runtime.advanceAll();
        let crossDragged = retrieve(market.component,"[basket].[listBasket].[dragged].[cross]");
        runtime.event(crossDragged,"mouseup",{ pageX:10, pageY:10});
    });*/


  /*  it("ensure that adding the same product in the basket is working ",function(){
        let catMode = retrieve(market.component,"[categories].[Mode]");
        runtime.event(catMode,"click",{});

        let product = retrieve(market.component,"[ray Mode].[listRayDown].[Product Montre]");
        runtime.advanceAll();
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged = retrieve(market.component,"[ray Mode].[listRayDown].[dragged]");
        runtime.event(dragged,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let Price = retrieve(market.component,"[basket].[Price]");
        let montre = retrieve(market.component,"[basket].[listBasket].[Product basket Montre]");
        inspect(montre,{tag:"g"});
        inspect(Price,{tag:"text"});
        assert.equal(Price["font-size"], 37.5);
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged2 = retrieve(market.component,"[ray Mode].[listRayDown].[dragged]");
        runtime.event(dragged2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let bigPrice = retrieve(market.component,"[basket].[bigPrice]");
        inspect(bigPrice,{tag:"text"});
        assert.equal(bigPrice["font-size"], 30);

        let product2 = retrieve(market.component,"[ray Mode].[listRayUp].[Product Costume]");
        runtime.advanceAll();
        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged3 = retrieve(market.component,"[ray Mode].[listRayUp].[dragged]");
        runtime.event(dragged3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let costume = retrieve(market.component,"[basket].[listBasket].[Product basket Costume]");
        inspect(costume,{tag:"g"});
    });*/

    it("ensure that you can drag the card in the terminal and that it shows the payement interface",function(){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);
        runtime.event(card,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let dragged = retrieve(market.component,"[payment].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        let dragged3 = retrieve(market.component,"[payment].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged3,"mousemove",{pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(dragged3,"mouseup",{ pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        let dragged2 = retrieve(market.component,"[payment].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged2,"mousemove",{pageX:market.width*0.80+60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(dragged2,"mouseup",{ pageX:market.width*0.80+60,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.90,pageY:market.height*0.90});
        runtime.advanceAll();
        let dragged4 = retrieve(market.component,"[payment].[dragged]");
        assert.ok(dragged);
        runtime.event(dragged4,"mousemove",{pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(dragged4,"mouseup",{ pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();
    });

    it("ensure that the interface to enter the code pattern is working",function(done){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        let dragged2 = retrieve(market.component,"[payment].[dragged]");
        assert.ok(dragged2);
        runtime.event(dragged2,"mousemove",{pageX:market.width*0.80+60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(dragged2,"mouseup",{ pageX:market.width*0.80+60,pageY:market.height*0.90});
        runtime.advanceAll();

        let code = retrieve(market.component,"[code]");
        assert.ok(code);
        let buttonGroup = retrieve(market.component,"[code].[buttonGroup]");
        assert.ok(buttonGroup);
        let button1 = retrieve(market.component,"[code].[buttonGroup].[button1]");
        assert.ok(button1);
        let button2 = retrieve(market.component,"[code].[buttonGroup].[button2]");
        assert.ok(button2);
        let button3 = retrieve(market.component,"[code].[buttonGroup].[button3]");
        assert.ok(button3);

        runtime.event(code, "mousemove", {pageX:100,pageY:100});
        runtime.advanceAll();
        runtime.event(code, "mouseup", {pageX: 5, pageY: 5});
        runtime.advanceAll();
        runtime.event(code, "mousedown", {pageX: 5, pageY: 5});
        runtime.advanceAll();
        runtime.event(code, "mousemove", {pageX:100,pageY:100});
        runtime.advanceAll();
        runtime.event(button2, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(code, "mousemove", {pageX:100,pageY:100});
        runtime.advanceAll();
        runtime.event(code, "mouseup", {pageX: 5, pageY: 5});
        runtime.advanceAll();

        for(let i = 0;i<3;i++) {
            runtime.event(code, "mousedown", {pageX: 5, pageY: 5});
            runtime.advanceAll();
            runtime.event(button2, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button1, "mouseout", {});
            runtime.advanceAll();
            runtime.event(button2, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button3, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button2, "mouseout", {});
            runtime.advanceAll();
            runtime.event(code, "mouseup", {pageX: 5, pageY: 5});
            runtime.advanceAll();
        }


        let button4 = retrieve(market.component,"[code].[buttonGroup].[button4]");
        assert.ok(button4);
        let button5 = retrieve(market.component,"[code].[buttonGroup].[button5]");
        assert.ok(button5);
        let button6 = retrieve(market.component,"[code].[buttonGroup].[button6]");
        assert.ok(button6);
        let button7 = retrieve(market.component,"[code].[buttonGroup].[button7]");
        assert.ok(button7);
        let button8 = retrieve(market.component,"[code].[buttonGroup].[button8]");
        assert.ok(button8);
        let button9 = retrieve(market.component,"[code].[buttonGroup].[button9]");
        assert.ok(button9);
        //Password ok
            runtime.event(code, "mousedown", {pageX: 5, pageY: 5});
            runtime.advanceAll();
            runtime.event(button3, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button2, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button1, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button4, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button5, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button6, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button9, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button8, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(button7, "mouseenter", {});
            runtime.advanceAll();
            runtime.event(code, "mouseup", {pageX: 5, pageY: 5});
            runtime.advanceAll();


            //Test the red cross to quit
            runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
            runtime.advanceAll();
            let dragged3 = retrieve(market.component,"[payment].[dragged]");
            assert.ok(dragged3);
            runtime.event(dragged3,"mousemove",{pageX:market.width*0.80+60,pageY:market.height*0.90});
            runtime.advanceAll();
            runtime.event(dragged3,"mouseup",{ pageX:market.width*0.80+60,pageY:market.height*0.90});
            runtime.advanceAll();
            let cross = retrieve(market.component,"[code].[cross]");
            runtime.event(cross, "click", {});
            runtime.advanceAll();
            // setTimeout(function(){
            //     done();
            // },15000);
            done();
    });

    it("ensure that the interface to enter the code pattern is working with touch event",function(done){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);

        runtime.event(card,"touchstart",{touches:{0:{clientX:market.width*0.80+5,clientY:market.height*0.5}}});
        runtime.advanceAll();
        runtime.event(card,"touchmove",{touches:{0:{clientX:market.width*0.95+10,clientY:market.height*0.90}}});
        runtime.advanceAll();
        runtime.event(card,"touchmove",{touches:{0:{clientX:market.width*0.95+1000,clientY:market.height*0.90}}});
        runtime.advanceAll();
        runtime.event(card,"touchmove",{touches:{0:{clientX:market.width*0.95+1000,clientY:market.height*0.90}}});
        runtime.advanceAll();

        let code = retrieve(market.component,"[code]");
        assert.ok(code);
        let buttonGroup = retrieve(market.component,"[code].[buttonGroup]");
        assert.ok(buttonGroup);
        let button1 = retrieve(market.component,"[code].[buttonGroup].[button1]");
        assert.ok(button1);
        let button2 = retrieve(market.component,"[code].[buttonGroup].[button2]");
        assert.ok(button2);
        let button3 = retrieve(market.component,"[code].[buttonGroup].[button3]");
        assert.ok(button3);

        runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
        runtime.event(code, "touchstart", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();
        runtime.event(button2, "touchmove", {touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();
        runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();


        for(let i = 0;i<3;i++) {
            runtime.event(code, "touchstart", {touches:{0:{clientX: 5, clientY: 5}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.width/2,clientY:market.height/2}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.height/2,clientY:market.height/2}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.height/2+market.payment.zoneCode.tabButtons[0].gapX,
                clientY:market.height/2}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:100,clientY:100}}});
            runtime.advanceAll();
            runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
            runtime.advanceAll();
        }

         // setTimeout(function(){
         //    done();
         // },15000);

        runtime.event(code, "touchstart", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[2].gapX,
                                                        clientY:market.height/2-market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[1].gapX,
                                                        clientY:market.height/2-market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[0].gapX,
                                                        clientY:market.height/2-market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[3].gapX,
                                                        clientY:market.height/2}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[4].gapX,
                                                        clientY:market.height/2}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[5].gapX,
                                                        clientY:market.height/2}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[8].gapX,
                                                        clientY:market.height/2+market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[7].gapX,
                                                        clientY:market.height/2+market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.x+market.payment.zoneCode.tabButtons[6].gapX,
                                                        clientY:market.height/2+market.payment.zoneCode.tabButtons[0].gapY}}});
        runtime.advanceAll();
        runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
        done();
    });

    it("ensures that we can click on the micro", function(){
        let header = retrieve(market.component,"[header]");
        let micro = retrieve(market.component, "[header].[micro]");
        assert(header);
        assert(micro);
        runtime.event(micro,"click",{});
        let raySearch = retrieve(market.component, "[raySearch]");
        assert(raySearch);
    });
});
