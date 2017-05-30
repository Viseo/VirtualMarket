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
let NEURAL = require("../neuralNetDrawing").neural;
let neural = NEURAL(mockRuntime());

let runtime;
let svg;
let inspect = testUtil.inspect;
let retrieve = testUtil.retrieve;
let market;

describe("Test",function (){
    this.timeout(50000);
    beforeEach(function(){
        runtime = mockRuntime();
        runtime.declareAnchor("content");
        svg = SVG(runtime);
        gui = GUI((svg),"");
        market = main(svg,gui,{data},neural,mockRuntime());
        market.changeRay("HighTech");
    });

    it("ensure that page structure is ok at start",function(){
        assert.ok(market);
        inspect(market.component,{tag:"svg",width:1500,height:1000,children:[
            {tag:"g",transform:"translate(0 0)"}
        ]});

        let defaultRay = retrieve(market.component,"[ray HighTech]");
        assert.ok(defaultRay);
    });

    it("ensure that header is well formed",function(){
        let header = retrieve(market.component,"[header]");
        inspect(header,{tag:"g",transform:"translate(0 0)"});
        let logo = retrieve(header,"[logo]");
        runtime.event(logo,"click",{});
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

    // it("ensure that chevronE ray is working",function(){
    //     let categories = retrieve(market.component,"[categories].[Fruits]");
    //     runtime.event(categories,"click",{});
    //     let ray = retrieve(market.component,"[ray Fruits].[listRay]");
    //     inspect(ray,{tag:"g",transform:"translate(0 0)"});
    //     let chevronE = retrieve(market.component,"[ray Fruits].[chevronERay]");
    //     let chevronW = retrieve(market.component,"[ray Fruits].[chevronWRay]");
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronW,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     inspect(ray,{tag:"g",transform:"translate(-746.6999999999997 0)"});
    //
    // });
    //
    // it("ensure that chevronW ray is working",function(){
    //     let categories = retrieve(market.component,"[categories].[Fruits]");
    //     runtime.event(categories,"click",{});
    //     let ray = retrieve(market.component,"[ray Fruits].[listRay]");
    //     inspect(ray,{tag:"g",transform:"translate(0 0)"});
    //     let chevronE = retrieve(market.component,"[ray Fruits].[chevronERay]");
    //     let chevronW = retrieve(market.component,"[ray Fruits].[chevronWRay]");
    //     runtime.event(chevronE,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronW,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronW,"click",{});
    //     runtime.advanceAll();
    //     inspect(ray,{tag:"g",transform:"translate(0 0)"});
    //
    //     let categories2 = retrieve(market.component,"[categories].[Mode]");
    //     runtime.event(categories2,"click",{});
    //     let ray2 = retrieve(market.component,"[ray Mode].[listRay]");
    //     inspect(ray2,{tag:"g",transform:"translate(0 0)"});
    //     let chevronW2 = retrieve(market.component,"[ray Mode].[chevronWRay]");
    //     let chevronE2 = retrieve(market.component,"[ray Mode].[chevronERay]");
    //     runtime.event(chevronE2,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronE2,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronW2,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(chevronW2,"click",{});
    //     runtime.advanceAll();
    //     inspect(ray2,{tag:"g",transform:"translate(0 0)"});
    //
    // });

    it("ensure that clicking on a product add it to the basket and that you can navigate in it",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});

        let canv = retrieve(market.component,"[glassCanvas]");
        assert(canv);

        let product = retrieve(market.component,"[ray Fruits].[listRay].[Product Banane]");
        let product2 = retrieve(market.component,"[ray Fruits].[listRay].[Product Citron vert]");
        let product3= retrieve(market.component,"[ray Fruits].[listRay].[Product Framboise]");
        let product4 = retrieve(market.component,"[ray Fruits].[listRay].[Product Fraise]");
        let product5 = retrieve(market.component,"[ray Fruits].[listRay].[Product Clementine]");
        let product6 = retrieve(market.component,"[ray Fruits].[listRay].[Product Kiwi]");
        let product7 = retrieve(market.component,"[ray Fruits].[listRay].[Product Mangue]");
        let product8 = retrieve(market.component,"[ray Fruits].[listRay].[Product Cerise]");
        let product9 = retrieve(market.component,"[ray Fruits].[listRay].[Product Ananas]");

        let listBasket = retrieve(market.component,"[basket].[listBasket]");
        assert.ok(listBasket);
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing = retrieve(market.component,"[glassCanvas].[draw Banane]");
        assert(drawing);
        runtime.event(drawing,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert(retrieve(market.component,"[mainPage].[basket].[listBasket].[Banane]"));
        runtime.advanceAll();

        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing2 = retrieve(market.component,"[draw Citron vert]");
        assert(drawing2);
        runtime.event(drawing2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let basketProd2 = retrieve(market.component,"[basket].[listBasket].[Citron vert]");
        assert.ok(basketProd2);

        runtime.event(product3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing3 = retrieve(market.component,"[draw Framboise]");
        assert(drawing3);
        runtime.event(drawing3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product4,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing4 = retrieve(market.component,"[draw Fraise]");
        assert(drawing4);
        runtime.event(drawing4,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product5,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing5 = retrieve(market.component,"[draw Clementine]");
        assert(drawing5);
        runtime.event(drawing5,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product6,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing6 = retrieve(market.component,"[draw Kiwi]");
        assert(drawing6);
        runtime.event(drawing6,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product7,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing7 = retrieve(market.component,"[draw Mangue]");
        assert(drawing7);
        runtime.event(drawing7,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product8,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing8 = retrieve(market.component,"[draw Cerise]");
        assert(drawing8);
        runtime.event(drawing8,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(product9,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing9 = retrieve(market.component,"[draw Ananas]");
        assert(drawing9);
        runtime.event(drawing9,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        //mouseup
        let basket = retrieve(market.component,'[basket]');
        assert(basket);
        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:100});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:1500});
        runtime.advanceAll();
        runtime.event(basket,"mouseup",{pageX:5,pageY:1500});
        runtime.advanceAll();

        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:100});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:-1500});
        runtime.advanceAll();
        runtime.event(basket,"mouseup",{pageX:5,pageY:-1500});
        runtime.advanceAll();

        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:10});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:10});
        runtime.advanceAll();
        runtime.event(basket,"mouseup",{pageX:5,pageY:10});
        runtime.advanceAll();

        //mouseout
        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:100});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:1500});
        runtime.advanceAll();
        runtime.event(basket,"mouseout",{pageX:5,pageY:1500});
        runtime.advanceAll();

        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:100});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:-1500});
        runtime.advanceAll();
        runtime.event(basket,"mouseout",{pageX:5,pageY:-1500});
        runtime.advanceAll();

        runtime.event(basketProd2,"mousedown",{type:"mousedown",pageX:5,pageY:5});
        runtime.advanceAll();
        runtime.event(basketProd2,"mousemove",{pageX:5,pageY:10});
        runtime.advanceAll();
        runtime.event(basket,"mousemove",{pageX:5,pageY:10});
        runtime.advanceAll();
        runtime.event(basket,"mouseout",{pageX:5,pageY:10});
        runtime.advanceAll();

        //Touch
        runtime.event(basketProd2,"touchstart",{type:"",touches:{0:{clientX:5,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:10}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:1500}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchend",{touches:{0:{clientX:5,clientY:1500}}});
        runtime.advanceAll();

        runtime.event(basketProd2,"touchstart",{touches:{0:{clientX:5,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:100}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:-1500}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchend",{touches:{0:{clientX:5,clientY:-1500}}});
        runtime.advanceAll();

        runtime.event(basketProd2,"touchstart",{touches:{0:{clientX:5,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:10}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchmove",{touches:{0:{clientX:5,clientY:10}}});
        runtime.advanceAll();
        runtime.event(basketProd2,"touchend",{touches:{0:{clientX:5,clientY:10}}});
        runtime.advanceAll();
    });

    // it("ensure that we can mousehover and mouseout on a categorie",function(){
    //     let categories = retrieve(market.component,"[categories].[Fruits]");
    //     let categories2 = retrieve(market.component,"[categories].[Fruits2]");
    //     let categorieTitle = retrieve(market.component,"[categories].[Fruits title]");
    //     runtime.event(categories,"mouseenter",{});
    //     runtime.advanceAll();
    //     inspect(categories,{tag:"image",href:"img/categories/fruits.png",opacity:"0"});
    //     inspect(categories2,{tag:"image",href:"img/categories/fruits2.png",opacity:"1"});
    //     runtime.event(categorieTitle,"mouseenter",{});
    //     runtime.advanceAll();
    //     runtime.event(categories2,"mouseout",{});
    //     runtime.advanceAll();
    //     inspect(categories,{tag:"image",href:"img/categories/fruits.png",opacity:"1"});
    //     inspect(categories2,{tag:"image",href:"img/categories/fruits2.png",opacity:"0"});
    //     runtime.event(categories,"click",{});
    //     runtime.advanceAll();
    //     runtime.event(categories2,"mouseenter",{});
    //     runtime.advanceAll();
    //     runtime.event(categories2,"mouseout",{});
    //     runtime.advanceAll();
    //     runtime.event(categories,"mouseout",{});
    //     runtime.advanceAll();
    // });

    it("ensure that we can mouseover and mouseout on a product and it title",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let product2 = retrieve(market.component,"[ray Fruits].[listRay].[Product Clementine].[Image Clementine]");
        let product3 = retrieve(market.component,"[ray Fruits].[listRay].[Product Fraise].[Image Fraise]");
        let title2 = retrieve(market.component,"[ray Fruits].[listRay].[Product Clementine].[Title Clementine]");
        let title3 = retrieve(market.component,"[ray Fruits].[listRay].[Product Fraise].[Title Fraise]");

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

    it("ensure that clicking on a product in the basket print the corresponding section",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let product = retrieve(market.component,"[ray Fruits].[listRay].[Product Banane]");
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing = retrieve(market.component,"[draw Banane]");
        assert(drawing);
        runtime.event(drawing,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Banane]"));
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing3 = retrieve(market.component,"[draw Banane]");
        assert(drawing3);
        runtime.event(drawing3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        let categories2 = retrieve(market.component,"[categories].[Legumes]");
        runtime.event(categories2,"click",{});

        let product2 = retrieve(market.component,"[ray Legumes].[listRay].[Product Carotte]");
        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing2 = retrieve(market.component,"[draw Carotte]");
        assert(drawing2);
        runtime.event(drawing2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Carotte]"));

        runtime.event(categories,"click",{});
        let basketproduct1 = retrieve(market.component,"[basket].[listBasket].[Product basket Banane]");
        assert(basketproduct1);
        runtime.event(basketproduct1,"mousedown",{ type:"mousedown",pageX:10, pageY:10});
        runtime.advanceAll();
        runtime.event(basketproduct1,"mousemove",{pageX:0, pageY:10});
        runtime.advanceAll();
        let draggedBasket = retrieve(market.component,"[dragged]");
        runtime.event(draggedBasket,"mouseup",{ pageX:10, pageY:10});
        runtime.advanceAll();
        runtime.event(basketproduct1,"mousemove",{pageX:0, pageY:5});
        runtime.advanceAll();

        runtime.event(categories,"click",{});
        runtime.event(basketproduct1,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(basketproduct1,"mousemove",{pageX:0, pageY:5});
        runtime.advanceAll();
        let tmpBasket2 = retrieve(market.component,"[dragged]");
        runtime.event(tmpBasket2,"mousedown",{ pageX:10, pageY:10});
        runtime.event(tmpBasket2,"mousemove",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(tmpBasket2,"mouseup",{ pageX:-500, pageY:market.height*0.5});
        runtime.advanceAll();
        runtime.event(basketproduct1,"mousemove",{pageX:0, pageY:5});
        runtime.advanceAll();

        let basketproduct2 = retrieve(market.component,"[basket].[listBasket].[Product basket Carotte]");
        assert(basketproduct2);
        runtime.event(basketproduct2,"touchstart",{ type:"",touches:{0:{clientX:5,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketproduct2,"touchmove",{touches:{0:{clientX:0,clientY:5}}});
        runtime.advanceAll();
        let draggedBasket4 = retrieve(market.component,"[dragged]");
        assert(draggedBasket4);
        runtime.event(basketproduct2,"touchmove",{touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();
        runtime.event(basketproduct2,"touchend",{touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();

        runtime.event(basketproduct2,"touchstart",{ type:"",touches:{0:{clientX:5,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketproduct2,"touchmove",{touches:{0:{clientX:0,clientY:5}}});
        runtime.advanceAll();
        runtime.event(basketproduct2,"touchmove",{touches:{0:{clientX:400,clientY:400}}});
        runtime.advanceAll();
        runtime.event(basketproduct2,"touchend",{touches:{0:{clientX:400,clientY:400}}});
        runtime.advanceAll();
    });

    it("ensure that you can delete a product by swiping it on the right",function(){
        let categories = retrieve(market.component,"[categories].[Fruits]");
        runtime.event(categories,"click",{});
        runtime.advanceAll();
        let product = retrieve(market.component,"[ray Fruits].[listRay].[Product Banane]");
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing = retrieve(market.component,"[draw Banane]");
        assert(drawing);
        runtime.event(drawing,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Banane]"));
        let product1 = retrieve(market.component,"[ray Fruits].[listRay].[Product Clementine]");
        runtime.event(product1,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing1 = retrieve(market.component,"[draw Clementine]");
        assert(drawing);
        runtime.event(drawing1,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(drawing1,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let proddrag = retrieve(market.component,"[basket].[listBasket].[Clementine]");
        assert.ok(proddrag);
        let product2 = retrieve(market.component,"[ray Fruits].[listRay].[Product Framboise]");
        runtime.event(product2,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing2 = retrieve(market.component,"[draw Framboise]");
        assert(drawing2);
        runtime.event(drawing2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Framboise]"));
        let product3 = retrieve(market.component,"[ray Fruits].[listRay].[Product Mangue]");
        runtime.event(product3,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing3 = retrieve(market.component,"[draw Mangue]");
        assert(drawing3);
        runtime.event(drawing3,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Mangue]"));

        let imagebasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[Banane]");
        let fondbasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[background Banane]");
        let titlebasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane].[title Banane]");
        let compbasket = retrieve(market.component,"[basket].[listBasket].[Product basket Banane]");

        runtime.event(imagebasket,"mouseenter");
        runtime.advanceAll();
        runtime.event(fondbasket,"mouseenter");
        runtime.advanceAll();
        runtime.event(compbasket,"mouseout");
        runtime.advanceAll();
        runtime.event(titlebasket,"mouseenter");
        runtime.advanceAll();

        runtime.event(compbasket,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:50, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:100, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mouseup",{ pageX:100, pageY:5});
        runtime.advanceAll();

        runtime.event(compbasket,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:5, pageY:50});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:5, pageY:50});
        runtime.advanceAll();
        runtime.event(compbasket,"mouseup",{ pageX:100, pageY:5});
        runtime.advanceAll();

        runtime.event(compbasket,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:50, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mousemove",{ pageX:1000, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket,"mouseup",{ pageX:1000, pageY:5});
        runtime.advanceAll();

        let compbasket2 = retrieve(market.component,"[basket].[listBasket].[Product basket Mangue]");
        runtime.event(compbasket2,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mousemove",{ pageX:50, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mousemove",{ pageX:100, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mouseout",{ pageX:100, pageY:5});
        runtime.advanceAll();

        runtime.event(compbasket2,"mousedown",{ type:"mousedown",pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mousemove",{ pageX:50, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mousemove",{ pageX:1000, pageY:5});
        runtime.advanceAll();
        runtime.event(compbasket2,"mouseout",{ pageX:1000, pageY:5});
        runtime.advanceAll();

        let compbasket3 = retrieve(market.component,"[basket].[listBasket].[Product basket Clementine]");
        runtime.event(compbasket3,"touchstart",{ touches:{0:{clientX:5, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchmove",{ touches:{0:{clientX:50, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchmove",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchend",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();

        runtime.event(compbasket3,"touchstart",{ touches:{0:{clientX:5, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchmove",{ touches:{0:{clientX:50, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchmove",{ touches:{0:{clientX:1000, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket3,"touchend",{ touches:{0:{clientX:1000, clientY:5}}});
        runtime.advanceAll();

        let compbasket4 = retrieve(market.component,"[basket].[listBasket].[Product basket Framboise]");
        runtime.event(compbasket4,"touchstart",{ touches:{0:{clientX:5, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchmove",{ touches:{0:{clientX:50, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchmove",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchend",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchstart",{ touches:{0:{clientX:5, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchmove",{ touches:{0:{clientX:50, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchmove",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();
        runtime.event(compbasket4,"touchend",{ touches:{0:{clientX:100, clientY:5}}});
        runtime.advanceAll();
    });

    it("ensure that adding the same product in the basket is working ",function(done){
        let catMode = retrieve(market.component,"[categories].[Mode]");
        runtime.event(catMode,"click",{});

        let product = retrieve(market.component,"[ray Mode].[listRay].[Product Montre]");
        runtime.advanceAll();
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing = retrieve(market.component,"[draw Montre]");
        assert(drawing);
        runtime.event(drawing,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        assert.ok(retrieve(market.component,"[basket].[listBasket].[Montre]"));

        let Price = retrieve(market.component,"[basket].[price]");
        let montre = retrieve(market.component,"[basket].[listBasket].[Product basket Montre]");
        inspect(montre,{tag:"g"});
        inspect(Price,{tag:"text"});
        assert.equal(Price["font-size"], 37.5);
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing2 = retrieve(market.component,"[draw Montre]");
        assert(drawing2);
        runtime.event(drawing2,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        setTimeout(function(){
            runtime.event(product, "mousedown", {pageX: 5, pageY: 5});
            runtime.advanceAll();
            runtime.event(drawing2, "mouseup", {pageX: 5, pageY: 5});
            runtime.advanceAll();
            assert.ok(retrieve(market.component, "[basket].[listBasket].[Montre]"));
            let bigPrice = retrieve(market.component, "[basket].[price]");
            inspect(bigPrice, {tag: "text"});
            assert.equal(bigPrice["font-size"], 37.5);

            let product2 = retrieve(market.component, "[ray Mode].[listRay].[Product Costume]");
            runtime.advanceAll();

            let decalHeader = market.height / 19;
            runtime.event(product2, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
            runtime.advanceAll();
            let drawing3 = retrieve(market.component, "[draw Costume]");
            assert(drawing3);

            runtime.event(product2, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing3, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 380 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing3, "mousemove", {pageX: 100, pageY: 380 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 500 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing3, "mouseup", {pageX: 5, pageY: 500 + decalHeader});
            runtime.advanceAll();

            setTimeout(function () {
                runtime.event(product2, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing3, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 380 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing3, "mousemove", {pageX: 100, pageY: 380 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 500 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing3, "mouseup", {pageX: 5, pageY: 500 + decalHeader});
                runtime.advanceAll();
                setTimeout(function () {
                    runtime.event(product2, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
                    runtime.advanceAll();
                    runtime.event(drawing3, "mousedown", {pageX: 5, pageY: 380 + decalHeader});
                    runtime.advanceAll();
                    runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 380 + decalHeader});
                    runtime.advanceAll();
                    runtime.event(drawing3, "mousemove", {pageX: 100, pageY: 380 + decalHeader});
                    runtime.advanceAll();
                    runtime.event(drawing3, "mousemove", {pageX: 5, pageY: 500 + decalHeader});
                    runtime.advanceAll();
                    runtime.event(drawing3, "mouseup", {pageX: 5, pageY: 500 + decalHeader});
                    runtime.advanceAll();

                }, 2000);
            }, 2000);

            setTimeout(function () {
                runtime.event(product2, "mousedown", {pageX: 400, pageY: 380 + decalHeader});
                runtime.advanceAll();
                let drawing7 = retrieve(market.component, "[draw Costume]");
                assert(drawing7);
                runtime.event(drawing7, "mousedown", {pageX: 400, pageY: 380 + decalHeader});
                runtime.advanceAll();
                runtime.event(drawing7, "mouseup", {pageX: 400, pageY: 380 + decalHeader});
                runtime.advanceAll();

            }, 1000);

            setTimeout(function () {
                runtime.event(product2, "touchstart", {type:"touchstart",touches: {0: {clientX: 5, clientY: 380 + decalHeader}}});
                runtime.advanceAll();
                runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 5, clientY: 380 + decalHeader}}});
                runtime.advanceAll();
                runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 100, clientY: 380 + decalHeader}}});
                runtime.advanceAll();
                runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 5, clientY: 500 + decalHeader}}});
                runtime.advanceAll();
                runtime.event(product2, "touchend", {type:"touchend",touches: {0: {clientX: 5, clientY: 500 + decalHeader}}});
                runtime.advanceAll();
                setTimeout(function () {
                    runtime.event(product2, "touchstart", {type:"touchstart",touches: {0: {clientX: 5, clientY: 380 + decalHeader}}});
                    runtime.advanceAll();
                    runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 5, clientY: 380 + decalHeader}}});
                    runtime.advanceAll();
                    runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 100, clientY: 380 + decalHeader}}});
                    runtime.advanceAll();
                    runtime.event(product2, "touchmove", {type:"touchmove",touches: {0: {clientX: 5, clientY: 500 + decalHeader}}});
                    runtime.advanceAll();
                    runtime.event(product2, "touchend", {type:"touchend",touches: {0: {clientX: 5, clientY: 500 + decalHeader}}});
                    runtime.advanceAll();
                    done();
                }, 1500);
            }, 5000);

            runtime.event(product2, "mousedown", {pageX: 400, pageY: 380 + decalHeader});
            runtime.advanceAll();
            let drawing8 = retrieve(market.component, "[draw Costume]");
            assert(drawing8);
            runtime.event(drawing8, "mousedown", {pageX: 400, pageY: 380 + decalHeader});
            runtime.advanceAll();
            runtime.event(drawing8, "mouseup", {pageX: 400, pageY: 380 + decalHeader});
            runtime.advanceAll();
        },1100);
    });

    it("ensure that you can drag the card in the terminal and that it shows the payement interface",function(){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);
        runtime.event(card,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(card,"mousemove",{ pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:5, pageY:5});
        runtime.advanceAll();
        runtime.event(card,"mouseout",{ pageX:5, pageY:5});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseout",{ pageX:market.width*0.80+6,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.90,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.90+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseout",{ pageX:market.width*0.90+500,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.90,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseout",{ pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();

        runtime.event(card,"mousedown",{pageX:market.width*0.90,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.90-60,pageY:market.height*0.90});
        runtime.advanceAll();
    });

    it("ensure that the interface to enter the code pattern is working",function(done){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+500,pageY:market.height*0.90});
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
        //check
        runtime.event(button3, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button2, "mouseenter", {});
        runtime.advanceAll();
        //Password ok
        runtime.event(code, "mousedown", {pageX: 5, pageY: 5});
        runtime.advanceAll();
        runtime.event(button3, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button2, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button1, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button1, "mouseout", {});
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
        runtime.event(card,"mousemove",{pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        let cross = retrieve(market.component,"[code].[cross]");
        runtime.event(cross, "click", {});
        runtime.advanceAll();

        setTimeout(function(){
            done();
        },15000);
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
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.payment.zoneCode.tabButtons[1].gapX,
                clientY:market.payment.zoneCode.tabButtons[1].gapY+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.payment.zoneCode.tabButtons[2].gapX,
                clientY:market.payment.zoneCode.tabButtons[2].gapY+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:100,clientY:100+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.payment.zoneCode.tabButtons[2].gapX,
                clientY:market.payment.zoneCode.tabButtons[2].gapY+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:market.payment.zoneCode.tabButtons[0].gapX,
                clientY:market.payment.zoneCode.tabButtons[0].gapY+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchmove", {touches:{0:{clientX:100,clientY:100+market.height/19}}});
            runtime.advanceAll();
            runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
            runtime.advanceAll();
        }

        setTimeout(function(){
            done();
        },15000);

        runtime.event(code, "touchstart", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[2].gapX,
            clientY:market.payment.zoneCode.tabButtons[2].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[1].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[1].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[0].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[0].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[3].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[3].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[4].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[4].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[5].gapX,
            clientY:market.payment.zoneCode.tabButtons[5].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[8].gapX,
            clientY:market.payment.zoneCode.tabButtons[8].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[7].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[7].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[6].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[6].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchmove", {touches:{0:{  clientX:market.payment.zoneCode.tabButtons[6].gapX*0.96,
            clientY:market.payment.zoneCode.tabButtons[6].gapY+market.height/19}}});
        runtime.advanceAll();
        runtime.event(code, "touchend", {touches:{0:{clientX: 5, clientY: 5}}});
        runtime.advanceAll();
    });

    it("ensures that the calendar is shown when the right code is entered",function(){
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);

        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+500,pageY:market.height*0.90});
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

        //check
        runtime.event(button3, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button2, "mouseenter", {});
        runtime.advanceAll();
        //Password ok
        runtime.event(code, "mousedown", {pageX: 5, pageY: 5});
        runtime.advanceAll();
        runtime.event(button3, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button2, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button1, "mouseenter", {});
        runtime.advanceAll();
        runtime.event(button1, "mouseout", {});
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

        let calendar=retrieve(market.component,"[calendar]");
        assert.ok(calendar);
        let chevronEast=retrieve(market.component,"[calendar].[monthChoice].[chevronECalendar]");
        let chevronWest=retrieve(market.component,"[calendar].[monthChoice].[chevronWCalendar]");
        assert.ok(chevronEast);
        assert.ok(chevronWest);
        runtime.event(chevronEast,"click", {});
        runtime.advanceAll();
        runtime.event(chevronEast,"click", {});
        runtime.advanceAll();
        runtime.event(chevronWest,"click", {});
        runtime.advanceAll();
        runtime.event(chevronWest,"click", {});
        runtime.advanceAll();

        let column = retrieve(market.component,"[calendar].[column]");
        assert(column);

        runtime.event(column,"mousedown",{pageX:100,pageY:100});
        runtime.event(column,"mousemove",{pageX:200,pageY:-2000});
        runtime.advanceAll();
        runtime.event(column,"mouseup",{pageX:200,pageY:-2000});
        runtime.advanceAll();

        runtime.event(column,"touchstart",{touches:{0:{clientX:100,clientY:100}}});
        runtime.event(column,"touchmove",{touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();
        runtime.event(column,"touchend",{touches:{0:{clientX:100,clientY:100}}});
        runtime.advanceAll();

        let content = retrieve(market.component,"[contenu]");
        runtime.event(content,"mousedown",{pageX:100,pageY:100});
        runtime.event(content,"mousemove",{pageX:200,pageY:2000});
        runtime.advanceAll();
        runtime.event(content,"mouseup",{pageX:200,pageY:2000});
        runtime.advanceAll();

        runtime.event(content,"touchstart",{touches:{0:{clientX:100,clientY:100}}});
        runtime.event(content,"touchmove",{touches:{0:{clientX:200,clientY:200}}});
        runtime.advanceAll();
        runtime.event(content,"touchend",{touches:{0:{clientX:200,clientY:200}}});
        runtime.advanceAll();

        runtime.event(content,"mousemove",{pageX:100,pageY:200});
        runtime.advanceAll();
        runtime.event(column,"mousemove",{pageX:100,pageY:200});
        runtime.advanceAll();

        let round0 = retrieve(market.component,"[calendar].[round 0]");
        runtime.event(round0, "click", {})
        runtime.advanceAll();
        let round1 = retrieve(market.component,"[calendar].[round 1]");
        runtime.event(round1, "click", {});
        runtime.advanceAll();
        let round2 = retrieve(market.component,"[calendar].[round 2]");
        runtime.event(round2, "click", {});
        runtime.advanceAll();
        runtime.event(round0, "click", {})
        runtime.advanceAll();
    });

    it("ensures that we can control the app by sending it command that represent the voice",function(done){
        market.vocalRecognition("je veux ajouter une poires et 4 tables et 0 ecran");
        market.vocalRecognition("je veux ajouter un concombre et 44 carottes et 365 clementines");
        market.vocalRecognition("il faudrait supprimer une tables et 300 clementines et les carottes et supprimer 2 Souris");
        market.vocalRecognition("il faudrait supprimer 2 tables");
        market.vocalRecognition("en fait je voudrais vider le panier");
        market.vocalRecognition("Recherche les voyages !");
        market.vocalRecognition("Ajoute moi un voyage à Tokyo");
        market.vocalRecognition("Ajoute cette banane et ajoute de cerise");
        market.vocalRecognition("supprime de banane et ajoute cette concombre");
        market.vocalRecognition("supprime cette concombre");
        market.vocalRecognition("");
        market.vocalRecognition("Maintenant je veux payer");

        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);
        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+60,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+60,pageY:market.height*0.90});
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
        runtime.event(button1, "mouseout", {});
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

        let calendar = retrieve(market.component,"[calendar]");
        runtime.event(calendar,"click",{});
        runtime.advanceAll();

        setTimeout(function() {
            market.vocalRecognition("je veux me faire livrer " + new Date().getDate() + " " + (new Date().getMonth() + 1)
                + " " + new Date().getFullYear());
            market.vocalRecognition("je veux me faire livrer " + new Date().getDate() + " " + (new Date().getMonth() + 1)
                + " " + new Date().getFullYear());
            done();
        },2000);
    });

    it("ensures that you can change the page",function(){
        let mainPage = retrieve(market.component,"[mainPage]");
        let map = retrieve(market.component,"[map]");
        let calendar = retrieve(market.component,"[calendar]");
        assert(mainPage&&map&&calendar);
        runtime.event(calendar,"click",{});

        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);
        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();

        let product = retrieve(market.component,"[ray HighTech].[listRay].[Product Casque]");
        runtime.advanceAll();
        runtime.event(product,"mousedown",{ pageX:5, pageY:5});
        runtime.advanceAll();
        let drawing = retrieve(market.component,"[draw Casque]");
        assert(drawing);
        runtime.event(drawing,"mouseup",{ pageX:5, pageY:5});
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
        runtime.event(button1, "mouseout", {});
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

        let vignette = retrieve(market.component,"[basket].[listBasket].[Casque]");
        runtime.event(vignette,"mousedown",{ pageX:5, pageY:5});

        runtime.event(mainPage,"click",{});
        runtime.event(calendar,"click",{});
        runtime.event(mainPage,"click",{});
        runtime.event(map,"click",{});
        runtime.event(calendar,"click",{});
        runtime.event(map,"click",{});

    });

    it("ensures that the touch-sensitive works for categories while using a mouse",function(){
        let touchCategories = retrieve(market.component,"[listeCategories]");

        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:200,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseup",{pageX:200,pageY:50});
        runtime.advanceAll();

        runtime.event(touchCategories,"mouseout",{pageX:200,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseout",{pageX:200,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:200,pageY:50});
        runtime.advanceAll();

        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:-1000,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseup",{pageX:-1000,pageY:50});
        runtime.advanceAll();

        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:1000,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseup",{pageX:1000,pageY:50});
        runtime.advanceAll();

        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:-1000,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseout",{pageX:-1000,pageY:50});
        runtime.advanceAll();

        runtime.event(touchCategories,"mousedown",{pageX:100,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mousemove",{pageX:2000,pageY:50});
        runtime.advanceAll();
        runtime.event(touchCategories,"mouseout",{pageX:2000,pageY:50});
        runtime.advanceAll();

    });

    it("ensures that the touch-sensitive works for categories (tablet)",function(){
        let touchCategories = retrieve(market.component,"[listeCategories]");

        runtime.event(touchCategories,"touchstart",{touches:{0:{clientX: 100, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchmove",{touches:{0:{clientX: 200, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchend",{touches:{0:{clientX: 200, clientY: 50}}});
        runtime.advanceAll();

        runtime.event(touchCategories,"touchstart",{touches:{0:{clientX: 100, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchend",{touches:{0:{clientX: 200, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchmove",{touches:{0:{clientX: 200, clientY: 50}}});
        runtime.advanceAll();

        runtime.event(touchCategories,"touchstart",{touches:{0:{clientX: 100, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchmove",{touches:{0:{clientX: -1000, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchend",{touches:{0:{clientX:-1000, clientY: 50}}});
        runtime.advanceAll();

        runtime.event(touchCategories,"touchstart",{touches:{0:{clientX:100, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchmove",{touches:{0:{clientX:1000, clientY: 50}}});
        runtime.advanceAll();
        runtime.event(touchCategories,"touchend",{touches:{0:{clientX:1000, clientY: 50}}});
        runtime.advanceAll();

    });

    it("ensures that you can control the map with voice",function(done) {
        let payment_zone = retrieve(market.component,"[payment]");
        assert.ok(payment_zone);
        let card = retrieve(market.component,"[payment].[card]");
        assert.ok(card);
        runtime.event(card,"mousedown",{pageX:market.width*0.80+5,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mousemove",{pageX:market.width*0.80+500,pageY:market.height*0.90});
        runtime.advanceAll();
        runtime.event(card,"mouseup",{ pageX:market.width*0.80+500,pageY:market.height*0.90});
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
        runtime.event(button1, "mouseout", {});
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

        setTimeout(function(){
            market.vocalRecognition("je veux ajouter une poires et 4 tables et 0 ecran");
            market.vocalRecognition("J'habite 64 Boulevard Garibaldi Paris");
            market.vocalRecognition("J'habite un Chemin des Etelles");
            market.vocalRecognition("Je selectionne le point relai numero 1");
            setTimeout(function() {
                market.vocalRecognition("Je valide");

                runtime.advanceAll();

                market.vocalRecognition("Je dis un truc");
                done();
            },500);
        },1000);


    });
    it('ensure that the calendar id reloaded after having chosen a relay point', function (done) {
        market.toCalendar('Parc des Princes')
        setTimeout(function(){
            done();
        },300);
    });
});
