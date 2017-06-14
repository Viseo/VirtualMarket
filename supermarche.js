exports.main = function(svg,gui,param,neural,targetruntime,Maps,timer,targetMap,cookie,speech,listener,windowFunc){

    let screenSize = svg.runtime.screenSize();
    let market = new svg.Drawing(screenSize.width,screenSize.height).show('content');
    let runtime=targetruntime;
    ///////////////BANDEAUX/////////////////
    class DrawingZone{
        constructor(width,height,x,y)
        {
            this.component = new svg.Drawing(width,height).position(x,y);
        }
    }

    class ListCategorie extends DrawingZone {
        constructor(width, height, x, y, tabCat){
            super(width, height, x, y);

            let init = ()=> {
                //Rebords
                let rectangleBackground = new svg.Rect(width, height).position(width / 2, height / 2).color([230, 230, 230]);
                this.component.add(rectangleBackground);

                //Rayon Actuellement Selectionné
                this.ray = null;
                this.rayTranslation = null;
                this.currentSearch = [];

                this.tabCategories = tabCat;
                this.listThumbnail = new svg.Translation().mark("listeCategories");
                for (let i = 0; i < this.tabCategories.length; i++) {
                    let current = this.tabCategories[i];
                    current.placeElements();
                    current.move(width * 0.01 + width * 0.108 * i, height * 0.05);
                    this.listThumbnail.add(current.component);
                }
                this.component.add(this.listThumbnail);
                this.transRect = new svg.Translation().shadow('catrect', -5, 0, 5).add(new svg.Circle(1).opacity(0).position(width * 0.95, market.height + header.height));
                this.transRect.add(new svg.Rect(width * 0.01, market.height - header.height).position(width * (1.005), (market.height + header.height) / 2).color([230, 230, 230]));
                this.component.add(this.transRect);
                this.previousMouseX = 0;
                this.navigation = false;
            };
            let handleEvents = ()=> {
                this.mouvement = false;
                // naviguer dans les catégories avec la souris
                svg.addEvent(this.component, "mousedown", (e) => {
                    this.mouvement = true;
                    this.previousMouseX = e.pageX;
                    svg.addEvent(this.component, "mousemove", (e) => {
                        if (this.mouvement) {
                            if (this.previousMouseX != e.pageX) this.navigation = true;
                            this.listThumbnail.steppy(1, 1).moveTo(this.listThumbnail.x + (e.pageX - this.previousMouseX), this.listThumbnail.y);
                            this.previousMouseX = e.pageX;
                        }
                    });

                    svg.addEvent(this.component, "mouseup", () => {
                        let widthTotal = this.tabCategories[0].width * 1.04 * this.tabCategories.length;
                        let widthView = width;
                        let positionRight = this.listThumbnail.x + widthTotal;
                        if (this.listThumbnail.x > 0) {
                            this.listThumbnail.smoothy(10, 10).moveTo(0, 0);
                        }
                        else if (positionRight <= widthView) {
                            this.listThumbnail.smoothy(10, 10).moveTo(widthView - widthTotal, this.listThumbnail.y);
                        }
                        else {
                        }
                        this.mouvement = false;
                    });

                    svg.addEvent(this.component, "mouseout", () => {
                        if (this.mouvement) {
                            let widthTotal = this.tabCategories[0].width * 1.04 * this.tabCategories.length;
                            let widthView = width;
                            let positionRight = this.listThumbnail.x + widthTotal;
                            if (this.listThumbnail.x > 0) {
                                this.listThumbnail.smoothy(10, 10).moveTo(0, 0);
                            }
                            else if (positionRight <= widthView) {
                                this.listThumbnail.smoothy(10, 10).moveTo(widthView - widthTotal, this.listThumbnail.y);
                            }
                            this.mouvement = false;
                        }
                    });
                });

                // Gestion tactile pour les catégories:
                svg.addEvent(this.component, "touchstart", (e) => {
                    this.mouvement = true;
                    this.previousMouseX = e.touches[0].clientX;

                    svg.addEvent(this.component, "touchmove", (e) => {
                        if (this.mouvement) {
                            this.listThumbnail.steppy(1, 1).moveTo(this.listThumbnail.x + (e.touches[0].clientX - this.previousMouseX), this.listThumbnail.y);
                            this.previousMouseX = e.touches[0].clientX;
                        }
                    });

                    svg.addEvent(this.component, "touchend", () => {
                        let widthTotal = this.tabCategories[0].width * 1.04 * this.tabCategories.length;
                        let widthView = width;
                        let positionRight = this.listThumbnail.x + widthTotal;
                        this.mouvement = false;
                        if (this.listThumbnail.x > 0) {
                            this.listThumbnail.smoothy(10, 10).moveTo(0, 0);
                        }
                        else if (positionRight <= widthView) {
                            this.listThumbnail.smoothy(10, 10).moveTo(widthView - widthTotal, this.listThumbnail.y);
                        }
                    });
                });
            };

            init();
            handleEvents();
        }
    }

    class Ray extends DrawingZone {
        constructor(width,height,x,y,tabThumbnail,cat) {
            super(width, height, x, y);
            let init = () =>{
                this.width = width;
                this.name = cat;
                this.thumbWidth = (width / 4 * 0.94);
                this.listWidth = Math.ceil(tabThumbnail.length / 3) * (this.thumbWidth);
                let fond = new svg.Rect(width, height).position(width / 2, height / 2);
                fond.color([230, 230, 230]);
                this.component.add(fond);
                this.currentDrawn = null;
            };
            let initThumbnails = ()=> {
                this.listThumbnails = new svg.Translation().mark("listRay");
                let col = 0;
                for (let i = 0; i < tabThumbnail.length; i = i + 3) {
                    for (let j = 0; j < 4; j++) {
                        if (tabThumbnail[j + i]) {
                            tabThumbnail[j + i].placeElements(1);
                            tabThumbnail[j + i].move(width * 0.01 + this.thumbWidth * col, width * 0.01 + (height / 3 * 0.98) * j);
                            this.listThumbnails.add(tabThumbnail[j + i].component);
                        }
                    }
                    col++;
                }
                this.component.add(this.listThumbnails);
            };
            let manageChevron = ()=>{
                if (tabThumbnail.length > 12){
                    // let chevronWest = new svg.Chevron(this.thumbWidth / 4, this.thumbWidth * 0.7, 16, "W").position(this.thumbWidth / 6, this.component.height / 2).color([0, 195, 235]);
                    // let chevronEast = new svg.Chevron(this.thumbWidth / 4, this.thumbWidth * 0.7, 16, "E").position(width - this.thumbWidth / 6, this.component.height / 2).color([0, 195, 235]);
                    // let ellipseChevronWest = new svg.Ellipse(50, 50).color(svg.BLACK).opacity(0)
                    //     .position(this.thumbWidth / 4, this.component.height / 2);
                    // let ellipseChevronEast = new svg.Ellipse(50, 50).color(svg.BLACK).opacity(0)
                    //     .position(this.component.width - this.thumbWidth / 4, this.component.height / 2);
                    // let zoneChevronWest = new svg.Translation().add(ellipseChevronWest).add(chevronWest).opacity(0).mark("chevronWRay").shadow('ChevronW', 7, 8, 8);
                    // let zoneChevronEast = new svg.Translation().add(ellipseChevronEast).add(chevronEast).opacity(0.3).mark("chevronERay").shadow('ChevronE', -7, 8, 8);
                    //
                    // zoneChevronWest.onClick(()=>{
                    //     if (this.listWidth != 0 && this.listThumbnails.x + this.thumbWidth * 1.5 < 0) {
                    //         this.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(this.listThumbnails.x + this.thumbWidth * 1.5, 0);
                    //         zoneChevronEast.opacity(0.3);
                    //     } else {
                    //         this.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(0, 0);
                    //         zoneChevronWest.opacity(0);
                    //         zoneChevronEast.opacity(0.3);
                    //     }
                    // });
                    //
                    // zoneChevronEast.onClick(()=>{
                    //     if (this.listWidth != 0 && this.listThumbnails.x + this.listWidth - this.thumbWidth * 1.5 >= width) {
                    //         this.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(this.listThumbnails.x - this.thumbWidth * 1.5, 0);
                    //         zoneChevronWest.opacity(0.3);
                    //     } else {
                    //         this.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(width - this.listWidth - width * 0.01, 0);
                    //         zoneChevronWest.opacity(0.3);
                    //         zoneChevronEast.opacity(0);
                    //     }
                    // });
                    // this.component.add(zoneChevronEast).add(zoneChevronWest);
                }
            };

            init();
            initThumbnails();
            manageChevron();
        }
        gesture(type, dx){
            let handleMovement = (dx)=>{
                if(categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.steppy(1, 1).onChannel("rayon").moveTo(categories.ray.listThumbnails.x + dx, 0);
                }
            };
            let handleEndMovement = ()=>{
                if(categories.ray.listWidth != 0 && categories.ray.listThumbnails.x>0 && categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(0, 0);
                }
                else if(categories.ray.listWidth != 0 && categories.ray.listThumbnails.x+categories.ray.listWidth<categories.ray.width && categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(categories.ray.width - categories.ray.listWidth - categories.ray.width * 0.01, 0);
                }
            };

            if(type=="move"){
                handleMovement(dx);
            }
            else{
                handleEndMovement();
            }
        }
    }

    class Basket extends DrawingZone {
        constructor(width, height, x, y) {
            super(width, height, x, y);
            let init = ()=> {
                this.component.mark("basket");
                let background = new svg.Rect(width, height).position(width / 2, height / 2);
                background.color(svg.WHITE);
                this.component.add(background);
                this.listProducts = new svg.Translation().mark("listBasket");
                this.component.add(this.listProducts);
                this.thumbnailsProducts = [];

                this.stringPanier = "";
                this.titleBasket = new svg.Text("PANIER").font("Calibri", this.component.height * 0.05, 1).color([0, 195, 235])
                    .position(this.component.width / 2, this.component.height * 0.07);
                runtime.attr(this.titleBasket.component, "font-weight", "bold");
                this.titleBack = new svg.Rect(this.component.width, this.component.height * 0.1)
                    .position(this.component.width / 2, this.component.height * 0.05).color(svg.WHITE);
                this.component.add(this.titleBack);
                this.component.add(this.titleBasket);
                this.originY = this.component.height * 0.1;

                this.component.add(new svg.Line(0,this.component.height*0.98,this.component.width+10,this.component.height*0.98)
                    .color(svg.BLACK,5,[230,230,230]));
                this.component.add(new svg.Line(this.component.width*0.2,this.component.height*0.1,this.component.width*0.8,this.component.height*0.1)
                    .color(svg.BLACK,1,[210,210,210]));
            };

            let initPrice=()=>{
                this.backgroundTotal = new svg.Rect(this.component.width, this.component.height * 0.16)
                    .position(this.component.width / 2, this.component.height * 0.93).color(svg.WHITE);
                this.component.add(this.backgroundTotal);
                this.totalPrice = 0;
                this.calculatePrice(0);
            };

            init();
            initPrice();
        }

        calculatePrice(price) {
            let addToPrice= ()=>{
                this.totalPrice+=price;
            };
            let removeOldPriceDisplay=()=>{
                if(this.printPrice){
                    this.component.remove(this.printPrice);
                    this.component.remove(this.total);
                }
            };
            let createAndDisplayNewPrice=()=>{
                this.printPrice = new svg.Text(this.totalPrice.toFixed(2) + " €")
                    .position(this.component.width*0.90, this.component.height*0.935).anchor("end")
                    .font("calibri", this.component.height*0.05, 1).color([255, 110, 0]).mark("price");
                this.total = new svg.Text("TOTAL").position(this.component.width *0.1, this.component.height*0.935)
                    .font("calibri", this.component.height*0.06, 1).color([255, 110, 0]).anchor("left");

                runtime.attr(this.total.component, "font-weight", "bold");
                this.component.add(this.total);
                this.component.add(this.printPrice);
            };

            addToPrice();
            removeOldPriceDisplay();
            createAndDisplayNewPrice();
        }

        addProducts(thumbnail,quantity) {
            let manageQuantities=()=>{
                let newProd = new ThumbnailBasket(thumbnail.image.src, thumbnail.name, thumbnail.price,
                    thumbnail.complement, thumbnail.categorie);
                this.occur=0;
                for (let product of this.thumbnailsProducts) {
                    if (product.name == thumbnail.name) {
                        product.addQuantity(quantity);
                        let newText=product.quantity;
                        product.changeText(newText);
                        this.occur=1;
                    }
                }
                if (this.occur==0){
                    newProd.addQuantity(quantity);
                    this.listProducts.add(newProd.component);
                    this.thumbnailsProducts.push(newProd);
                    let newText=newProd.quantity;
                    newProd.changeText(newText);
                }
                return newProd;
            };
            let handleEvents=(newProd)=>{
                newProd.component.onMouseDown((e)=>{
                    if(market.pages[2].obj==currentPage) this.dragBasket(newProd,e);
                });

                svg.addEvent(newProd.component, "touchstart",(e)=>{
                    this.dragBasket(newProd,e);
                });
            };
            let replaceElements=(newProd)=>{
                if (this.thumbnailsProducts.length < 2 && this.occur==0) {
                    newProd.placeElements();
                    newProd.move(0,this.originY);
                }
                else {
                    if(this.occur==0){
                        let ref = this.thumbnailsProducts[this.thumbnailsProducts.length-2];
                        newProd.placeElements();
                        newProd.move(0,ref.y+ref.height);
                    }
                }
            };

            if(quantity != 0){
                let newProd = manageQuantities();
                handleEvents(newProd);
                this.calculatePrice(newProd.price*quantity);
                replaceElements(newProd);
                this.basketCookie();
            }
        }

        deleteProducts(vignette,numberProduct){
            let manageQuantity=()=>{
                vignette.minusQuantity(numberProduct);
                let newText = vignette.quantity;
                vignette.changeText(newText);
            };
            let managePosition=()=>{
                this.listProducts.remove(vignette.component);
                this.thumbnailsProducts.splice(this.thumbnailsProducts.indexOf(vignette), 1);
                for (let product of this.thumbnailsProducts) {
                    product.placeElements();
                    product.move(0,this.thumbnailsProducts.indexOf(product)*(product.height)+this.component.height*0.1);
                }
                if(this.thumbnailsProducts.length<=7) this.listProducts.smoothy(10,10).moveTo(0,0);
            };

            manageQuantity();
            if(vignette.quantity ==0){
                managePosition();
            }
            this.calculatePrice(-((vignette.price)*numberProduct));
            this.basketCookie();
        }

        findInBasket(name)
        {
            for(var i=0;i<this.thumbnailsProducts.length;i++) {
                if(this.thumbnailsProducts[i].name==name) return this.thumbnailsProducts[i];
            }
            return null;
        }

        deleteFromName(name,quantity)
        {
            let toDelete = this.findInBasket(name);
            if(toDelete!=null) {
                if (quantity == null || quantity >= toDelete.quantity) this.deleteProducts(toDelete, toDelete.quantity);
                else this.deleteProducts(toDelete, quantity);
            }
            this.basketCookie();
        }

        basketCookie(){
            this.stringPanier="";
            for (let product of this.thumbnailsProducts) {
                this.stringPanier+=product.name+":"+product.quantity+",";
            }
            cookie.createCookie("basket",this.stringPanier.substring(0,this.stringPanier.length-1), 1);
        };

        dragBasket(current,e) {
            let manageDndForMouse = ()=>{
                let mouseInitial = {x:e.pageX,y:e.pageY};
                let lookingForDir=true;
                current.component.onMouseMove((e)=>{
                    if((!this.direction)&&lookingForDir){
                        if(Math.abs(e.pageX-mouseInitial.x)*40>Math.abs(e.pageY-mouseInitial.y)){
                            if(e.pageX<mouseInitial.x){
                                this.dragged = new Thumbnail(current.image.src, current.name);
                                this.dragged.placeElementsDnD(current);
                                this.dragged.move(current.x + pageWidth * 0.85, current.y + this.listProducts.y + header.height);
                                this.dragged.component.opacity(0.9).mark("dragged");
                                glassDnD.add(this.dragged.component);
                                market.add(glassDnD);

                                let anchorPoint = {x:e.pageX-this.dragged.x,y:e.pageY-this.dragged.y};
                                this.dragged.component.onMouseMove((e)=>{
                                    this.dragged.move(e.pageX - anchorPoint.x, e.pageY - anchorPoint.y);
                                });

                                this.dragged.component.onMouseUp(()=>{
                                    if ((this.dragged.x + this.dragged.width / 2 < pageWidth * 0.85)
                                        && (this.dragged.y + this.dragged.height / 2 > market.height * 0.20)) {
                                        market.basket.deleteProducts(current, 1);
                                        market.changeRay(current.categorie);
                                    }
                                    glassDnD.remove(this.dragged.component);
                                    this.direction=null;
                                });
                                this.direction = "LEFT";
                            }
                            else{
                                this.direction = "RIGHT";
                                this.previousMouseX = e.pageX;
                                svg.addEvent(current.component, "mousemove", (e)=>{
                                    if(this.direction=="RIGHT") {
                                        current.component.steppy(1, 1).moveTo(current.x + (e.pageX - this.previousMouseX),
                                            current.y);
                                    }else{}
                                });

                                svg.addEvent(current.component, "mouseup", ()=>{
                                    if (current.component.x + current.width / 2 > this.component.width) {
                                        market.basket.deleteProducts(current, current.quantity);
                                    }
                                    else {
                                        current.component.smoothy(5, 5).moveTo(0, current.y);
                                    }
                                    this.direction=null;
                                });

                                svg.addEvent(current.component, "mouseout", ()=>{
                                    if (current.component.x + current.width / 2 >= this.component.width) {
                                        market.basket.deleteProducts(current, current.quantity);
                                    }
                                    else {
                                        current.component.smoothy(5, 5).moveTo(0, current.y);
                                    }
                                    this.direction=null;
                                });
                            }
                        }
                        else{
                            this.direction = "VERTICAL";
                            // naviguer dans le panier avec la souris
                            this.previousMouseY = e.pageY;
                            svg.addEvent(this.component, "mousemove", (e)=>{
                                if(this.direction=="VERTICAL") {
                                    this.listProducts.steppy(1, 1).moveTo(this.listProducts.x,
                                        this.listProducts.y+(e.pageY - this.previousMouseY));
                                    this.previousMouseY = e.pageY;
                                }else{}
                            });

                            svg.addEvent(this.component, "mouseup", ()=>{
                                let heightTotal = this.thumbnailsProducts.length * this.thumbnailsProducts[0].height;
                                let heightView = this.component.height*0.77;
                                let positionDown = this.listProducts.y + heightTotal;
                                if ((this.listProducts.y > 0)||(this.thumbnailsProducts.length<=7)) {
                                    this.listProducts.smoothy(10, 10).moveTo(0,0);
                                }
                                else if(positionDown < heightView) {
                                    this.listProducts.smoothy(10,10).moveTo(this.listProducts.x, heightView - heightTotal);
                                }
                                this.direction=null;
                            });

                            svg.addEvent(this.component, "mouseout", ()=>{
                                if(this.direction) {
                                    let heightTotal = this.thumbnailsProducts.length * this.thumbnailsProducts[0].height;
                                    let heightView = this.component.height*0.77;
                                    let positionDown = this.listProducts.y + heightTotal;
                                    if ((this.listProducts.y > 0)||(this.thumbnailsProducts.length<=7)) {
                                        this.listProducts.smoothy(10, 10).moveTo(0, 0);
                                    }
                                    else if(positionDown < heightView) {
                                        this.listProducts.smoothy(10,10).moveTo(this.listProducts.x, heightView - heightTotal);
                                    }
                                    this.direction = null;
                                }else{}
                            });
                        }
                    }
                    lookingForDir=false;
                });
            };
            let manageDndForTouch = ()=>{
                let touchInitial = {x:e.touches[0].clientX,y:e.touches[0].clientY};
                //// gestion tactile du panier vers le rayon:
                this.previousTouchY = e.touches[0].clientY;
                this.previousTouchX = e.touches[0].clientX;
                svg.addEvent(current.component, "touchmove", (e)=>{
                    if(!this.direction){
                        if(Math.abs(e.touches[0].clientX-touchInitial.x)>Math.abs(e.touches[0].clientY-touchInitial.y)){
                            if(e.touches[0].clientX<touchInitial.x) {
                                this.dragged = new Thumbnail(current.image.src, current.name);
                                this.dragged.placeElementsDnD(current);
                                this.dragged.move(current.x + pageWidth * 0.85, current.y + this.listProducts.y + header.height);
                                this.dragged.component.opacity(0.9).mark("dragged");
                                glassDnD.add(this.dragged.component);
                                this.direction="LEFT";
                            }
                            else{
                                this.direction = "RIGHT";
                            }
                        }
                        else{
                            this.direction = "VERTICAL";
                        }
                    }

                    switch(this.direction){
                        case "LEFT":
                            this.dragged.move(e.touches[0].clientX - current.width / 2, e.touches[0].clientY - current.height / 2);
                            break;
                        case "VERTICAL":
                            this.listProducts.steppy(1, 1).moveTo(this.listProducts.x,
                                this.listProducts.y+(e.touches[0].clientY - this.previousTouchY));
                            this.previousTouchY = e.touches[0].clientY;
                            break;
                        case "RIGHT":
                            current.component.steppy(1, 1).moveTo(current.x+(e.touches[0].clientX - this.previousTouchX),
                                current.y);
                            break;
                    }
                });

                svg.addEvent(current.component, "touchend", ()=>{
                    if(this.direction=="LEFT") {
                        if ((this.dragged.x + this.dragged.width / 2 < pageWidth * 0.85) &&
                            (this.dragged.y + this.dragged.height / 2 > market.height * 0.20)) {
                            market.basket.deleteProducts(current, 1);
                            market.changeRay(current.categorie);
                        }
                        glassDnD.remove(this.dragged.component);

                    }
                    else if(this.direction=="VERTICAL"){
                        let heightTotal = this.thumbnailsProducts.length * this.thumbnailsProducts[0].height;
                        let heightView = this.component.height*0.77;
                        let positionDown = this.listProducts.y + heightTotal;
                        if ((this.listProducts.y > 0)||(this.thumbnailsProducts.length<=7)) {
                            this.listProducts.smoothy(10, 10).moveTo(0, 0);
                        }
                        else if(positionDown < heightView) {
                            this.listProducts.smoothy(10,10).moveTo(this.listProducts.x, heightView - heightTotal);
                        }
                    }
                    else{
                        if(current.component.x+current.width/2>this.component.width){
                            market.basket.deleteProducts(current, current.quantity);
                        }
                        else{
                            current.component.smoothy(5, 5).moveTo(0, current.y);
                        }
                    }

                    this.direction=null;
                });
            };

            if(e.type=="mousedown"){
                manageDndForMouse();
            }
            else {
                manageDndForTouch();
            }
        }

        emptyBasket(){
            for (var i = this.thumbnailsProducts.length - 1; i >= 0; i--) {
                market.basket.deleteProducts(this.thumbnailsProducts[i], this.thumbnailsProducts[i].quantity);
            }
            this.thumbnailsProducts.splice(0, this.thumbnailsProducts.length);
        }
    }

    class Header extends DrawingZone{
        constructor(width,height,x,y)
        {
            super(width,height,x,y);

            let init=()=>{
                this.component.add(new svg.Rect(width,height).position(width/2,height/2).color([0,58,112]));
                this.logoComp=new svg.Translation().mark("logo");
                let digi=new svg.Text("Digi").position(width*0.05,height*0.75).font("Tahoma",this.component.height*0.75,1)
                    .color(svg.LIGHT_BLUE);
                this.logoComp.add(digi);
                this.logoComp.add(new svg.Text("Market").position(width*0.09,height*0.75).font("Tahoma",this.component.height*0.75,1)
                    .color(svg.WHITE));
                runtime.attr(digi.component, "font-style", "italic");
                this.logo=new svg.Image("img/picto.png").position(width*0.025,height*0.5).dimension(height,height);
                this.logoComp.add(this.logo);
                this.micro = new svg.Image("img/microphone-deactivated.png").mark('micro');
                this.component.add(this.micro);
                this.component.add(this.logoComp);
                this.micro.position(width*0.95,height/2).dimension(height*0.9,height*0.9);
                this.height = height;
                this.width=width;
            };
            let manageBackToHome=()=>{
                this.logoComp.onClick(()=>{
                    if(market.map!=null){
                        currentMapSearch= market.map.input.value;
                        mapPage.remove(market.map.component);
                        market.map=null;
                    }
                    currentPage=mainPage;
                    currentIndex=2;
                    market.pages[2].obj.smoothy(10, 40).onChannel(2).moveTo(0, 0);
                    market.pages[1].obj.smoothy(10, 40).onChannel(1).moveTo(0, 0);
                    market.pages[0].obj.smoothy(10, 40).onChannel(0).moveTo(0, 0);
                    market.calendar.calendarOn = false;
                    market.calendar.mapOn = false;
                });
            };

            init();
            manageBackToHome();
            listener.listen(this.micro,market);
        }
    }

    class Payment extends DrawingZone {
        constructor(width,height,x,y){
            super(width,height,x,y);
            this.background = new svg.Rect(width,height).position(width/2,height/2).color(svg.WHITE);
            this.card = new svg.Image("img/credit-card.png").dimension(width*0.60,height*0.65).position(width*0.1,height/2).mark("card");
            this.tpeBack = new svg.Image("img/tpeFond.png").dimension(width,height*0.9).position(width*0.99,height/2);
            this.tpe = new svg.Image("img/tpe.png").dimension(width,height).position(width,height/2);

            this.iteration = 1;
            this.width = width;
            this.height = height;
            this.cardIn = false;

            this.component.add(this.background);
            this.component.add(this.tpeBack);
            this.component.add(this.card);
            this.component.add(this.tpe);
            this.zoneCode = new SecurityCode(pageWidth,market.height-market.height/19,0,market.height/19);

            svg.addEvent(this.card,"touchstart",()=>{
                svg.addEvent(this.card,"touchmove",(e)=>{
                    if(this.card.x+this.card.width/2<this.component.width*0.90)
                        this.card.position(e.touches[0].pageX-this.component.x,this.card.y);
                    else if(this.cardIn==false){
                        this.showCode();
                        this.card.position(this.width*0.65,this.card.y);
                        this.cardIn=true;
                        svg.event(this.card,"touchend",{});
                    }
                });
            });

            svg.addEvent(this.card,"mousedown",()=>{
                let draw = true;
                svg.addEvent(this.card,"mousemove",(e)=>{
                    if(draw)this.card.position(e.pageX-this.component.x,this.card.y);
                });

                svg.addEvent(this.card,"mouseup",()=>{
                    if(draw) {
                        if (this.card.x + this.card.width / 2 < this.component.width * 0.80)
                            this.card.position(width * 0.1, this.card.y);
                        else{
                            this.showCode();
                            this.card.position(this.width * 0.65, this.card.y);
                            this.cardIn=true;
                        }
                        draw = false;
                    }
                });

                svg.addEvent(this.card,"mouseout",()=>{
                    if(draw) {
                        if (this.card.x + this.card.width / 2 < this.component.width * 0.6)
                            this.card.position(width * 0.1, this.card.y);
                        else if (this.cardIn == false) {
                            this.showCode();
                            this.card.position(this.width * 0.65, this.card.y);
                            this.cardIn=true;
                        }
                        draw = false;

                    }
                });
            });
        }

        showCode(){
            this.zoneCode = new SecurityCode(mainPageWidth,market.height-header.height,0,header.height);
            this.zoneCode.component.opacity(1).mark("code");
            this.zoneCode.placeElements();
            market.add(this.zoneCode.component);
            market.pages[1].active = false;
            market.pages[0].active = false;
        }
    }

    class SecurityButton {
        constructor(value, leftWidth, upperHeight){
            this.value = value;
            this.unit = upperHeight*0.5;
            this.gapX = leftWidth + ((((value - 1 ) % 3) ) - 1 ) * this.unit;
            this.gapY = upperHeight +  ((Math.trunc((value - 1) / 3) ) - 1 ) * this.unit;
            this.ray = upperHeight*0.08;

            // Dessiner les boutons
            this.component = new svg.Circle(this.ray).position(this.gapX ,this.gapY).color(svg.WHITE).opacity(1).mark("button"+value);

            this.component.onMouseOut(()=>{
                if ((market.payment.zoneCode.onDrawing)&& (market.payment.zoneCode.code.indexOf(""+this.value)== -1))
                {
                    market.payment.zoneCode.code+= this.value;
                }
            });

            this.component.onMouseEnter(()=>{
                if (market.payment.zoneCode.onDrawing)
                {
                    if(market.payment.zoneCode.code.length>0){
                        let buttonBefore = market.payment.zoneCode.tabButtons[parseInt(market.payment.zoneCode.code.charAt(market.payment.zoneCode.code.length-1))-1];
                        market.payment.zoneCode.lines.push(new svg.Line(buttonBefore.gapX,buttonBefore.gapY,this.gapX,this.gapY)
                            .color(svg.WHITE,5,svg.WHITE));
                        market.payment.zoneCode.buttons.add(market.payment.zoneCode.lines[market.payment.zoneCode.lines.length-1]);
                    }
                    if (this.value != market.payment.zoneCode.code.slice(-1)){
                        market.payment.zoneCode.code+= this.value;
                    }
                }
            });
        }
        // Récupérer les boutons
        get(){
            return this.component;
        }
    }

    class SecurityCode {
        constructor(width,height,x,y)
        {
            this.component = new svg.Translation();
            this.background = new svg.Rect();
            this.title = new svg.Text("Saisir le code de sécurité");
            this.buttons = new svg.Translation().mark("buttonGroup");
            this.timer = new svg.Text("30");
            this.message = new svg.Text("");
            this.width = width;
            this.height = height;
            this.circleTimer = new svg.Circle(this.height/25);
            this.arcTimer = new svg.Path(0,0);
            this.onDrawing = false;
            this.cross = new svg.Image("img/icone-supprimer.png").mark("cross");
            this.lines = [];
            this.currentLine=new svg.Line();

            this.cross.onClick(()=>{
                market.remove(market.payment.zoneCode.component);
                market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
                market.payment.cardIn=false;
            });

            this.component.onMouseUp(()=>{
                if (this.onDrawing){
                    this.onDrawing = false;
                    let check=this.checkPassword(this.code);
                    if(check===false){
                        if(this.code.length>1){
                            market.payment.iteration++;
                            market.textToSpeech("Code erroné.");
                            if (market.payment.iteration >3) {
                                market.textToSpeech("Veuillez patienter"+10+"secondes");
                                this.launchTimer(10, false);
                            }
                        }
                    }else{
                        currentIndex=1;
                        currentPage=market.map;
                        this.moveMainpage();
                        this.paymentCookie();
                    }
                    for(let i=0;i<this.lines.length;i++) this.buttons.remove(this.lines[i]);
                    this.lines = [];
                    this.buttons.remove(this.currentLine);
                    this.currentLine=new svg.Line();
                    this.buttons.add(this.currentLine);
                }
            });

            svg.addEvent(this.component,"touchend",()=>{
                if (this.onDrawing){
                    this.onDrawing = false;
                    let check=this.checkPassword(this.code);
                    if(check===false){
                        if(this.code.length>1){
                            market.payment.iteration++;
                            if (market.payment.iteration >3) {
                                this.launchTimer(10, false);
                            }
                        }
                    }
                    else{
                        this.moveMainpage();
                        currentIndex=1;
                        currentPage=market.map;
                        this.paymentCookie();
                    }
                    for(let i=0;i<this.lines.length;i++) this.buttons.remove(this.lines[i]);
                    this.lines = [];
                    this.buttons.remove(this.currentLine);
                    this.currentLine=new svg.Line();
                    this.buttons.add(this.currentLine);
                }
            });


            this.component.onMouseDown(()=>{
                this.onDrawing = true;
                this.code= "";
            });
            svg.addEvent(this.component,"touchstart",()=>{
                this.onDrawing = true;
                this.code= "";
            });
            this.code = "";

            //Ligne qui suis la souris
            this.component.onMouseMove((e)=>{
                if(this.onDrawing && this.code.length>0) {
                    this.buttons.remove(this.currentLine);
                    let buttonBase = this.tabButtons[parseInt(this.code.charAt(this.code.length-1))-1];
                    this.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,e.pageX,e.pageY-header.height).color(svg.WHITE,5,svg.WHITE);
                    this.buttons.add(this.currentLine);
                }
            });
            this.onButton=false;

            //Gestion Tactile
            svg.addEvent(this.component,"touchmove",(e)=>{
                let button=null;
                for(let i = 0;i<this.tabButtons.length;i++) {
                    if ((e.touches[0].clientX > (this.x + this.tabButtons[i].gapX) - this.tabButtons[i].ray) &&
                        (e.touches[0].clientX < (this.x + this.tabButtons[i].gapX) + this.tabButtons[i].ray) &&
                        (e.touches[0].clientY > (this.y + this.tabButtons[i].gapY) - this.tabButtons[i].ray) &&
                        (e.touches[0].clientY < (this.y + this.tabButtons[i].gapY) + this.tabButtons[i].ray)) {
                        button=this.tabButtons[i];
                    }
                }

                //Simulate mouseEnter
                if(button!=null&&(this.onButton==false)){
                    if(this.code.length>0) {
                        let buttonBefore = this.tabButtons[parseInt(this.code.charAt(this.code.length - 1)) - 1];
                        this.lines.push(new svg.Line(buttonBefore.gapX, buttonBefore.gapY, button.gapX, button.gapY)
                            .color(svg.WHITE, 5, svg.WHITE));
                        this.buttons.add(this.lines[this.lines.length - 1]);
                    }
                    if(button.value != market.payment.zoneCode.code.slice(-1)) {
                        this.code += button.value;
                    }
                }

                //Dessin Dynamique
                if(this.onDrawing && this.code.length>0) {
                    this.buttons.remove(this.currentLine);
                    let buttonBase = this.tabButtons[parseInt(this.code.charAt(this.code.length-1))-1];
                    this.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,
                        e.touches[0].clientX,e.touches[0].clientY-header.height)
                        .color(svg.WHITE,5,svg.WHITE);
                    this.buttons.add(this.currentLine);
                }
            });

            // this.component.add(this.blur);
            this.component.add(this.background);
            this.component.add(this.title);
            this.component.add(this.buttons);
            this.component.add(this.circleTimer);
            this.component.add(this.arcTimer);
            this.component.add(this.timer);
            this.component.add(this.message);
            this.component.add(this.cross);

            this.tabButtons = [];
            for (let num = 1; num <10; num ++){
                this.tabButtons.push(new SecurityButton(num, width/2, height*0.45));
                this.buttons.add(this.tabButtons[num-1].get());
            }
            this.buttons.add(this.currentLine);
            this.x = x;
            this.y = y;
            this.component.move(x,y);
        }

        paymentCookie(){
            cookie.createCookie("payment", "done", 1);
        }

        placeElements()
        {
            this.arcTimer.move(this.width/2,this.height*0.79).color(svg.WHITE,5,svg.RED).opacity(0)
                .arc(this.height/25,this.height/25,0,1,0,this.width/2,this.height*0.79);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).color(svg.BLACK,1,svg.BLACK).opacity(0.9);
            this.title.position(this.width/2,this.height*0.1).font("calibri",this.height/15,1).color(svg.WHITE);
            this.circleTimer.position(this.width/2,this.height*0.79).color(svg.WHITE,5,svg.RED).opacity(0);
            this.timer.position(this.width/2,this.height*0.79).font("calibri",20,1).color(svg.BLACK).opacity(0);
            this.cross.position(this.width/2,this.height*0.90).dimension(this.width*0.10,this.height*0.10).color(svg.BLACK).opacity(1);

        }

        moveMainpage(){
            market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
            market.payment.cardIn=false;
            market.payment.iteration=0;
            market.remove(market.payment.zoneCode.component);
            market.pages[2].obj.smoothy(10, 40).moveTo(Math.round(-pageWidth - market.width*0.02),0);
            market.pages[1].active = true;
            market.pages[0].active = true;
            currentPage=market.map;
            currentIndex=1;
            cookie.createCookie("page",1,1);
            loadMap();

        }

        changeTimer(newTimer,color){
            var x=this.width/2 + this.height/25*Math.cos( (Math.PI / 180)*(360/10)*(7.5-(newTimer)));
            var y=this.height*0.79 + this.height/25*Math.sin( (Math.PI / 180)*(360/10)*(7.5-(newTimer)));
            var lf=1;
            if(10-newTimer>10/2)lf=0;
            if(newTimer==10){this.circleTimer.opacity(1).color(svg.WHITE,5,svg.RED);}
            else{this.circleTimer.opacity(1).color(svg.WHITE,5,svg.WHITE);}
            this.component.remove(this.arcTimer);
            this.component.remove(this.timer);
            this.timer = new svg.Text(newTimer);
            this.timer.position(this.width/2,this.height*0.797).font("Calibri",20,1).color(svg.BLACK);
            this.arcTimer = new svg.Path(this.width/2,this.height*0.79-this.height/25);
            this.arcTimer.arc(this.height/25,this.height/25,0,lf,0,x,y).color(svg.WHITE,5,color);
            this.component.add(this.arcTimer);
            this.component.add(this.timer);
        }

        changeText(message,color){
            this.component.remove(this.message);
            this.message = new svg.Text(message).mark("result");
            this.message.position(this.width/2,this.height*0.74).font("calibri",20,1).color(color).opacity(1);
            this.component.add(this.message);
        }

        hideCircle(){
            this.changeTimer("");
            this.circleTimer.opacity(0);
            this.arcTimer.opacity(0);
        }

        launchTimer(seconds,state){
            let fillGlass=new svg.Rect(market.width,market.height).position(market.width/2,market.height/2).opacity(0);
            glassTimer.add(fillGlass);
            market.add(glassTimer);
            market.payment.zoneCode.changeTimer(seconds,svg.RED);
            for(let i =0;i<=seconds+1;i++){
                setTimeout(function(i){
                    return function(){
                        market.payment.zoneCode.changeTimer(seconds-i,svg.RED);
                        market.payment.zoneCode.changeText("Code erroné",svg.BLACK);
                        if(seconds-2>i && i>=(seconds/2)){
                            market.payment.zoneCode.changeTimer(seconds-i,svg.ORANGE);
                        }
                        else if(i>=(seconds-2) && i!=seconds+1){
                            market.payment.zoneCode.changeTimer(seconds-i,svg.GREEN);
                        }
                        else if (i===seconds+1){
                            market.remove(glassTimer);
                            market.payment.zoneCode.changeText("");
                            market.payment.zoneCode.hideCircle();
                        }
                    }
                }(i),i*1000);
            }
        }

        checkPassword(password){
            if(password === "321456987"){
                market.textToSpeech("Code bon ! Veuillez indiquer votre adresse de livraison. ");
                return true;
            }
            return false;
        }
    }

    class Switch{
        constructor(color, width, height){
            this.component = new svg.Translation();
            this.bar = new svg.Rect(width/30,height-2);
            this.component.add(this.bar);
            if(color=="available"){
                this.bar.color(svg.GREEN, 1, svg.GREEN);
                this.component.move(width/2-width/60,0);
            }else if(color=="unavailable"){
                this.bar.color(svg.RED, 1, svg.RED);
                this.component.move(width/2-width/60,0);
            }else{
                if(color=="green"){
                    this.bar.dimension(width,width/30).color(svg.GREEN, 1, svg.GREEN);
                    this.component.move(0,height/2-width/60);
                }else{
                    this.bar.dimension(width,width/30).color(svg.RED, 1, svg.RED);
                    this.component.move(0,height/2-width/60);
                }
            }
        }
    }

    class Round{
        constructor(x,y,width,height,place,left,TPH){
            this.component = new svg.Translation();
            this.titleText = new svg.Text();
            this.roundContent = new svg.Translation();
            this.deliveryRect = new svg.Rect();
            this.jauge=new svg.Rect();

            this.tabH=[];
            this.place=Math.round(place*TPH);
            this.left=left;

            this.component.add(this.roundContent);
            this.roundContent.add(this.titleText);
            this.roundContent.add(this.deliveryRect);

            this.x = x;
            this.y = y;
            this.component.move(x,y);
            this.width = width;
            this.height = height;
        }

        move(x,y){
            this.x=x;
            this.y=y;
            this.roundContent.move(x,y);
        }

        placeElements(){
            this.titleText.position(this.x, this.y - this.height*0.75).message(this.left+" / "+this.place).font("Calibri",this.height,1);
            this.deliveryRect.dimension(this.width,this.height).corners(10,10);
            this.deliveryRect.color(svg.WHITE,1,svg.GREEN);
            this.jauge.position(-this.width/2+this.x+(this.width/(2*this.place)),this.y).color(svg.GREEN,2,svg.GREEN).corners(10,10);
            this.roundContent.add(this.jauge);
        }

        changeColor(bool){
            if(bool==1)
                this.left++;
            else if (bool==2)
                this.left--;
            else {}
            let taille=(this.place-this.left)*(this.width/this.place);
            this.jauge.dimension(taille, this.height);
            this.titleText.message(this.left+" / "+this.place);
            if(this.left<this.place && this.left!=0) {
                this.deliveryRect.color(svg.WHITE,1,svg.GREY_GREEN);
                this.jauge.color(svg.GREY_GREEN,1,svg.GREY_GREEN).position(-this.width/2+((this.place-this.left)*this.width)/(2*this.place),0);
            }
            else if(this.left==0){
                this.deliveryRect.color(svg.WHITE,1,svg.LIGHT_GREY);
                this.jauge.color(svg.LIGHT_GREY,1,svg.LIGHT_GREY).position(-this.width/2+((this.place-this.left)*this.width)/(2*this.place),0);
            }
            else{
                this.deliveryRect.color(svg.WHITE,1,svg.GREEN);
            }
        }

    }

    class Calendar{
        constructor(width,height,x,y){
            this.component = new svg.Translation().mark("calendar");
            this.header = new svg.Translation().mark("calendarHeader");
            this.background = new svg.Translation().mark("calendarBackground");
            this.title = new svg.Rect();
            this.titleText = new svg.Text("Avril");
            this.calendarFirstRow = new svg.Translation();
            this.calendarFirstColumn = new svg.Translation();
            this.calendarContent = new svg.Translation().mark("content");
            this.calendarPositionY = 0;
            this.calendarCases = [];
            this.monthChoice = new svg.Translation().mark("monthChoice");
            this.chevronWest = new svg.Chevron(10, height*0.05, 2, "W").color(svg.WHITE).opacity(0.5);
            this.chevronEast = new svg.Chevron(10, height*0.05, 2, "E").color(svg.WHITE);
            this.ellipseChevronWest = new svg.Ellipse(width*0.02, height*0.04).color(svg.BLACK).opacity(0);
            this.ellipseChevronEast = new svg.Ellipse(width*0.02, height*0.04).color(svg.BLACK).opacity(0);
            this.zoneChevronWest = new svg.Translation().add(this.ellipseChevronWest).add(this.chevronWest).mark("chevronWCalendar");
            this.zoneChevronEast = new svg.Translation().add(this.ellipseChevronEast).add(this.chevronEast).mark("chevronECalendar");
            this.calendarOn=false;
            this.selectedHourday=false;
            this.rounds=[];
            this.choice=null;
            this.address="";
            this.current=true;
            this.hideBehind = new svg.Rect(width*1.1,height*0.5).position(width/2-width/24,0).color([230,230,230]);

            this.dayCases = [];
            this.component.add(this.background).add(this.header);
            this.header.add(this.title);
            this.header.add(this.titleText);
            this.header.add(this.calendarFirstRow);
            this.header.add(this.monthChoice);
            this.header.add(this.hideBehind);
            this.background.add(this.calendarFirstColumn);
            this.background.add(this.calendarContent);


            this.x = x;
            this.y = y;
            this.component.move(x,y);
            this.width = width;
            this.height = height;

            this.picto = new svg.Image("img/panier.png").mark("iconUser");
            this.pictoPosX = this.width*0.15;
            this.pictoPosY = this.height*0.09;
            this.onMove=false;
            this.header.add(this.picto);

            this.calendarWidth = width;
            this.calendarHeight = height*0.8;

            timer.pickDate();
            this.monthNumber = timer.getMonth();
            this.presentMonth = this.monthNumber;
            this.presentYear = timer.getYear();
            this.month = this.getMonth()[this.monthNumber];
            this.year = timer.getYear();

            this.zoneChevronEast.onClick(()=>{
                if(this.chevronEast._opacity!=0.5){
                    this.monthNumber++;
                    if (this.monthNumber===12){
                        this.monthNumber=0;
                        this.year++;
                    }
                    this.month = this.getMonth()[this.monthNumber];
                    this.changeTitleText(this.month+" "+this.year);
                    this.chevronWest.opacity(1);
                    this.chevronEast.opacity(0.5);
                    this.printMonthContent(this.monthNumber,this.year);
                    if(this.choice==null) {
                        this.picto.position(this.pictoPosX,this.pictoPosY);
                    }
                    else{
                        this.header.remove(this.picto);
                        for (let round in this.rounds) {
                            if((this.rounds[round].tabH.dayP == this.choice.tabH.dayP) && (this.rounds[round].tabH.hourAL == this.choice.tabH.hourAL)) {
                                this.checkPlace(this.rounds[round]);
                                this.rounds[round].changeColor(2);
                            }
                        }
                    }
                }
            });

            this.zoneChevronWest.onClick(()=>{
                if(this.chevronWest._opacity!=0.5){
                    this.monthNumber--;
                    if ((this.presentMonth === this.monthNumber) && (this.presentYear === this.year)) {
                        this.chevronWest.opacity(0.5);
                        this.chevronEast.opacity(1);
                        this.month = this.getMonth()[this.monthNumber];
                        this.changeTitleText(this.month + " " + this.year);
                        this.printCurrentMonthContent();
                    }
                    if (this.choice == null) {
                        this.picto.position(this.pictoPosX, this.pictoPosY);
                    }
                    else {
                        this.header.remove(this.picto);
                        for (let round in this.rounds) {
                            if((this.rounds[round].tabH.dayP == this.choice.tabH.dayP) && (this.rounds[round].tabH.hourAL == this.choice.tabH.hourAL)) {
                                this.checkPlace(this.rounds[round]);
                                this.rounds[round].changeColor(2);

                            }
                        }
                    }
                }
            });
        }

        setEventsForScroll() {

            this.background.onMouseDown((e)=>{
                beginMove(e.pageY, "mousemove", "mouseup");
            });

            svg.addEvent(this.background, "touchstart", (e)=>{
                beginMove(e.touches[0].clientY, "touchmove", "touchend");
            });

            let beginMove=(y,eventTypeMove,eventTypeUp)=>{
                this.onMove = true;
                let prevMouse = y;

                svg.addEvent(this.background, eventTypeMove,(e)=>{
                    if (this.onMove) {
                        if (eventTypeMove.includes("mouse")) {
                            toMove(e.pageY, prevMouse);
                            prevMouse = e.pageY;
                        }
                        else {
                            toMove(e.touches[0].clientY, prevMouse);
                            prevMouse = e.touches[0].clientY;
                        }
                    }
                });

                svg.addEvent(this.background, eventTypeUp, ()=>{
                    this.onMove = false;
                    toEndMove();
                });
            };

            let toMove=(y,mouse)=>{
                this.calendarFirstColumn.steppy(1, 1).onChannel("calendarColumn")
                    .moveTo(this.caseWidth/4, this.calendarContent.y - (mouse - y));
                this.calendarContent.steppy(1, 1).onChannel("calendarContent")
                    .moveTo(this.caseWidth/1.65, this.calendarContent.y - (mouse - y));
            };

            let toEndMove=()=>{
                let nbdays = 0;
                if (this.current === true) {
                    nbdays = this.numberDaysThisMonth - timer.getDayInMonth();
                } else {
                    nbdays = this.numberDaysThisMonth-1;
                }
                var height = this.caseHeight * (nbdays);
                if ((this.calendarContent.y + height + this.caseHeight / 2 < market.height)&&(nbdays>10)) {
                    this.calendarContent.smoothy(10, 10).onChannel("calendarContent")
                        .moveTo(this.caseWidth/1.65,market.height-height-this.caseHeight/2);
                    this.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn")
                        .moveTo(this.caseWidth/4,market.height-height-this.caseHeight/2);
                }
                else if((this.calendarContent.y>header.height+this.caseHeight*2)||(nbdays<=10)){
                    this.calendarContent.smoothy(10, 10).onChannel("calendarContent")
                        .moveTo(this.caseWidth/1.65, this.height*0.05+this.title.height*1.5+this.caseHeight*1.5);
                    this.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn")
                        .moveTo(this.caseWidth/4, this.height*0.05+this.title.height*1.5+this.caseHeight*1.5);
                }
            };
        }

        placeElements(){
            this.caseWidth = this.calendarWidth*0.87/11;
            this.caseHeight = this.calendarHeight/10;
            this.picto.position(this.pictoPosX,this.pictoPosY).dimension(this.caseWidth*0.25,this.caseHeight*0.25);
            this.title.dimension(this.calendarWidth*0.995,this.calendarHeight*0.1).color([0, 190, 255],1,svg.LIGHT_GREY).opacity(1);
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.BLACK);

            this.chevronWest.position(-this.calendarWidth/2.1,0).mark("chevronWest");
            this.chevronEast.position(this.calendarWidth/2.1,0).mark("chevronEast");
            this.ellipseChevronWest.position(-this.calendarWidth/2.1,0).mark("ellipseChevronWest");
            this.ellipseChevronEast.position(this.calendarWidth/2.1,0).mark("ellipseChevronEast");
            this.monthChoice.add(this.title).add(this.titleText).add(this.zoneChevronEast).add(this.zoneChevronWest);
            this.monthChoice.move(this.width/2-this.caseWidth/2, this.height*0.05+this.title.height/2);

            this.header.add(new svg.Text("Disponible").font("calibri",this.caseWidth/5,1).color(svg.DARK_BLUE).position(this.width*0.03,this.height*0.05+this.title.height*1.70));
            this.header.add(new svg.Text("Indisponible ").font("calibri",this.caseWidth/5,1).color(svg.DARK_BLUE).position(this.width*0.037,this.height*0.05+this.title.height*2.2));
            this.header.add(new Switch('green', this.caseWidth/6, this.caseHeight/4).component.move(-this.width*0.02,this.height*0.05+this.title.height*1.6));
            this.header.add(new Switch('red', this.caseWidth/6, this.caseHeight/4).component.move(-this.width*0.02,this.height*0.05+this.title.height*2.1));
            this.printCurrentMonthContent();
        }

        printCurrentMonthContent(){
            let removeOldDisplay = ()=>{
                this.current=true;
                this.background.remove(this.calendarContent);
                this.background.remove(this.calendarFirstColumn);
                this.header.remove(this.calendarFirstRow);
                this.monthNumber=timer.getMonth();
                this.month=this.getMonth()[this.monthNumber];
                this.chevronWest.opacity(0.5);
                this.chevronEast.opacity(1);
                this.current=true;
                this.calendarFirstColumn = new svg.Translation();
                this.calendarContent = new svg.Translation();
                this.changeTitleText(this.month+" "+this.year);
                this.numberDaysThisMonth = this.daysInMonth(timer.getMonth(),timer.getYear());
                this.header.add(this.monthChoice);
                this.header.add(this.picto);
            };
            let showDaysColumn = ()=>{
                let tabDays = [];
                for(let j=0;j<this.numberDaysThisMonth-timer.getDayInMonth()+1;j++){
                    this.dayCases[j] = new svg.Translation();
                    this.dayCases[j].add(new svg.Rect(this.caseWidth*1.5,this.caseHeight).color(svg.ALMOST_WHITE,1,svg.WHITE));
                    let text = "";
                    if (j ==0){
                        text = "Aujourd'hui";
                    }
                    else if (j ==1){
                        text = "Demain";
                    }
                    else{
                        text = this.getWeekDay()[(timer.getDayInWeek()+j)%7]+" "+ (timer.getDayInMonth()+j);
                    }
                    this.dayCases[j].add(new svg.Text(text).font("calibri", this.calendarWidth /70, 1).color(svg.DARK_BLUE));
                    tabDays.push(text);
                    this.calendarFirstColumn.add(this.dayCases[j]);
                    this.dayCases[j].move(0,j*this.caseHeight);
                    this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight*1.5;
                    this.calendarFirstColumn.move(this.caseWidth/4,this.calendarPositionY);

                }
                this.background.add(this.calendarFirstColumn);
                this.calendarFirstColumn.mark("column");
                return tabDays;
            };
            let showHoursLine = () => {
                let tabHours = [];
                for (var i=0;i<12;i++){
                    let hourCase = new svg.Translation();
                    // hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREY,1,svg.LIGHT_GREY));
                    if(i!=0) {
                        hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREY,1,svg.LIGHT_GREY));
                        let t=new svg.Text((i + 8) + "H").font("calibri", this.width / 55, 1).color(svg.BLACK).position(0,this.caseHeight*0.2);

                        hourCase.add(t);
                        if(i==4){
                            hourCase.add(new Switch('midday',this.caseWidth,this.caseHeight).component);
                        }

                        tabHours.push((i + 8) + "h");
                    }

                    hourCase.move(i*this.caseWidth,0);
                    this.calendarFirstRow.add(hourCase);
                    this.calendarFirstRow.move(this.caseWidth/1.65,this.height*0.05+this.title.height*1.75);
                }
                this.header.add(this.calendarFirstRow);
                return tabHours;
            };
            let showCalendarBackground = (tabDays, tabHours) => {
                for(let i = 0; i<this.numberDaysThisMonth-timer.getDayInMonth()+1;i++){
                    let line = new svg.Translation();
                    for (var j=0;j<11;j++){
                        let element = new svg.Rect(this.caseWidth,this.caseHeight);
                        if(j%2){
                            element.color(svg.ALMOST_WHITE,1,svg.ALMOST_WHITE).position(j*this.caseWidth,0).opacity(1);
                        }else{

                            element.color(svg.WHITE,1,svg.WHITE).position(j*this.caseWidth,0).opacity(1);
                        }

                        line.add(element);
                        this.calendarCases.push({background:element,hour:tabHours[j],day:tabDays[i], droppable : false, available:false,
                            x:j*this.caseWidth,y:i*this.caseHeight+this.calendarPositionY});
                    }
                    line.move(this.caseWidth,this.caseHeight*i);
                    this.calendarContent.add(line);
                    this.calendarContent.move(this.caseWidth/1.65,this.calendarPositionY)
                }
                this.background.mark("calendarBackground");
                this.background.add(this.calendarContent);
                this.calendarContent.mark("content");
                this.component.add(this.background).add(this.header);
            };

            removeOldDisplay();
            let tabDays = showDaysColumn();
            let tabHours = showHoursLine();
            showCalendarBackground(tabDays,tabHours);
            this.placeRounds();
            this.setEventsForScroll();
        }

        placeRounds(){
            let dateInMonth = () => {
                let dayMonth = [];
                if(this.current===true){
                    for(let i = 0; i<this.numberDaysThisMonth-timer.getDayInMonth()+1;i++){
                        let str = "";
                        if(timer.getDayInMonth()+i>=10)
                            str += Number(timer.getDayInMonth() + i)+ "/";
                        else
                            str +="0"+Number(timer.getDayInMonth() + i) +"/";
                        if(timer.getMonth()<10)
                            str += "0"+(timer.getMonth()+1) +"/"+timer.getYear();
                        else
                            str += (timer.getMonth()+1) +"/"+timer.getYear();
                        dayMonth.push(str);
                    }
                }
                else{
                    for(let i = 0; i<this.numberDaysThisMonth;i++){
                        let str = "";
                        if(i>=10)
                            str += i+ "/";
                        else
                            str +="0"+i +"/";
                        if(this.monthNumber<10)
                            str += "0"+(this.monthNumber+1) +"/"+this.year;
                        else
                            str += (this.monthNumber+1) +"/"+this.year;
                        dayMonth.push(str);
                    }
                }
                return dayMonth;
            };
            let roundsToPlace = () => {
                let tab = [];
                for(let j = 0; j<dayMonth.length;j++){
                    tab = placePerDay(dayMonth[j],tab);
                }

                this.address=market.calendar.address;

                var tomorrow = timer.getDate(timer.getTime() + 24 * 60 * 60 * 1000);
                var afterTomorrow = timer.getDate(timer.getTime() + 2 * 24 * 60 * 60 * 1000);
                var dayTest = timer.getDate(1496268000000 + 24 * 60 * 60 * 1000);
                var dayTest2 = timer.getDate(1496268000000 + 2 * 24 * 60 * 60 * 1000);
                var dayTest3 = timer.getDate(1497045600000);
                var nextMonth = timer.getDate(timer.getTime() + 31 * 24 * 60 * 60 * 1000);
                var nextMonthAndOne = timer.getDate(timer.getTime() + 32 * 24 * 60 * 60 * 1000);
                let modul = timer.getDayInMonth()<=9?"0":"";
                let modulTomorrow = tomorrow.getDate()<=9?"0":"";
                let modulAfterTomorrow = afterTomorrow.getDate()<=9?"0":"";
                let modulTest = "0";
                let modulTest2 = "0";
                let modulTest3 = "";
                let modulDayNextMonth = nextMonth.getDate()<=9?"0":"";
                let modulDayNextMonthAndOne = nextMonthAndOne.getDate()<=9?"0":"";
                let modulMonth = timer.getMonth()<=9?"0":"";
                let modulNextMonth = nextMonth.getMonth()<=9?"0":"";
                tab.push({
                    dayP: modul+timer.getDayInMonth() + "/" + modulMonth + (timer.getMonth() + 1) + "/" + timer.getYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 2, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulTomorrow+tomorrow.getDate() + "/" + modulMonth + (tomorrow.getMonth() + 1) + "/" + tomorrow.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 3, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulAfterTomorrow+afterTomorrow.getDate() + "/" + modulMonth + (afterTomorrow.getMonth() + 1) + "/" + afterTomorrow.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 4, TPH: 2.5, address : this.address
                });
                tab.push({
                    dayP: modulTest+dayTest.getDate() + "/" + modulMonth + (dayTest.getMonth() + 1) + "/" + dayTest.getFullYear(),
                    hourDL: "13", hourAL: "17", nbT: 4, left: 3, TPH: 1.5, address: this.address
                });
                tab.push({
                    dayP: modulTest2+dayTest2.getDate() + "/" + modulMonth + (dayTest2.getMonth() + 1) + "/" + dayTest2.getFullYear(),
                    hourDL: "16", hourAL: "18", nbT: 2, left: 1, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulTest3+dayTest3.getDate() + "/" + modulMonth + (dayTest3.getMonth() + 1) + "/" + dayTest3.getFullYear(),
                    hourDL: "16", hourAL: "18", nbT: 2, left: 1, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulDayNextMonth+nextMonth.getDate() + "/" + modulNextMonth + (nextMonth.getMonth() + 1) + "/" + nextMonth.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 4, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulDayNextMonthAndOne+nextMonthAndOne.getDate() + "/" + modulNextMonth + (nextMonthAndOne.getMonth() + 1) + "/" + nextMonthAndOne.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 1, TPH: 2, address : this.address
                });
                return tab;
            };
            let drawAllRoundsInEachDay = (dayMonth,tab) => {
                this.rounds=[];
                for(let i = 0; i<dayMonth.length;i++){
                    let totLeft = 0;
                    for(let j = 0; j < tab.length; j++){
                        if(dayMonth[i]==tab[j].dayP){
                            totLeft += tab[j].left;
                            let newRound = new Round(0,0,tab[j].nbT*this.caseWidth,this.caseHeight/4,tab[j].nbT,tab[j].left, tab[j].TPH);
                            newRound.roundContent.mark("round "+this.rounds.length);
                            newRound.tabH=tab[j];
                            newRound.placeElements();
                            newRound.move((tab[j].hourDL-9)*this.caseWidth+newRound.width/2+this.caseWidth/2,
                                i*this.caseHeight+this.caseHeight*0.1);
                            newRound.roundContent.onClick(()=>{
                                this.checkPlace(newRound);
                            });

                            for(let k = 0; k < tab[j].nbT+1;k++){
                                this.calendarCases[(i*11+Number(tab[j].hourDL-9))+k].droppable = true;
                                this.calendarCases[(i*11+Number(tab[j].hourDL-9))+k].available = true;
                            }
                            this.calendarContent.add(newRound.component);
                            this.background.add(this.calendarContent);
                            newRound.changeColor(3);
                            this.rounds.push(newRound);
                        }
                    }

                    if(totLeft == 0) {
                        this.dayCases[i].add(new Switch("unavailable",this.caseWidth*1.5,this.caseHeight).component)

                    }else {
                        this.dayCases[i].add(new Switch("available",this.caseWidth*1.5,this.caseHeight).component)
                    }
                }
            };

            let dayMonth = dateInMonth();
            let tab = roundsToPlace();
            drawAllRoundsInEachDay(dayMonth,tab);
        }

        printMonthContent(month,year){
            let removeOldDisplay = () => {
                this.current=false;
                for(let i = 0; i<this.rounds.length;i++){
                    this.calendarContent.remove(this.rounds[i].component);
                }
                this.background.remove(this.calendarContent);
                this.background.remove(this.calendarFirstColumn);
                this.header.remove(this.calendarFirstRow);
                this.numberDaysThisMonth=timer.getNumberOfDaysInMonth(month,year);
                this.header.add(this.monthChoice);
                this.header.add(this.picto);
            };
            let showDaysColumn = () => {
                let tabDays = [];
                this.startDay=new Date(year,month,0).getDay()+1;

                for(let j=0;j<=this.numberDaysThisMonth-1;j++){
                    this.dayCases[j] = new svg.Translation();
                    this.dayCases[j].add(new svg.Rect(this.caseWidth*1.5,this.caseHeight).color(svg.ALMOST_WHITE,1,svg.WHITE));
                    let text = this.getWeekDay()[(j+this.startDay)%7]+" "+(j+1);
                    this.dayCases[j].add(new svg.Text(text).font("calibri", this.calendarWidth /70, 1).color(svg.DARK_BLUE));
                    tabDays.push(text);
                    this.calendarFirstColumn.add(this.dayCases[j]);
                    this.dayCases[j].move(0,j*this.caseHeight);
                    this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight;
                    this.calendarFirstColumn.move(this.caseWidth/4,this.calendarPositionY);
                }
                this.background.add(this.calendarFirstColumn);
                this.calendarFirstColumn.mark("column");
                return tabDays;
            };
            let showHoursLine = () => {
                let tabHours = [];
                for (var i=0;i<12;i++){
                    let hourCase = new svg.Translation();
                    if(i!=0){
                        hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREY,1,svg.LIGHT_GREY));

                        let t=new svg.Text((i + 8) + "H").font("calibri", this.width / 55, 1).color(svg.DARK_BLUE).position(0,this.caseHeight*0.2);
                        hourCase.add(t);
                        if(i==4){
                            hourCase.add(new Switch('midday',this.caseWidth,this.caseHeight).component);
                        }


                        tabHours.push((i + 8) + "h");
                    }
                    else hourCase.add(new svg.Text("").font("calibri", this.width / 55, 1).color(svg.BLACK));
                    hourCase.move(i*this.caseWidth,0);
                    this.calendarFirstRow.add(hourCase);
                    this.calendarFirstRow.move(this.caseWidth/1.65-3,this.height*0.05+this.title.height*1.75);
                }
                this.header.add(this.calendarFirstRow);
                return tabHours;
            };
            let showCalendarBackground = (tabDays, tabHours) => {
                for(var i=0;i<=this.numberDaysThisMonth-1;i++){
                    let line = new svg.Translation();
                    for (var j=0;j<11;j++){
                        let element = new svg.Rect(this.caseWidth,this.caseHeight);
                        if(j%2){
                            element.color(svg.ALMOST_WHITE,1,svg.ALMOST_WHITE).position(j*this.caseWidth,0).opacity(1);
                        }else{
                            element.color(svg.WHITE,1,svg.WHITE).position(j*this.caseWidth,0).opacity(1);
                        }
                        line.add(element);
                        this.calendarCases.push({background:element,hour:tabHours[j],day:tabDays[i],
                            x:0+j*this.caseWidth,y:i*this.caseHeight+this.calendarPositionY});

                    }
                    line.move(this.caseWidth,this.caseHeight*i);
                    this.calendarContent.add(line);
                    this.calendarContent.move(this.caseWidth/1.65,this.calendarPositionY)
                }

                this.background.mark("calendarBackground");
                this.background.add(this.calendarContent);
                this.calendarContent.mark("content");
                this.component.add(this.background).add(this.header);
            };

            removeOldDisplay();
            let tabDays = showDaysColumn();
            let tabHours = showHoursLine();
            showCalendarBackground(tabDays,tabHours);
            this.placeRounds();
            this.setEventsForScroll();
        }

        checkPlace(round){
            if(round.left>0 && this.choice==null){
                this.choice = round;
                round.changeColor(2);
                this.header.remove(this.picto);
                this.picto.position(0,0);
                round.roundContent.add(this.picto);
                this.choiceRdv=round.tabH.dayP;
                market.textToSpeech("Souhaitez-vous confirmer votre choix le :"+this.choiceRdv.split("/").join(" ")
                    + " entre "+round.tabH.hourDL+" et "+(Number(round.tabH.hourAL))+" heure", "fr");
                this.selectedHourday=true;
            }
            else if(this.choice!=round && this.choice!=null && round.left>0) {
                for(let round in this.rounds){
                    if ((this.rounds[round].tabH.dayP==this.choice.tabH.dayP) && (this.rounds[round].tabH.hourAL == this.choice.tabH.hourAL)
                        && (this.rounds[round].tabH.address == this.choice.tabH.address )){
                        this.rounds[round].changeColor(1);
                    }
                }
                this.picto.position(0,0);
                this.choice = round;
                round.changeColor(2);
                round.roundContent.add(this.picto);
                this.choiceRdv=round.tabH.dayP;
                market.textToSpeech("Souhaitez-vous confirmer votre choix le :"+this.choiceRdv.split("/").join(" ")
                    + " entre "+round.tabH.hourDL+" et "+(Number(round.tabH.hourAL))+" heure", "fr");
                this.selectedHourday=true;
            }
        }

        changeTitleText(newText){
            this.monthChoice.remove(this.titleText);
            this.titleText = new svg.Text(newText);
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.WHITE);
            this.monthChoice.add(this.titleText);
        }

        getWeekDay(){
            return {
                0: "Dimanche",
                1: "Lundi",
                2: "Mardi",
                3: "Mercredi",
                4: "Jeudi",
                5: "Vendredi",
                6: "Samedi",
            }
        }

        getMonth() {
            return {
                0: "Janvier",
                1: "Février",
                2: "Mars",
                3: "Avril",
                4: "Mai",
                5: "Juin",
                6: "Juillet",
                7: "Août",
                8: "Septembre",
                9: "Octobre",
                10: "Novembre",
                11: "Décembre"
            }
        }

        daysInMonth(month, year){
            return timer.getNumberOfDaysInMonth(month,year);
        }
    }

    ////////////VIGNETTES//////////////////
    class Thumbnail {
        constructor(image,title){
            this.component = new svg.Translation();
            this.image = new svg.Image(image);
            this.name = title;
            this.title = new svg.Text(title);
            this.background = new svg.Rect().color(svg.WHITE);
            this.component.add(this.background);
            this.component.add(this.image);
            this.component.add(this.title);

            this.x = 0;
            this.y = 0;
            this.component.move(this.x,this.y);
            this.width = 0;
            this.height = 0;
        }

        move(x,y){
            this.x = x;
            this.y = y;
            this.component.move(x,y);
        }

        placeElementsDnD(current){
            this.width = current.width;
            this.height = current.height;
            this.image.position(this.width*0.8,this.height/2).dimension(this.height,this.height);
            this.title.position(this.width*0.4,this.height/2).font("Calibri",this.height*0.3,1).color(svg.BLACK);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height);
        }
    }

    class ThumbnailCategorie extends Thumbnail {
        constructor(image,title){
            super(image,title);
            this.component.add(this.title);

            this.width = market.width*0.08;
            this.height = market.height*0.2;
            this.background= new svg.Rect(this.width,this.height).color(svg.WHITE);
            this.component.add(this.background);
            this.component.add(this.image);
            this.component.add(this.title);

            this.responsivName = this.name.split(" ");
            if(this.responsivName.length>1){
                this.title.message(this.responsivName[0]);
                this.title2 = new svg.Text(this.responsivName[1]+" "+(this.responsivName[2]?this.responsivName[2]:""));
                this.component.add(this.title2);
            }
            else if(this.name.length>10){
                this.responsivName=[this.name.substring(0,Math.floor(this.name.length/2)),this.name.substring(Math.floor(this.name.length/2))];
                this.title.message(this.responsivName[0]);
                this.title2 = new svg.Text(this.responsivName[1]);
                this.component.add(this.title2);
            }

            this.active = false;

            //GESTION SELECTION//
            let current = this;
            this.component.onClick(()=>{
                if(!categories.navigation) market.changeRay(current.name);
                else categories.navigation=false;
            });
        }

        placeElements(){
            this.image.position(this.width/2,this.height*0.4).dimension(this.width,this.height*0.6).mark(this.name);
            this.title.position(this.width/2,this.height*0.85).font("Calibri",this.height*0.10,1)
                .color([[0,120,200]]).mark(this.name + " title").anchor("middle");
            runtime.attr(this.title.component,"font-weight","bold");
            this.background.position(this.width/2,this.height/2).corners(8,8);

            if(this.responsivName.length>1) {
                this.title2.position(this.width/2,this.height*0.95).font("Calibri",this.height*0.10,1)
                    .color([[0,120,200]]).mark(this.name + " title").anchor("middle");
                runtime.attr(this.title2.component,"font-weight","bold");
            }
        }
    }

    class ThumbnailRayon extends Thumbnail {
        constructor(image,title,price,complement,cat)
        {
            super(image,title);
            this.component.add(this.image);
            this.component.add(this.title);
            this.price = price;
            this.complement = complement;
            this.printPrice = new svg.Text(price + " €" + complement);
            this.component.add(this.printPrice);
            this.categorie=cat;
            this.name = title;
            this.width = market.width*0.17;
            this.height = market.height*0.23;
            this.toAdd=[];
            this.waitingNumber = new svg.Text("");
            this.component.add(this.waitingNumber);
            this.anim=false;

            this.drawNumber = null;
            this.component.onMouseDown((e)=>{
                this.toDraw(e.pageX);
            });

            // gestion tactile pour le dessin:
            this.drawNumber = null;
            svg.addEvent(this.component, "touchstart", (e)=>{
                this.toDraw(e.touches[0].clientX)
            });
        }

        toDraw(x){
            if(!categories.currentRayOnDrawing) {
                categories.currentRayOnDrawing=categories.ray.name;
            }
            if(categories.currentRayOnDrawing==categories.ray.name) {
                this.drawNumber = new svg.Drawing(0, 0).mark("draw " + this.name);
                if (!categories.ray.currentDrawn) categories.ray.currentDrawn = this;
                neural.init_draw(this.drawNumber, x, 0, this.name, this.getNumber, this.printNumber, this, glassCanvas, categories.ray.gesture);
                glassCanvas.add(this.drawNumber);
                this.drawNumber.opacity(0);
            }
        }

        getNumber(number,element){
            let getGrammaticalTransition=(element)=>{
                if(element.complement) {
                    let letter = element.name[0].toLowerCase();
                    if (letter == "a" || letter == "e" || letter == "i" || letter == "y" || letter == "é" || letter == "o") {
                        return "d'";
                    }
                    else {
                        return "de ";
                    }
                }
                else if(element.categorie=="Voyages"){
                    return "voyage à ";
                }
                else return "";
            };

            categories.ray.currentDrawn = null;
            if (categories.ray.name==categories.currentRayOnDrawing){
                if (number == "click") {
                    element.addAnimation("1");
                    market.basket.addProducts(element, "1");
                    element.anim = true;
                    market.textToSpeech("Ok, j'ajoute 1" + element.complement.replace("/", "")
                        + " " + getGrammaticalTransition(element) + element.name + " au panier");
                    element.anim = true;

                }
                else if (number != "?") {
                    let nb = "";
                    number=number.toString();
                    for (var c of number.split('')) {
                        if (c == "?") {
                            market.textToSpeech("Je n'ai pas compris le nombre");
                            return;
                        } else if (c == "0") {
                            if (nb != "") nb += c;
                        } else nb += c;
                    }
                    element.addAnimation(number);

                    if (nb != "") {
                        market.textToSpeech("Ok, j'ajoute " + nb + element.complement.replace("/", "")
                            + " " + getGrammaticalTransition(element) + element.name + " au panier");
                        market.basket.addProducts(element, parseInt(nb));
                    } else
                        market.textToSpeech("Je ne peux pas ajouter 0 " + element.name);
                } else market.textToSpeech("point d'interrogation");
            }
            categories.currentRayOnDrawing=null;
        }

        printNumber(number){
            if(categories.ray.currentDrawn){
                categories.ray.currentDrawn.component.remove(categories.ray.currentDrawn.waitingNumber);
                categories.ray.currentDrawn.waitingNumber = new svg.Text(number).color(svg.BLACK,2,svg.WHITE);
                categories.ray.currentDrawn.waitingNumber.position(categories.ray.currentDrawn.width/2,categories.ray.currentDrawn.height*0.65)
                    .font("Calibri",categories.ray.currentDrawn.width*0.5,1).opacity(0.7);
                categories.ray.currentDrawn.component.add(categories.ray.currentDrawn.waitingNumber);
            }
        };

        placeElements(place) {
            this.component.mark("Product " + this.name);
            this.image.position(this.width/2,this.height*0.35).dimension(this.width*0.7,this.height*0.6).mark("Image " + this.name);
            this.background .position(this.width/2,this.height/2).dimension(this.width,this.height).corners(10,10);
            this.title      .position(this.width*0.15,this.height*0.75) .font("Calibri",this.height*0.1,1).color(svg.BLACK)
                .anchor("left").mark("Title "+this.name);
            this.printPrice .font("Calibri",this.height*0.1,1).color([255, 110, 0]).position(this.width*0.15,this.height*0.90).anchor("left");

            runtime.attr(this.printPrice.component, "font-weight", "bold");
        }

        addAnimation(number){
            let n =number.split('');
            let removeNumber = (element)=>{
                for(var c=0;c<this.toAdd.length;c++){
                    element.component.remove(this.toAdd[c]);
                }
            };
            if(number!="0" || number.length!=1){
                for(let i=0; i<number.length;i++){
                    this.toAdd[i] = new svg.Text(n[i]).position((i+1)*(this.width/(number.length+1)),this.height/1.5)
                        .font("Calibri",this.height/1.5,1).color(svg.BLACK,2,svg.WHITE).opacity(0.7);
                    this.component.add(this.toAdd[i]);
                }
            }

            this.component.onMouseDown(()=>{});
            svg.addEvent(this.component, "touchstart", (e)=>{});

            setTimeout(()=>{
                removeNumber(this);
                this.anim=false;

                this.component.onMouseDown((e)=>{
                    this.toDraw(e.pageX);
                });

                svg.addEvent(this.component, "touchstart", (e)=>{
                    this.toDraw(e.touches[0].clientX);
                });
            },1000);
        }
    }

    class ThumbnailBasket extends ThumbnailRayon{
        constructor(image,title,price,complement,cat){
            super(image,title,price,complement,cat);
            this.quantity = 0;
            this.name = title;

            this.component.mark(this.name);
            this.width = market.basket.component.width;
            this.height = market.basket.component.height*0.1;
            this.comp = complement.replace("/","");
            this.compTitle= new svg.Text(this.comp);
            this.component.add(this.compTitle);
        }

        addQuantity(num){
            this.quantity = this.quantity+parseInt(num);
        }

        minusQuantity(num){
            this.quantity = this.quantity-parseInt(num);
        }

        changeText(newText){
            this.component.remove(this.printPrice);
            this.printPrice = new svg.Text(newText).anchor("left");
            this.printPrice.position(this.width*0.05,this.height*0.5).font("Tahoma",this.height*0.3,1).color([255, 110, 0]);
            this.component.add(this.printPrice);
            if((newText>1)&&(this.comp!="")){
                this.component.remove(this.compTitle);
                this.compTitle = new svg.Text(this.comp+"s");
                this.compTitle.position(this.width*0.15,this.height*0.5).font("Tahoma",this.height*0.3,1).color([255, 110, 0]).anchor("left");
                this.component.add(this.compTitle);
            }
            else{
                this.component.remove(this.compTitle);
                this.compTitle = new svg.Text(this.comp);
                this.compTitle.position(this.width*0.15,this.height*0.5).font("Tahoma",this.height*0.3,1).color([255, 110, 0]).anchor("left");
                this.component.add(this.compTitle);
            }
        }

        placeElements(){
            this.component.mark("Product basket " + this.name);
            this.image.position(this.width*0.8,this.height*0.4).dimension(this.height*0.90,this.height*0.90).mark(this.name);
            this.printPrice.position(this.width*0.05,this.height*0.5).font("Tahoma",this.height*0.3,1).color([255, 110, 0]).anchor("left");
            this.title.position(this.width*0.30,this.height*0.5).mark("title "+this.name).anchor("left").font("Tahoma",this.height*0.3,1);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).mark("background "+this.name);
            this.compTitle.position(this.width*0.15,this.height*0.5).font("Tahoma",this.height*0.3,1).color([255, 110, 0]).anchor("left");
        }
    }

    class Map{
        constructor(width,height,x,y){
            this.component = new svg.Translation();
            this.foreign = runtime.create("foreignObject");
            runtime.attrNS(this.foreign,"style","position: absolute; left:100;top:100; border:1px solid black");
            this.divMap = runtime.createDOM('div');
            runtime.attr(this.divMap,"id","divMap");
            runtime.add(this.foreign,this.divMap);
            runtime.add(this.component.component,this.foreign);
            this.mapHeight=height*0.90;
            this.mapWidth=width*1.21*0.58;
            this.x=x;
            this.y=y;
            runtime.attr(this.divMap,"style","height: "+this.mapHeight+"px; width: "+
                this.mapWidth+"px; left:"+(this.x)+"px;top:"+(this.y)+"px;");

            this.input = runtime.createDOM('input');
            runtime.attr(this.input,"id","pac-input");
            runtime.attr(this.input,"class","controls");
            runtime.attr(this.input,"placeholder","Enter a location");
            runtime.attr(this.input,"style","height: 25px; width: 300px; ");
            runtime.add(this.foreign,this.input);

            this.listMarkers = new svg.Translation();
            this.component.add(this.listMarkers);
        }

        updateMarkersSide(){
            let removeOldMarkers = () => {
                market.map.component.remove(market.map.listMarkers);
            };
            let initMarkers = () => {
                market.map.listMarkers=new svg.Translation();
                let width = market.width*0.2;
                let height = market.height*0.05;
                let tab=market.mapsfunction.getMarkers();

                let meImageMarker = new svg.Image("img/map-marker-blue.png")
                    .position(width*0.05,height/2).dimension(height*1.2,height*1.2);
                let meTitle = [currentMapSearch==""?"Ma Position":"Mon Adresse :"," "+currentMapSearch];
                let meTitleMarker = new svg.Translation()
                    .add(new svg.Text(" "+meTitle[0]).font("Calibri",height*0.5,1).position(width*0.15,height*0.3).anchor("left"))
                    .add(new svg.Text(""+meTitle[1].split(",")[0]).font("Calibri",height*0.45,1).position(width*0.15,height*0.70).anchor("left"));
                if(meTitle[1].split(",").length>1){
                    meTitleMarker.add(new svg.Text(""+meTitle[1].split(",")[1]+meTitle[1].split(",")[2]).font("Calibri",height*0.45,1)
                        .position(width*0.15,height*1.1).anchor("left"));
                }
                let meNewMarker = new svg.Translation().add(meImageMarker).add(meTitleMarker);
                meNewMarker.move(0,0);
                market.map.listMarkers.add(meNewMarker);
                return tab;
            };
            let placeAllMarkers = (tab) => {
                let width = market.width*0.2;
                let height = market.height*0.05;
                let place = 1;
                for(let i in tab) {
                    if (tab[i].map){
                        let imageMarker = new svg.Image("img/" + (tab[i].animating ? "map-marker-green.png" : "map-marker-red.png"))
                            .position(width * 0.05, height / 2).dimension(height * 1.2, height * 1.2);
                        let title = tab[i].title.split(",");
                        let titleMarker = new svg.Translation()
                            .add(new svg.Text(" " + title[0]).font("Calibri", title[0].length < 25 ? height * 0.45 : height * 0.4, 1)
                                .position(width * 0.15, height * 0.3).anchor("left"))
                            .add(new svg.Text(title[1]).font("Calibri", height * 0.45, 1).position(width * 0.15, height * 0.70).anchor("left"))
                            .add(new svg.Text(title[2]).font("Calibri", height * 0.45, 1).position(width * 0.15, height * 1.10).anchor("left"));
                        let numMarker = new svg.Text(i).position(width * 0.05, height * 0.40).anchor("middle").font("Calibri", height * 0.4, 1);
                        let newMarker = new svg.Translation().add(imageMarker).add(titleMarker).add(numMarker);
                        newMarker.move(0, (place) * height * 2);
                        place++;
                        market.map.listMarkers.add(newMarker);
                    }
                }
                market.map.component.add(market.map.listMarkers);
                market.map.listMarkers.move(market.width*0.75,market.height*0.08);
            };

            removeOldMarkers();
            let tab = initMarkers();
            placeAllMarkers(tab);
        }
    }

    market.changeRay=function(name){
        let tab=[];
        if(name=="Recherche"){
            tab=categories.currentSearch;
        }
        else tab = param.data.makeVignettesForRay(name,ThumbnailRayon);
        for(i of categories.tabCategories){
            if(i.name==name){
                i.background.color([210,210,210]);
                i.active=true;
            }
            else{
                i.background.color(svg.WHITE);
                i.active=false;
            }
        }

        if(categories.rayTranslation!=null){
            mainPage.remove(categories.rayTranslation).remove(categories.transRect).remove(zoneBasket).remove(zonePayment);
        }

        categories.ray=new Ray(market.width*0.76, market.height * 0.75, 0, market.height / 4, tab, name);
        categories.rayTranslation = new svg.Translation().add(categories.ray.component).mark("ray " + name);
        mainPage.add(categories.rayTranslation).add(categories.transRect).add(zoneBasket).add(zonePayment);


        let cookies = cookie.getCookie("ray");
        if(cookies){
            cookie.deleteCookie("ray");
        }
        cookie.createCookie("ray", categories.ray.name, 1);

    };

    function search(sentence,config){
        sentence=prepareVocalMessage(sentence);
        let jsonFile = param.data.getJson();
        let words = sentence.split(" ");
        var tabProduct = [];
        var tabTotalCat = [];
        let catDone= [];
        let prodDone = [];
        for (var i=0; i<words.length;i++){
            for (var cat in jsonFile){
                if(config=="all"){
                    if (words[i].toLowerCase().includes(prepareVocalMessage(cat).toLowerCase())
                        || (words[i] + " " + words[i + 1]).toLowerCase().includes(prepareVocalMessage(cat).toLowerCase())
                        || (words[i] + " " + words[i + 1] + " " + words[i + 2]).toLowerCase().includes(prepareVocalMessage(cat).toLowerCase())
                        || (words[i] + "s").toLowerCase().includes(prepareVocalMessage(cat).toLowerCase())) {
                        if(catDone.indexOf(cat)==-1){
                            catDone.push(cat);
                            var tabCat = param.data.makeVignettesForRay(cat, ThumbnailRayon);
                            tabTotalCat = tabTotalCat.concat(tabCat);
                        }
                    }
                }
                var products = jsonFile[cat];
                for (var prodName in products){
                    if (words[i].toLowerCase().includes(prepareVocalMessage(prodName).toLowerCase())
                        ||(words[i]+" "+words[i+1]).replace("-"," ").toLowerCase().includes(prepareVocalMessage(prodName).toLowerCase())
                        ||(words[i]+" "+words[i+1]+" "+words[i+2]).toLowerCase().includes(prepareVocalMessage(prodName).toLowerCase())
                        ||(words[i] + "s").toLowerCase().includes(prepareVocalMessage(prodName).toLowerCase())){
                        if(prodDone.indexOf(prodName)==-1) {
                            prodDone.push(prodName);
                            var prod = products[prodName];
                            var thumbnailProduct = new ThumbnailRayon(prod.image, prod.nom, prod.prix, prod.complement, cat);
                            tabProduct.push(thumbnailProduct);
                        }
                    }
                }
            }
        }
        var tabThumbnailProd = tabTotalCat.concat(tabProduct);
        return tabThumbnailProd;
    }

    function doSearch(search) {
        mainPage.remove(categories.rayTranslation);
        zoneCategories.remove(categories.component);
        let tab = search;
        let tabCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);
        tabCategories.push(new ThumbnailCategorie("img/search.png","Recherche"));
        categories=new ListCategorie(market.width*0.76,market.height*0.22,0,market.height*0.04,tabCategories);
        categories.currentSearch=tab;
        zoneCategories.add(categories.component);
        mainPage.add(zoneCategories);
        market.changeRay("Recherche");
    }

    market.vocalRecognition = (message)=>{
        let chooseAddressUsingVocalMessage = () => {
            let words = message.split(" ");
            for (var i = 0; i < words.length; i++) {
                if ((parseInt(words[i]) > 0 && parseInt(words[i]) < 1000) ||
                    ((words[i] == "avenue") || (words[i] == "rue") || (words[i] == "route") || (words[i] == "boulevard") || (words[i] == "quai")
                    || (words[i] == "allée") || (words[i] == "impasse") || (words[i] == "chemin"))) {
                    message = message.substring(message.indexOf(words[i]));
                    currentMapSearch = message;
                    i = words.length;
                    market.textToSpeech("Voici le magasin qui vous livrera à " + message, "fr");
                    market.mapsfunction.research(message);
                    setTimeout(()=>{
                        market.map.updateMarkersSide();
                    },500);
                    return true;
                }
                else if (words[i].includes("valide")) {
                    market.toCalendar();
                    return true;
                }
            }
            return false;
        };
        let chooseRoundUsingVocalMessage = () => {
            let lookForADate = (word,round) => {
                if (word == parseInt(round.tabH.dayP.substring(0, 2))
                    && round.tabH.left !== 0){
                    return round;
                }
                else if((word == "aujourd'hui")
                    &&(timer.getDayInMonth()==parseInt(round.tabH.dayP.substring(0, 2)))){
                    return round;
                }
                else if((word == "demain")
                    &&(timer.getDayInMonth()+1==parseInt(round.tabH.dayP.substring(0, 2)))){
                    return round;
                }
                return null;
            };
            let lookForAnHour = (word,round) => {
                if(word[word.length-1]=="h"){
                    if(word== round.tabH.hourDL+"h") {
                        return round;
                    }
                }
                return null;
            };
            let doesMessageContainSelectRoundKeyWords = () => {
                return spMessage.includes("choisis") ||
                    spMessage.includes("créneau") ||
                    spMessage.includes("veux") ||
                    spMessage.includes("livrer");
            };
            let selectRoundUsingVocalMessage = () => {
                let possibleRounds = [];
                let roundFound = null;
                for(let word=0; word < spMessage.length; word ++) {
                    for(let k = 0; k < market.calendar.rounds.length; k++) {
                        let currentRound = null;
                        if(currentRound = lookForADate(spMessage[word],market.calendar.rounds[k])){
                            possibleRounds.push(currentRound);
                        }
                        if(currentRound = lookForAnHour(spMessage[word],market.calendar.rounds[k])){
                            if(possibleRounds.indexOf(currentRound)!= -1){
                                roundFound = currentRound;
                                market.calendar.checkPlace(roundFound);
                                return true;
                            }
                        }
                    }
                }
                if(!roundFound && possibleRounds.length > 0){
                    market.calendar.checkPlace(possibleRounds[0]);
                    return true;
                }
                return false;
            };
            let validateRoundUsingVocalMessage = () => {
                let answer = message.toLowerCase();
                if (answer.includes("oui") && market.calendar.selectedHourday) {
                    market.textToSpeech("Ok vous serez livrés aux horaires choisis. Vous allez etre redirigé sur la page d'accueil.", "fr");
                    setTimeout(()=>{
                        resetMarket();
                    },3000);
                    return true;
                }
                else if (answer.includes("non") && market.calendar.selectedHourday) {
                    market.textToSpeech("Nous annulons votre livraison","fr");
                    market.calendar.header.add(market.calendar.picto);
                    market.calendar.picto.position(market.calendar.pictoPosX, market.calendar.pictoPosY);
                    this.selectedHourday = false;
                    return true;
                }
                return false;
            };

            let messageProcessed = false;
            let spMessage = message.split(" ");
            if(doesMessageContainSelectRoundKeyWords()){
                messageProcessed |= selectRoundUsingVocalMessage();
            } else {
                messageProcessed |= validateRoundUsingVocalMessage();
            }
            return messageProcessed;
        };
        let shopUsingVocalMessage = () =>{
            let messageProcessed = false;
            let tabMessage = message.split(" ");
            let splitMessage = [];
            for (var i = tabMessage.length - 1; i > 0; i--) {
                if (tabMessage[i].includes("ajoute") || tabMessage[i].includes("supprime") || tabMessage[i].includes("vide")
                    || tabMessage[i].includes("paiement") || tabMessage[i].includes("paye")) {
                    splitMessage.push(message.substring(message.lastIndexOf(tabMessage[i]), message.length));
                    message = message.substring(0, message.lastIndexOf(tabMessage[i]));
                }
            }
            splitMessage.push(message);


            for (var j = splitMessage.length - 1; j >= 0; j--) {
                let order = splitMessage[j];
                let tab = search(order, "all");
                let det = ["un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix"];
                if (tab[0]) {
                    tab = search(order, "prod");
                    if (order.includes("ajoute")) {
                        for (var i = 0; i < tab.length; i++) {
                            let quantity = order[order.indexOf(tab[i].name.toLowerCase()) - 2];
                            var determining = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 4,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            var determining2 = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 6,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            var determiningFour = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 7,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            if (quantity >= "0" && quantity <= "9") {
                                let bef = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 3]);
                                if (isNaN(bef)) {
                                    bef = "";
                                }
                                let bef2 = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 4]);
                                if (isNaN(bef2)) {
                                    bef2 = "";
                                }
                                market.textToSpeech("Ok, j'ajoute "+ quantity + " "+ tab[i].name+" au panier");
                                market.basket.addProducts(tab[i], parseInt("" + bef2 + bef + quantity));
                            } else if (determining.trim() == "de") {
                                market.basket.addProducts(tab[i], 2);
                                market.textToSpeech("Ok, j'ajoute deux "+ tab[i].name+" au panier");
                            } else if (determining2.trim() == "cette" || determining.trim() == "cet") {
                                market.textToSpeech("Ok, j'ajoute sept "+ tab[i].name+" au panier");
                                market.basket.addProducts(tab[i], 7);
                            } else if(determining.trim() == "un" || determining.trim() == "une") {
                                market.textToSpeech("Ok, j'ajoute 1 "+ tab[i].name+" au panier");
                                market.basket.addProducts(tab[i], 1);
                            } else {
                                let tor=false;
                                for(let k = 0; k< det.length;k++){
                                    if(determining.trim() == det[k] || determining2.trim() == det[k] || determiningFour.trim() == det[k]){
                                        tor=true;
                                        market.basket.addProducts(tab[i],k+1);
                                        market.textToSpeech("Ok, j'ajoute "+( k+1 )+" "+ tab[i].name+" au panier");
                                    }
                                }
                                if(tor==false){
                                    market.basket.addProducts(tab[i],1);
                                    market.textToSpeech("Ok, j'ajoute un "+ tab[i].name+" au panier");
                                }
                            }
                        }
                    }
                    else if (order.includes("supprime")) {
                        for (var i = 0; i < tab.length; i++) {
                            var number = order[order.indexOf(tab[i].name.toLowerCase()) - 2];
                            var determining = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 4,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            var determining2 = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 6,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            var determiningFour = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 7,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            if (number >= "0" && number <= "9") {
                                let bef = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 3]);
                                if (isNaN(bef)) {
                                    bef = "";
                                }
                                let bef2 = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 4]);
                                if (isNaN(bef2)) {
                                    bef2 = "";
                                }
                                market.textToSpeech("Ok, je retire "+ number +" "+ tab[i].name +" du panier");
                                market.basket.deleteFromName(tab[i].name, parseInt("" + bef2 + bef + number));
                            }
                            else if (determining == " un" || determining == "une"){
                                market.textToSpeech("Ok, je retire 1 "+ tab[i].name+" du panier");
                                market.basket.deleteFromName(tab[i].name, 1);
                            } else if (determining.trim() == "de"){
                                market.textToSpeech("Ok, je retire 2 "+ tab[i].name+" du panier");
                                market.basket.deleteFromName(tab[i].name, 2);
                            } else if (determining2.trim() == "cette" || determining.trim() == "cet"){
                                market.textToSpeech("Ok, je retire 7 "+ tab[i].name +" du panier");
                                market.basket.deleteFromName(tab[i].name, 7);
                            }else {
                                let tor = false;
                                for(let k = 0; k< det.length;k++){
                                    if(determining.trim() == det[k] || determining2.trim() == det[k] || determiningFour.trim() == det[k]){
                                        tor = true;
                                        market.basket.deleteFromName(tab[i].name,k+1);
                                        market.textToSpeech("Ok, je retire "+( k+1 )+" "+ tab[i].name+" du panier");
                                    }
                                }
                                if(tor == false){
                                    market.textToSpeech("Ok, je retire les "+ tab[i].name+" du panier");
                                    market.basket.deleteFromName(tab[i].name, null);
                                }
                            }
                        }
                    }
                    else {
                        tab = search(order, "all");
                        market.textToSpeech("Ok, je cherche.");
                        doSearch(tab);
                    }
                    messageProcessed = true;
                }
                else {
                    if (order.includes("vide") && order.includes("panier")) {
                        market.textToSpeech("Ok, Je vide le panier");
                        market.basket.emptyBasket();
                        messageProcessed = true;
                    }
                    else if (order.includes("paye") || order.includes("paie")) {
                        if(market.basket.thumbnailsProducts.length > 0) {
                            market.textToSpeech("Ok, passons au payement")
                            market.payment.card.position(market.payment.width * 0.6, market.payment.height / 2);
                            market.payment.cardIn = true;
                            market.payment.showCode();
                            messageProcessed = true;
                        } else {
                            market.textToSpeech("Veuillez mettre un article dans le panier");
                        }

                    }
                }
            }
            return messageProcessed;
        };
        let isMapDisplayed = () => {
            return market.map;
        };
        let isCalendarDisplayed = () => {
            return market.calendar.calendarOn;
        };
        let isVocalMessageEmpty = () => {
            return message === "";
        };
        let processEmptyVocalMessage = () => {
            market.textToSpeech("Je n'ai pas entendu");
            return true;
        };
        let processMeaninglessVocalMessage = () => {
            message += ", " + Date();
            listener.writeLog(message);
            console.log("No Correct Order Given");
            market.textToSpeech("Je n'ai pas bien compris votre demande", "fr");
        };

        message = prepareVocalMessage(message);
        let messageProcessed = false;
        if (!isVocalMessageEmpty()) {
            if (isMapDisplayed()) {
                messageProcessed |= chooseAddressUsingVocalMessage();
            }
            else if (isCalendarDisplayed()) {
                messageProcessed |= chooseRoundUsingVocalMessage();
            }
            else {
                messageProcessed |= shopUsingVocalMessage();
            }
        }
        else {
            messageProcessed |= processEmptyVocalMessage();
        }
        if (!messageProcessed){
            processMeaninglessVocalMessage();
        }
    };

    market.textToSpeech=function(msg){
        speech.talk(msg);
    };

    function prepareVocalMessage(msg){
        return msg.replace(/é/g, "e").replace(/à/g,"a").replace(/è/,"e").replace(/ê/g, "e").replace(/ù/g, "u").replace(/-/g, " ").toLowerCase();
    }

    function placePerDay(dayGiven,dayToDraw){
        var rp = "";
        if(market.calendar.address!==''){
            rp= getDelivery(market.calendar.address);
        } else{
            market.calendar.address=param.data.getMarker()[1].address;
            rp= getDelivery(param.data.getMarker()[1].address);
        }
        for (let jour in rp){
            if (rp[jour].dayL[0] === dayGiven) {
                dayToDraw.push({dayP: rp[jour].dayL[0], hourDL: rp[jour].hourDL,hourAL: rp[jour].hourAL, nbT: rp[jour].nbT,
                    left : rp[jour].left, TPH : rp[jour].TPH, address : param.data.getMarker()[1].address });
            }
        }
        return dayToDraw;
    }

    function getDelivery(address){
        let relay = param.data.getMarker();
        let obj = [];
        for(let point in relay){
            if(relay[point].address == address){
                let del = relay[point].livraison;
                for(let day in del) {
                    obj.push({
                        dayL: Object.keys(del[day]),
                        nbT:del[day][Object.keys(del[day])].place,
                        left:del[day][Object.keys(del[day])].left,
                        hourDL: del[day][Object.keys(del[day])].debut,
                        hourAL: del[day][Object.keys(del[day])].fin,
                        TPH: del[day][Object.keys(del[day])].TPH
                    });
                }
            }
        }
        return obj;
    }

    function resetMarket(){
        cookie.deleteCookie("ray");
        cookie.deleteCookie("basket");
        cookie.deleteCookie("payment");
        cookie.deleteCookie("page");
        windowFunc.reload();
    }

    windowFunc.setResize();

    /////Déclaration Interface////
    let mainPage=new svg.Translation().mark("mainPage");
    let pageWidth=market.width*0.96;
    let mainPageWidth=market.width*0.98;

    let glassTimer = new svg.Translation();
    let header = new Header(market.width,market.height*0.04);
    let zoneHeader = new svg.Translation().add(header.component).mark("header");
    let tabDefaultCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);

    let categories = new ListCategorie(market.width*0.76,market.height*0.22,0,market.height*0.04,tabDefaultCategories);
    let zoneCategories = new svg.Translation().add(categories.component).mark("categories");
    market.basket = new Basket(market.width*0.221,market.height*0.75,market.width*0.76,header.height);
    let zoneBasket = new svg.Translation().add(market.basket.component);
    market.payment = new Payment(market.width*0.221,market.height*0.21,market.width*0.76,market.height*0.75+header.height);
    let zonePayment = new svg.Translation().add(market.payment.component).mark("payment");
    let glassCanvas= new svg.Translation().mark("glassCanvas");
    let glassDnD = new svg.Translation().mark("Glass");

    //Gestion des pages
    market.calendar = new Calendar(pageWidth,market.height,0,0);
    market.calendar.placeElements();
    market.calendar.component.move(market.width*0.06,0);
    //Tab:
    let tabX = market.width*0.98;
    //CALENDAR
    let calendarOnglY = (market.height*0.57);
    let linePathCalendar=new svg.Path(tabX,calendarOnglY);
    linePathCalendar.line(tabX+market.width*0.02,calendarOnglY+market.height*0.02).color(svg.LIGHT_BLUE,4,svg.LIGHT_BLUE);
    linePathCalendar.line(tabX+market.width*0.02,calendarOnglY+market.height*0.25).color(svg.LIGHT_BLUE,4,svg.LIGHT_BLUE);
    linePathCalendar.line(tabX,calendarOnglY+market.height*0.27).color(svg.LIGHT_BLUE,4,svg.LIGHT_BLUE);
    let calendarIcon = new svg.Image("img/calendarIcon.png").dimension(market.width*0.018,market.width*0.018)
        .position(tabX+market.width*0.0105,calendarOnglY+market.height*0.1);
    let calendarPage = new svg.Translation()
        .add(new svg.Rect(market.width,market.height).position(market.width/2,market.height/2).color([230,230,230]))
        .add(linePathCalendar).add(market.calendar.component).add(calendarIcon);

    //MAP
    let mapOnglY = Math.round(market.height*0.31);
    let linePathMap=new svg.Path(tabX,mapOnglY);
    linePathMap.line(tabX+market.width*0.02,mapOnglY+market.height*0.02).color(svg.LIGHT_RED,4,svg.LIGHT_RED);
    linePathMap.line(tabX+market.width*0.02,mapOnglY+market.height*0.25).color(svg.LIGHT_RED,4,svg.LIGHT_RED);
    linePathMap.line(tabX,mapOnglY+market.height*0.27).color(svg.LIGHT_RED,4,svg.LIGHT_RED);
    let mapIcon = new svg.Image("img/mapIcon.png").dimension(market.width*0.018,market.width*0.018)
        .position(tabX+market.width*0.0105,mapOnglY+market.height*0.1);

    //MAINPAGE
    let mainOnglY = Math.round(market.height*0.05);
    let linePathMain=new svg.Path(tabX,mainOnglY);
    linePathMain.line(tabX+market.width*0.02,mainOnglY+market.height*0.02).color(svg.LIGHT_GREEN,4,svg.LIGHT_GREEN);
    linePathMain.line(tabX+market.width*0.02,mainOnglY+market.height*0.25).color(svg.LIGHT_GREEN,4,svg.LIGHT_GREEN);
    linePathMain.line(tabX,mainOnglY+market.height*0.27).color(svg.LIGHT_GREEN,4,svg.LIGHT_GREEN);
    let mainIcon = new svg.Image("img/panier.png").dimension(market.width*0.018,market.width*0.018)
        .position(tabX+market.width*0.0105,mainOnglY+market.height*0.1);
    mainPage.add(linePathMain).add(mainIcon);

    let mapPage = new svg.Translation().mark("map");
    let background = new svg.Rect(pageWidth,market.height-header.height).corners(10,10)
        .position(market.width/2,market.height/2+header.height/2).color(svg.WHITE,1,svg.BLACK);
    mapPage.add(linePathMap).add(background).add(mapIcon);
    market.map = null;

    function loadMap(){
        market.map = new Map(pageWidth,market.height-header.height*1.5,market.width*0.04,header.height*2);
        market.map.mapOn=true;
        mapPage.add(market.map.component);
        setTimeout(function(){
            market.mapsfunction = Maps.initMap(param.data.getMarker(), market.toCalendar,targetMap,market.map.updateMarkersSide);
            if (currentMapSearch != ""){
                market.mapsfunction.research(currentMapSearch);
            }
            setTimeout(function(){
                if(market.map!=null) {
                    market.map.updateMarkersSide();
                }
            },500);
        },500);
    }

    market.toCalendar= (message)=>{
        currentMapSearch= market.map.input.value;
        mapPage.remove(market.map.component);
        market.map=null;
        market.pages[1].obj.smoothy(10, 40).onChannel(1).moveTo(Math.round(-pageWidth - market.width * 0.02), 0);
        market.calendar.address=message;
        market.calendar.calendarOn=true;
        setTimeout(()=>{
            currentPage = market.pages[0].obj;
            currentIndex = 0;
        },200);

        cookie.createCookie("page",0,1);
        market.calendar.printCurrentMonthContent();
        market.calendar.picto.position(market.calendar.width * 0.15, market.calendar.height * 0.09);
    };

    let currentMapSearch = "";
    let currentPage=mainPage;
    let currentIndex=2;
    market.pages=[];
    market.pages.push({obj:calendarPage,active:false},{obj:mapPage,active:false},{obj:mainPage,active:true});

    for(var i =0;i<market.pages.length;i++){
        let index = i;
        market.pages[i].obj.onClick(()=>{
            if(market.pages[index].active) {
                if (index != currentIndex) {
                    if (index != 1) {
                        if(market.map!=null){
                            currentMapSearch= market.map.input.value;
                            mapPage.remove(market.map.component);
                            market.map=null;
                        }
                    }
                    else{
                        loadMap();
                        setTimeout(()=>{
                            market.map.updateMarkersSide();
                        },3500);
                    }
                    if (currentIndex > index) {
                        for (let j = currentIndex; j > index; j--) {
                            market.pages[j].obj.smoothy(10, 40).onChannel(j).moveTo(Math.round(-pageWidth)-market.width*0.0215, 0);
                        }
                    }
                    else {
                        for (let j = currentIndex; j <= index; j++) {
                            market.pages[j].obj.smoothy(10, 40).onChannel(j).moveTo(0, 0);
                        }
                    }
                    currentPage = market.pages[index].obj;
                    currentIndex = index;

                    if (currentIndex == 0) {
                        market.calendar.calendarOn = true;
                    }
                    else if (currentIndex==1){
                        market.calendar.calendarOn = false;
                    }

                    cookie.createCookie("page",index,1);
                }
            }
        });
        market.add(market.pages[i].obj);
    }

    market.add(mainPage);
    mainPage.add(zoneCategories).add(zoneBasket).add(zonePayment);
    market.add(glassDnD);
    mainPage.add(glassCanvas);
    market.add(zoneHeader);

    let cookiePayment = cookie.getCookie("payment");
    let cookieRay=cookie.getCookie("ray");
    let cookieBasket=cookie.getCookie("basket");
    if((cookieRay!="Recherche")&&(cookieRay)){
        market.changeRay(cookieRay);
    }
    else {
        market.changeRay("HighTech");
    }

    if(cookieBasket) {
        let stringBasket = cookieBasket.split(",");
        for (let i in stringBasket) {
            let tabProd = stringBasket[i].split(":");
            let prod = search(tabProd[0]);
            market.basket.addProducts(prod[0], tabProd[1]);
        }
    }
    if(cookiePayment=="done"){
        market.pages[1].active = true;
        market.pages[0].active = true;

        let index=cookie.getCookie("page");
        if(index==1){
            loadMap();
            setTimeout(()=>{
                market.map.updateMarkersSide();
            },3500);
        }
        if (2 > index) {
            for (let j = 2; j > index; j--) {
                market.pages[j].obj.move(Math.round(-pageWidth)-market.width*0.0215, 0);
            }
        }
        currentPage = market.pages[index].obj;
        currentIndex = index;

        if (currentIndex == 0) {
            market.calendar.calendarOn = true;
        }
        else if (currentIndex==1){
            market.calendar.calendarOn = false;
        }
    }
    else{
        cookie.createCookie("page",2,1);
    }

    if(currentIndex==2){
        market.textToSpeech("Bonjour, bienvenue dans votre supermarché!","fr");
    }
    else if(currentIndex==1){
        market.textToSpeech("La dernière fois, vous etiez en train d'indiquer votre adresse!","fr");
    }
    else{
        market.textToSpeech("La dernière fois, vous etiez en train de choisir un horaire de livraison!","fr");
    }


    return market;
    //////////////////////////////
};