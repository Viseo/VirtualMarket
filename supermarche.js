exports.main = function(svg,gui,param,neural,targetruntime,Maps,timer,targetMap,cookie,speech,listener,windowFunc){

    let screenSize = svg.runtime.screenSize();
    let market = new svg.Drawing(screenSize.width,screenSize.height).show('content');
    let runtime=targetruntime;
    ///////////////BANDEAUX/////////////////
    class DrawingZone {
        constructor(width,height,x,y)
        {
            this.component = new svg.Drawing(width,height).position(x,y);
        }
    }

    class ListCategorie extends DrawingZone {
        constructor(width, height, x, y, tabCat) {
            super(width, height, x, y);

            //Rebords
            let rectangleBackground = new svg.Rect(width, height).position(width / 2, height / 2).color([230,230,230]);
            this.component.add(rectangleBackground);

            //Rayon Actuellement Selectionné
            this.ray = null;
            this.rayTranslation = null;
            var self = this;
            this.currentSearch = [];

            this.tabCategories = tabCat;
            let listThumbnail = new svg.Translation().mark("listeCategories");
            for (let i = 0; i < this.tabCategories.length; i++) {
                let current = this.tabCategories[i];
                current.placeElements();
                current.move(width*0.01+width*0.108 * i, height*0.05);
                listThumbnail.add(current.component);
            }
            this.component.add(listThumbnail);
            this.transRect=new svg.Translation().shadow('catrect',-5,0,5).add(new svg.Circle(1).opacity(0).position(width*0.95,market.height+header.height));
            this.transRect.add(new svg.Rect(width*0.01,market.height-header.height).position(width*(1.005),(market.height+header.height)/2).color([230,230,230]));
            this.component.add(this.transRect);
            this.previousMouseX=0;
            this.navigation=false;
            let mouvement = false;
            // naviguer dans les catégories avec la souris
            svg.addEvent(this.component, "mousedown", function (e) {
                mouvement = true;
                self.previousMouseX = e.pageX;
                svg.addEvent(self.component, "mousemove", function (e) {
                    if (mouvement) {
                        if(self.previousMouseX!=e.pageX) self.navigation=true;
                        listThumbnail.steppy(1, 1).moveTo(listThumbnail.x + (e.pageX - self.previousMouseX), listThumbnail.y);
                        self.previousMouseX = e.pageX;
                    }
                });

                svg.addEvent(self.component, "mouseup", function () {
                    let widthTotal = self.tabCategories[0].width*1.04 * self.tabCategories.length;
                    let widthView = width;
                    let positionRight = listThumbnail.x + widthTotal;
                    if (listThumbnail.x > 0) {
                        listThumbnail.smoothy(10, 10).moveTo(0, 0);
                    }
                    else if (positionRight <= widthView) {
                        listThumbnail.smoothy(10,10).moveTo(widthView - widthTotal, listThumbnail.y);
                    }
                    else{}
                    mouvement = false;
                });

                svg.addEvent(self.component, "mouseout", function () {
                    if(mouvement) {
                        let widthTotal = self.tabCategories[0].width*1.04* self.tabCategories.length;
                        let widthView = width;
                        let positionRight = listThumbnail.x + widthTotal;
                        if (listThumbnail.x > 0) {
                            listThumbnail.smoothy(10, 10).moveTo(0, 0);
                        }
                        else if (positionRight <= widthView) {
                            listThumbnail.smoothy(10, 10).moveTo(widthView - widthTotal, listThumbnail.y);
                        }
                        mouvement = false;
                    }
                });
            });

            // Gestion tactile pour les catégories:
            svg.addEvent(this.component, "touchstart", function (e) {
                mouvement = true;
                self.previousMouseX = e.touches[0].clientX;

                svg.addEvent(self.component, "touchmove", function (e) {
                    if (mouvement) {
                        listThumbnail.steppy(1, 1).moveTo(listThumbnail.x + (e.touches[0].clientX - self.previousMouseX), listThumbnail.y);
                        self.previousMouseX = e.touches[0].clientX;
                    }
                });

                svg.addEvent(self.component, "touchend", function () {
                    let widthTotal = self.tabCategories[0].width*1.04* self.tabCategories.length;
                    let widthView = width;
                    let positionRight = listThumbnail.x + widthTotal;
                    mouvement = false;
                    if (listThumbnail.x > 0) {
                        listThumbnail.smoothy(10, 10).moveTo(0,0);
                    }
                    else if (positionRight <= widthView) {
                        listThumbnail.smoothy(10,10).moveTo(widthView - widthTotal, listThumbnail.y);
                    }
                });
            });
        }
    }

    class Ray extends DrawingZone {
        constructor(width,height,x,y,tabThumbnail,cat) {
            super(width, height, x, y);

            var self = this; // Gestion Evenements
            this.width=width;
            this.name = cat;
            this.thumbWidth = (width / 4 * 0.94);
            this.listWidth = Math.ceil(tabThumbnail.length / 3) * (this.thumbWidth);
            let fond = new svg.Rect(width, height).position(width / 2, height / 2);
            fond.color([230, 230, 230]);
            this.component.add(fond);

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

            this.currentDrawn = null;
            // if (tabThumbnail.length > 12) {
            //
            //     // let chevronWest = new svg.Chevron(this.thumbWidth / 4, this.thumbWidth * 0.7, 16, "W").position(this.thumbWidth / 6, this.component.height / 2).color([0, 195, 235]);
            //     // let chevronEast = new svg.Chevron(this.thumbWidth / 4, this.thumbWidth * 0.7, 16, "E").position(width - this.thumbWidth / 6, this.component.height / 2).color([0, 195, 235]);
            //     // let ellipseChevronWest = new svg.Ellipse(50, 50).color(svg.BLACK).opacity(0)
            //     //     .position(this.thumbWidth / 4, this.component.height / 2);
            //     // let ellipseChevronEast = new svg.Ellipse(50, 50).color(svg.BLACK).opacity(0)
            //     //     .position(this.component.width - this.thumbWidth / 4, this.component.height / 2);
            //     // let zoneChevronWest = new svg.Translation().add(ellipseChevronWest).add(chevronWest).opacity(0).mark("chevronWRay").shadow('ChevronW', 7, 8, 8);
            //     // let zoneChevronEast = new svg.Translation().add(ellipseChevronEast).add(chevronEast).opacity(0.3).mark("chevronERay").shadow('ChevronE', -7, 8, 8);
            //     //
            //     // zoneChevronWest.onClick(function () {
            //     //     if (self.listWidth != 0 && self.listThumbnails.x + self.thumbWidth * 1.5 < 0) {
            //     //         self.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(self.listThumbnails.x + self.thumbWidth * 1.5, 0);
            //     //         zoneChevronEast.opacity(0.3);
            //     //     } else {
            //     //         self.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(0, 0);
            //     //         zoneChevronWest.opacity(0);
            //     //         zoneChevronEast.opacity(0.3);
            //     //     }
            //     // });
            //     //
            //     // zoneChevronEast.onClick(function () {
            //     //     if (self.listWidth != 0 && self.listThumbnails.x + self.listWidth - self.thumbWidth * 1.5 >= width) {
            //     //         self.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(self.listThumbnails.x - self.thumbWidth * 1.5, 0);
            //     //         zoneChevronWest.opacity(0.3);
            //     //     } else {
            //     //         self.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(width - self.listWidth - width * 0.01, 0);
            //     //         zoneChevronWest.opacity(0.3);
            //     //         zoneChevronEast.opacity(0);
            //     //     }
            //     // });
            //     // this.component.add(zoneChevronEast).add(zoneChevronWest);
            // }
        }

        gesture(type, dx){
            if(type=="move"){
                if(categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.steppy(1, 1).onChannel("rayon").moveTo(categories.ray.listThumbnails.x + dx, 0);
                }
            }
            else {
                if(categories.ray.listWidth != 0 && categories.ray.listThumbnails.x>0 && categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(0, 0);
                }
                else if(categories.ray.listWidth != 0 && categories.ray.listThumbnails.x+categories.ray.listWidth<categories.ray.width && categories.ray.listWidth>market.width*0.76){
                    categories.ray.listThumbnails.smoothy(10, 20).onChannel("rayon").moveTo(categories.ray.width - categories.ray.listWidth - categories.ray.width * 0.01, 0);
                }

            }
        }
    }

    class Basket extends DrawingZone {
        constructor(width, height, x, y) {
            super(width, height, x, y);
            this.component.mark("basket");

            let background = new svg.Rect(width, height).position(width / 2, height / 2);
            background.color(svg.WHITE);
            this.component.add(background);

            this.listProducts = new svg.Translation().mark("listBasket");
            this.component.add(this.listProducts);
            this.thumbnailsProducts = [];

            this.backgroundTotal= new svg.Rect(this.component.width,this.component.height*0.16)
                .position(this.component.width/2,this.component.height*0.93).color(svg.WHITE);
            this.component.add(this.backgroundTotal);
            this.stringPanier="";

            this.titleBasket = new svg.Text("PANIER").font("Calibri",this.component.height*0.05,1).color([0,195,235])
                .position(this.component.width/2,this.component.height*0.07);
            runtime.attr(this.titleBasket.component,"font-weight","bold");
            this.titleBack = new svg.Rect(this.component.width,this.component.height*0.1)
                .position(this.component.width/2,this.component.height*0.05).color(svg.WHITE);
            this.component.add(this.titleBack);
            this.component.add(this.titleBasket);


            this.originY = this.component.height*0.1;
            this.totalPrice=0;
            this.calculatePrice(0);

            this.component.add(new svg.Line(0,this.component.height*0.98,this.component.width+10,this.component.height*0.98)
                .color(svg.BLACK,5,[230,230,230]));

            this.component.add(new svg.Line(this.component.width*0.2,this.component.height*0.1,this.component.width*0.8,this.component.height*0.1)
                .color(svg.BLACK,1,[210,210,210]));

        }

        calculatePrice(price) {
            this.totalPrice+=price;
            if(this.printPrice){
                this.component.remove(this.printPrice);
                this.component.remove(this.total);
            }

            this.printPrice = new svg.Text(this.totalPrice.toFixed(2) + " €")
                .position(this.component.width*0.90, this.component.height*0.935).anchor("end")
                .font("calibri", this.component.height*0.05, 1).color([255, 110, 0]).mark("price");
            this.total = new svg.Text("TOTAL").position(this.component.width *0.1, this.component.height*0.935)
                .font("calibri", this.component.height*0.06, 1).color([255, 110, 0]).anchor("left");

            runtime.attr(this.total.component, "font-weight", "bold");
            this.component.add(this.total);
            this.component.add(this.printPrice);
        }

        addProducts(thumbnail,quantity) {
            let newProd = new ThumbnailBasket(thumbnail.image.src, thumbnail.name, thumbnail.price, thumbnail.complement, thumbnail.categorie);
            let occur=0;
            let self =this;
            for (let product of this.thumbnailsProducts) {
                if (product.name == thumbnail.name) {
                    product.addQuantity(quantity);
                    let newText=product.quantity;
                    product.changeText(newText);
                    occur=1;
                }
            }
            if (occur==0){
                newProd.addQuantity(quantity);
                this.listProducts.add(newProd.component);
                this.thumbnailsProducts.push(newProd);
                let newText=newProd.quantity;
                newProd.changeText(newText);
            }

            newProd.component.onMouseDown(function(e){
                if(market.pages[2].obj==currentPage) self.dragBasket(newProd,e);
            });

            svg.addEvent(newProd.component, "touchstart", function (e) {
                self.dragBasket(newProd,e);
            });

            this.calculatePrice(newProd.price*quantity);

            if (this.thumbnailsProducts.length < 2 && occur==0) {
                newProd.placeElements();
                newProd.move(0,this.originY);

            }
            else {
                if(occur==0){
                    let ref = this.thumbnailsProducts[this.thumbnailsProducts.length-2];
                    newProd.placeElements();
                    newProd.move(0,ref.y+ref.height);
                }
            }

            this.basketCookie();
        }

        deleteProducts(vignette,numberProduct){
            vignette.minusQuantity(numberProduct);
            let newText = vignette.quantity;
            vignette.changeText(newText);

            if(vignette.quantity ==0){
                this.listProducts.remove(vignette.component);
                this.thumbnailsProducts.splice(this.thumbnailsProducts.indexOf(vignette), 1);
                this.calculatePrice(-((vignette.price)*numberProduct));
                for (let product of this.thumbnailsProducts) {
                    product.placeElements();
                    product.move(0,this.thumbnailsProducts.indexOf(product)*(product.height)+this.component.height*0.1);
                }
                if(this.thumbnailsProducts.length<=7) this.listProducts.smoothy(10,10).moveTo(0,0);
            }else {
                this.calculatePrice(-((vignette.price)*numberProduct));
            }
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
            var self =this;
            if(e.type=="mousedown"){
                let mouseInitial = {x:e.pageX,y:e.pageY};
                let lookingForDir=true;
                current.component.onMouseMove(function(e){
                    if((!self.direction)&&lookingForDir){
                        if(Math.abs(e.pageX-mouseInitial.x)*40>Math.abs(e.pageY-mouseInitial.y)){
                            if(e.pageX<mouseInitial.x){
                                self.dragged = new Thumbnail(current.image.src, current.name);
                                self.dragged.placeElementsDnD(current);
                                self.dragged.move(current.x + pageWidth * 0.85, current.y + self.listProducts.y + header.height);
                                self.dragged.component.opacity(0.9).mark("dragged");
                                glassDnD.add(self.dragged.component);
                                market.add(glassDnD);

                                let anchorPoint = {x:e.pageX-self.dragged.x,y:e.pageY-self.dragged.y};
                                self.dragged.component.onMouseMove(function(e){
                                    self.dragged.move(e.pageX - anchorPoint.x, e.pageY - anchorPoint.y);
                                });

                                self.dragged.component.onMouseUp(function () {
                                    if ((self.dragged.x + self.dragged.width / 2 < pageWidth * 0.85)
                                        && (self.dragged.y + self.dragged.height / 2 > market.height * 0.20)) {
                                        market.basket.deleteProducts(current, 1);
                                        market.changeRay(current.categorie);
                                    }
                                    glassDnD.remove(self.dragged.component);
                                    self.direction=null;
                                });
                                self.direction = "LEFT";
                            }
                            else{
                                self.direction = "RIGHT";
                                self.previousMouseX = e.pageX;
                                svg.addEvent(current.component, "mousemove", function (e) {
                                    if(self.direction=="RIGHT") {
                                        current.component.steppy(1, 1).moveTo(current.x + (e.pageX - self.previousMouseX),
                                            current.y);
                                    }else{}
                                });

                                svg.addEvent(current.component, "mouseup", function () {
                                    if (current.component.x + current.width / 2 > self.component.width) {
                                        market.basket.deleteProducts(current, current.quantity);
                                    }
                                    else {
                                        current.component.smoothy(5, 5).moveTo(0, current.y);
                                    }
                                    self.direction=null;
                                });

                                svg.addEvent(current.component, "mouseout", function () {
                                    if (current.component.x + current.width / 2 >= self.component.width) {
                                        market.basket.deleteProducts(current, current.quantity);
                                    }
                                    else {
                                        current.component.smoothy(5, 5).moveTo(0, current.y);
                                    }
                                    self.direction=null;
                                });
                            }
                        }
                        else{
                            self.direction = "VERTICAL";
                            // naviguer dans le panier avec la souris
                            self.previousMouseY = e.pageY;
                            svg.addEvent(self.component, "mousemove", function (e) {
                                if(self.direction=="VERTICAL") {
                                    self.listProducts.steppy(1, 1).moveTo(self.listProducts.x,
                                        self.listProducts.y+(e.pageY - self.previousMouseY));
                                    self.previousMouseY = e.pageY;
                                }else{}
                            });

                            svg.addEvent(self.component, "mouseup", function () {
                                let heightTotal = self.thumbnailsProducts.length * self.thumbnailsProducts[0].height;
                                let heightView = self.component.height*0.77;
                                let positionDown = self.listProducts.y + heightTotal;
                                if ((self.listProducts.y > 0)||(self.thumbnailsProducts.length<=7)) {
                                    self.listProducts.smoothy(10, 10).moveTo(0,0);
                                }
                                else if(positionDown < heightView) {
                                    self.listProducts.smoothy(10,10).moveTo(self.listProducts.x, heightView - heightTotal);
                                }
                                self.direction=null;
                            });

                            svg.addEvent(self.component, "mouseout", function () {
                                if(self.direction) {
                                    let heightTotal = self.thumbnailsProducts.length * self.thumbnailsProducts[0].height;
                                    let heightView = self.component.height*0.77;
                                    let positionDown = self.listProducts.y + heightTotal;
                                    if ((self.listProducts.y > 0)||(self.thumbnailsProducts.length<=7)) {
                                        self.listProducts.smoothy(10, 10).moveTo(0, 0);
                                    }
                                    else if(positionDown < heightView) {
                                        self.listProducts.smoothy(10,10).moveTo(self.listProducts.x, heightView - heightTotal);
                                    }
                                    self.direction = null;
                                }else{}
                            });
                        }
                    }
                    lookingForDir=false;
                });
            }
            else {
                let touchInitial = {x:e.touches[0].clientX,y:e.touches[0].clientY};
                //// gestion tactile du panier vers le rayon:
                self.previousTouchY = e.touches[0].clientY;
                self.previousTouchX = e.touches[0].clientX;
                svg.addEvent(current.component, "touchmove", function (e) {
                    if(!self.direction){
                        if(Math.abs(e.touches[0].clientX-touchInitial.x)>Math.abs(e.touches[0].clientY-touchInitial.y)){
                            if(e.touches[0].clientX<touchInitial.x) {
                                self.dragged = new Thumbnail(current.image.src, current.name);
                                self.dragged.placeElementsDnD(current);
                                self.dragged.move(current.x + pageWidth * 0.85, current.y + self.listProducts.y + header.height);
                                self.dragged.component.opacity(0.9).mark("dragged");
                                glassDnD.add(self.dragged.component);
                                self.direction="LEFT";
                            }
                            else{
                                self.direction = "RIGHT";
                            }
                        }
                        else{
                            self.direction = "VERTICAL";
                        }
                    }

                    switch(self.direction){
                        case "LEFT":
                            self.dragged.move(e.touches[0].clientX - current.width / 2, e.touches[0].clientY - current.height / 2);
                            break;
                        case "VERTICAL":
                            self.listProducts.steppy(1, 1).moveTo(self.listProducts.x,
                                self.listProducts.y+(e.touches[0].clientY - self.previousTouchY));
                            self.previousTouchY = e.touches[0].clientY;
                            break;
                        case "RIGHT":
                            current.component.steppy(1, 1).moveTo(current.x+(e.touches[0].clientX - self.previousTouchX),
                                current.y);
                            break;
                    }
                });

                svg.addEvent(current.component, "touchend", function () {
                    if(self.direction=="LEFT") {
                        if ((self.dragged.x + self.dragged.width / 2 < pageWidth * 0.85) &&
                            (self.dragged.y + self.dragged.height / 2 > market.height * 0.20)) {
                            market.basket.deleteProducts(current, 1);
                            market.changeRay(current.categorie);
                        }
                        glassDnD.remove(self.dragged.component);

                    }
                    else if(self.direction=="VERTICAL"){
                        let heightTotal = self.thumbnailsProducts.length * self.thumbnailsProducts[0].height;
                        let heightView = self.component.height*0.77;
                        let positionDown = self.listProducts.y + heightTotal;
                        if ((self.listProducts.y > 0)||(self.thumbnailsProducts.length<=7)) {
                            self.listProducts.smoothy(10, 10).moveTo(0, 0);
                        }
                        else if(positionDown < heightView) {
                            self.listProducts.smoothy(10,10).moveTo(self.listProducts.x, heightView - heightTotal);
                        }
                    }
                    else{
                        if(current.component.x+current.width/2>self.component.width){
                            market.basket.deleteProducts(current, current.quantity);
                        }
                        else{
                            current.component.smoothy(5, 5).moveTo(0, current.y);
                        }
                    }

                    self.direction=null;
                });
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
            let micro=this.micro;


            this.logoComp.onClick(function(){
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

            listener.listen(micro,market);

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

            let self = this;
            svg.addEvent(this.card,"touchstart",function(){
                svg.addEvent(self.card,"touchmove",function(e){
                    if(self.card.x+self.card.width/2<self.component.width*0.90)
                        self.card.position(e.touches[0].pageX-self.component.x,self.card.y);
                    else if(self.cardIn==false){
                        self.showCode();
                        self.card.position(self.width*0.65,self.card.y);
                        self.cardIn=true;
                        svg.event(self.card,"touchend",{});
                    }
                });
            });

            svg.addEvent(this.card,"mousedown",function(){
                let draw = true;
                svg.addEvent(self.card,"mousemove",function(e){
                    if(draw)self.card.position(e.pageX-self.component.x,self.card.y);
                });

                svg.addEvent(self.card,"mouseup",function(){
                    if(draw) {
                        if (self.card.x + self.card.width / 2 < self.component.width * 0.80)
                            self.card.position(width * 0.1, self.card.y);
                        else{
                            self.showCode();
                            self.card.position(self.width * 0.65, self.card.y);
                            self.cardIn=true;
                        }
                        draw = false;
                    }
                });

                svg.addEvent(self.card,"mouseout",function(){
                    if(draw) {
                        if (self.card.x + self.card.width / 2 < self.component.width * 0.6)
                            self.card.position(width * 0.1, self.card.y);
                        else if (self.cardIn == false) {
                            self.showCode();
                            self.card.position(self.width * 0.65, self.card.y);
                            self.cardIn=true;
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

            this.color = svg.BLACK;
            // Dessiner les boutons
            this.component = new svg.Circle(this.ray).position(this.gapX ,this.gapY).color(svg.BLACK).opacity(1).mark("button"+value);

            let self = this;
            this.component.onMouseOut(function(){
                if ((market.payment.zoneCode.onDrawing)&& (market.payment.zoneCode.code.indexOf(""+self.value)== -1))
                {
                    market.payment.zoneCode.code+= self.value;
                }
            });

            this.component.onMouseEnter(function(){
                if (market.payment.zoneCode.onDrawing)
                {
                    if(market.payment.zoneCode.code.length>0){
                        let buttonBefore = market.payment.zoneCode.tabButtons[parseInt(market.payment.zoneCode.code.charAt(market.payment.zoneCode.code.length-1))-1];
                        market.payment.zoneCode.lines.push(new svg.Line(buttonBefore.gapX,buttonBefore.gapY,self.gapX,self.gapY)
                            .color(svg.BLACK,5,svg.BLACK));
                        market.payment.zoneCode.buttons.add(market.payment.zoneCode.lines[market.payment.zoneCode.lines.length-1]);
                    }
                    if (self.value != market.payment.zoneCode.code.slice(-1)){
                        market.payment.zoneCode.code+= self.value;
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

            this.cross.onClick(function(){
                market.remove(market.payment.zoneCode.component);
                market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
                market.payment.cardIn=false;
            });

            let self = this;
            this.component.onMouseUp(function(){
                if (self.onDrawing){
                    self.onDrawing = false;
                    let check=self.checkPassword(self.code);
                    if(check===false){
                        if(self.code.length>1){
                            market.payment.iteration++;
                            market.textToSpeech("Code erroné.");
                            if (market.payment.iteration >3) {
                                market.textToSpeech("Veuillez patienter"+10+"secondes");
                                self.launchTimer(10, false);
                            }
                        }
                    }else{
                        currentIndex=1;
                        currentPage=market.map;
                        self.moveMainpage();
                        self.paymentCookie();
                    }
                    for(let i=0;i<self.lines.length;i++) self.buttons.remove(self.lines[i]);
                    self.lines = [];
                    self.buttons.remove(self.currentLine);
                    self.currentLine=new svg.Line();
                    self.buttons.add(self.currentLine);
                }
            });

            svg.addEvent(this.component,"touchend",function(){
                if (self.onDrawing){
                    self.onDrawing = false;
                    let check=self.checkPassword(self.code);
                    if(check===false){
                        if(self.code.length>1){
                            market.payment.iteration++;
                            if (market.payment.iteration >3) {
                                self.launchTimer(10, false);
                            }
                        }
                    }
                    else{
                        self.moveMainpage();
                        currentIndex=1;
                        currentPage=market.map;
                        self.paymentCookie();
                    }
                    for(let i=0;i<self.lines.length;i++) self.buttons.remove(self.lines[i]);
                    self.lines = [];
                    self.buttons.remove(self.currentLine);
                    self.currentLine=new svg.Line();
                    self.buttons.add(self.currentLine);
                }
            });


            this.component.onMouseDown(function(){
                self.onDrawing = true;
                self.code= "";
            });
            svg.addEvent(this.component,"touchstart",function() {
                self.onDrawing = true;
                self.code= "";
            });
            this.code = "";

            //Ligne qui suis la souris
            this.component.onMouseMove(function(e){
                if(self.onDrawing && self.code.length>0) {
                    self.buttons.remove(self.currentLine);
                    let buttonBase = self.tabButtons[parseInt(self.code.charAt(self.code.length-1))-1];
                    self.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,e.pageX,e.pageY-header.height).color(svg.BLACK,5,svg.BLACK);
                    self.buttons.add(self.currentLine);
                }
            });
            this.onButton=false;

            //Gestion Tactile
            svg.addEvent(this.component,"touchmove",function(e) {
                let button=null;
                for(let i = 0;i<self.tabButtons.length;i++) {
                    if ((e.touches[0].clientX > (self.x + self.tabButtons[i].gapX) - self.tabButtons[i].ray) &&
                        (e.touches[0].clientX < (self.x + self.tabButtons[i].gapX) + self.tabButtons[i].ray) &&
                        (e.touches[0].clientY > (self.y + self.tabButtons[i].gapY) - self.tabButtons[i].ray) &&
                        (e.touches[0].clientY < (self.y + self.tabButtons[i].gapY) + self.tabButtons[i].ray)) {
                        button=self.tabButtons[i];
                    }
                }

                //Simulate mouseEnter
                if(button!=null&&(self.onButton==false)){
                    if(self.code.length>0) {
                        let buttonBefore = self.tabButtons[parseInt(self.code.charAt(self.code.length - 1)) - 1];
                        self.lines.push(new svg.Line(buttonBefore.gapX, buttonBefore.gapY, button.gapX, button.gapY)
                            .color(svg.BLACK, 5, svg.BLACK));
                        self.buttons.add(self.lines[self.lines.length - 1]);
                    }
                    if(button.value != market.payment.zoneCode.code.slice(-1)) {
                        self.code += button.value;
                    }
                }

                //Dessin Dynamique
                if(self.onDrawing && self.code.length>0) {
                    self.buttons.remove(self.currentLine);
                    let buttonBase = self.tabButtons[parseInt(self.code.charAt(self.code.length-1))-1];
                    self.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,
                        e.touches[0].clientX,e.touches[0].clientY-header.height)
                        .color(svg.BLACK,5,svg.BLACK);
                    self.buttons.add(self.currentLine);
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
            this.arcTimer.move(this.width/2,this.height*0.79).color(svg.LIGHT_GREY,5,svg.RED).opacity(0)
                .arc(this.height/25,this.height/25,0,1,0,this.width/2,this.height*0.79);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).color(svg.GREY,1,svg.BLACK).opacity(0.8);
            this.title.position(this.width/2,this.height*0.1).font("calibri",this.height/15,1).color(svg.BLACK);
            this.circleTimer.position(this.width/2,this.height*0.79).color(svg.LIGHT_GREY,5,svg.RED).opacity(0);
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
            if(newTimer==10){this.circleTimer.opacity(1).color(svg.LIGHT_GREY,5,svg.RED);}
            else{this.circleTimer.opacity(1).color(svg.LIGHT_GREY,5,svg.LIGHT_GREY);}
            this.component.remove(this.arcTimer);
            this.component.remove(this.timer);
            this.timer = new svg.Text(newTimer);
            this.timer.position(this.width/2,this.height*0.79).font("Calibri",20,1).color(svg.BLACK);
            this.arcTimer = new svg.Path(this.width/2,this.height*0.79-this.height/25);
            this.arcTimer.arc(this.height/25,this.height/25,0,lf,0,x,y).color(svg.LIGHT_GREY,5,color);
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
                this.bar.dimension(width,width/30).color(svg.RED, 1, svg.RED);
                this.component.move(0,height/2-width/60);
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
            this.title = new svg.Rect();
            this.titleText = new svg.Text("Avril");
            this.calendarFirstRow = new svg.Translation();
            this.calendarFirstColumn = new svg.Translation().mark("column");
            this.calendarContent = new svg.Translation().mark("content");
            this.calendarPositionY = 0;
            this.calendarCases = [];
            this.monthChoice = new svg.Translation().mark("monthChoice");
            this.chevronWest = new svg.Chevron(10, height*0.05, 2, "W").color(svg.WHITE).opacity(0.5);
            this.chevronEast = new svg.Chevron(10, height*0.05, 2, "E").color(svg.WHITE);
            this.ellipseChevronWest = new svg.Ellipse(width*0.02, height*0.04).color(svg.BLACK).opacity(0.40);
            this.ellipseChevronEast = new svg.Ellipse(width*0.02, height*0.04).color(svg.BLACK).opacity(0.40);
            this.zoneChevronWest = new svg.Translation().add(this.ellipseChevronWest).add(this.chevronWest).mark("chevronWCalendar");
            this.zoneChevronEast = new svg.Translation().add(this.ellipseChevronEast).add(this.chevronEast).mark("chevronECalendar");
            this.calendarOn=false;
            this.selectedHourday=false;
            this.calendarRect = new svg.Rect();
            this.rounds=[];
            this.choice=null;
            this.address="";
            this.current=true;
            this.hideBehind = new svg.Rect(width,height*0.2).position(width/2-width/24,0).color([230,230,230]);

            this.dayCases = [];
            this.component.add(this.title);
            this.component.add(this.titleText);
            this.component.add(this.calendarRect);
            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.monthChoice);
            this.component.add(this.hideBehind);
            this.component.add(this.calendarRect);

            this.x = x;
            this.y = y;
            this.component.move(x,y);
            this.width = width;
            this.height = height;

            this.picto = new svg.Image("img/panier.png").mark("iconUser");
            this.pictoPosX = this.width*0.15;
            this.pictoPosY = this.height*0.09;
            this.onMove=false;
            this.component.add(this.picto);

            this.calendarWidth = width;
            this.calendarHeight = height*0.8;

            timer.pickDate();
            this.monthNumber = timer.getMonth();
            this.presentMonth = this.monthNumber;
            this.presentYear = timer.getYear();
            this.month = this.getMonth()[this.monthNumber];
            this.year = timer.getYear();
            this.zoneChevronEast.onClick(()=>{
                if(this.chevronEast._opacity==0.5){
                }
                else{
                    if(this.presentMonth===this.monthNumber){
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
                    }
                    if(this.choice==null) {
                        this.picto.position(this.pictoPosX,this.pictoPosY);
                    }
                    else{
                        this.component.remove(this.picto);
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
                if(this.chevronWest._opacity==0.5){}
                else {
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
                        this.component.remove(this.picto);
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

        setEventsMovement() {
            var self = this;

            this.calendarContent.onMouseDown(function (e) {
                beginMove(e.pageY, "mousemove", "mouseup");
            });

            this.calendarFirstColumn.onMouseDown(function (e) {
                beginMove(e.pageY, "mousemove", "mouseup");
            });

            svg.addEvent(this.calendarContent, "touchstart", function (e) {
                beginMove(e.touches[0].clientY, "touchmove", "touchend");
            });

            svg.addEvent(this.calendarFirstColumn, "touchstart", function (e) {
                beginMove(e.touches[0].clientY, "touchmove", "touchend");
            });

            function beginMove(y,eventTypeMove,eventTypeUp) {
                self.onMove = true;
                let prevMouse = y;

                svg.addEvent(self.calendarFirstColumn, eventTypeMove, function (e) {
                    if (self.onMove) {
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

                svg.addEvent(self.calendarFirstColumn, eventTypeUp, function () {
                    self.onMove = false;
                    toEndMove();
                });

                self.calendarContent.mark("contenu");
                svg.addEvent(self.calendarContent, eventTypeMove, function (e) {
                    if (self.onMove) {
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

                svg.addEvent(self.calendarContent, eventTypeUp, function () {
                    self.onMove = false;
                    toEndMove();
                });
            }


            function toMove(y,mouse){
                self.calendarFirstColumn.steppy(1, 1).onChannel("calendarColumn")
                    .moveTo(0, self.calendarContent.y - (mouse - y));
                self.calendarContent.steppy(1, 1).onChannel("calendarContent")
                    .moveTo(0, self.calendarContent.y - (mouse - y));
            }

            function toEndMove() {
                let nbdays = 0;
                if (self.current === true) {
                    nbdays = self.numberDaysThisMonth - timer.getDate();
                } else {
                    nbdays = self.numberDaysThisMonth;
                }
                var height = self.caseHeight * (nbdays);
                if ((self.calendarContent.y + height + self.caseHeight / 2 < market.height)&&(nbdays>10)) {
                    self.calendarContent.smoothy(10, 10).onChannel("calendarContent")
                        .moveTo(0, market.height-height-self.caseHeight/2);
                    self.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn")
                        .moveTo(0, market.height-height-self.caseHeight/2);
                }
                else if((self.calendarContent.y>header.height+self.caseHeight*2)||(nbdays<=10)){
                    self.calendarContent.smoothy(10, 10).onChannel("calendarContent")
                        .moveTo(0, header.height + self.caseHeight * 2.6);
                    self.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn")
                        .moveTo(0, header.height + self.caseHeight * 2.6);
                }
            }
        }

        placeElements(){
            this.caseWidth = this.calendarWidth/12;
            this.caseHeight = this.calendarHeight/10;
            this.picto.position(this.pictoPosX,this.pictoPosY).dimension(this.caseWidth*0.25,this.caseHeight*0.25);
            this.title.dimension(this.calendarWidth+2,this.calendarHeight*0.1).color(svg.LIGHT_BLUE,1,svg.LIGHT_GREY).opacity(1);
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.BLACK);

            this.chevronWest.position(-this.calendarWidth/2.1,0).mark("chevronWest");
            this.chevronEast.position(this.calendarWidth/2.1,0).mark("chevronEast");
            this.ellipseChevronWest.position(-this.calendarWidth/2.1,0).mark("ellipseChevronWest");
            this.ellipseChevronEast.position(this.calendarWidth/2.1,0).mark("ellipseChevronEast");
            this.monthChoice.add(this.title).add(this.titleText).add(this.zoneChevronEast).add(this.zoneChevronWest);
            this.monthChoice.move(this.width/2-this.caseWidth/2, this.height*0.05+this.title.height/2);
            this.printCurrentMonthContent();
            this.calendarRect.position(this.calendarFirstColumn.x+this.caseWidth/2+(this.calendarWidth-this.caseWidth)/2,
                this.calendarFirstRow.y+this.caseHeight/2+this.caseHeight*this.numberDaysThisMonth/2)
                .dimension(this.calendarWidth-this.caseWidth,this.numberDaysThisMonth*this.caseHeight).color(svg.WHITE,1,svg.LIGHT_GREY).opacity(1);
        }

        printCurrentMonthContent(){
            this.current=true;
            this.component.remove(this.calendarContent);
            this.component.remove(this.calendarFirstColumn);
            this.component.remove(this.calendarFirstRow);
            this.monthNumber=timer.getMonth();
            this.month=this.getMonth()[this.monthNumber];
            this.chevronWest.opacity(0.5);
            this.chevronEast.opacity(1);
            this.calendarFirstColumn = new svg.Translation();
            this.calendarContent = new svg.Translation();
            this.changeTitleText(this.month+" "+this.year);
            let tabDays = [];
            this.numberDaysThisMonth = this.daysInMonth(timer.getMonth(),timer.getYear());

            for(let j=0;j<this.numberDaysThisMonth-timer.getDayInMonth()+1;j++){
                this.dayCases[j] = new svg.Translation();
                this.dayCases[j].add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.ALMOST_WHITE,1,svg.WHITE));
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
                this.dayCases[j].add(new svg.Text(text).font("calibri", this.calendarWidth /70, 1).color(svg.BLACK));
                tabDays.push(text);
                this.calendarFirstColumn.add(this.dayCases[j]);
                this.dayCases[j].move(0,j*this.caseHeight);
                this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight;
                this.calendarFirstColumn.move(0,this.calendarPositionY);

            }

            let tabHours = [];
            for (var i=0;i<12;i++){
                let hourCase = new svg.Translation();
                hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREY,1,svg.LIGHT_GREY));
                if(i!=0) {
                    let t=new svg.Text((i + 8) + "h").font("calibri", this.width / 55, 1).color(svg.BLACK).position(-this.caseWidth/2,this.caseHeight*0.2);
                    hourCase.add(t);
                    if(i==4){
                        hourCase.add(new Switch('midday',this.caseWidth,this.caseHeight).component);
                    }

                    tabHours.push((i + 8) + "h");
                }
                else hourCase.add(new svg.Text("").font("calibri", this.width / 55, 1).color(svg.BLACK).position(-this.caseWidth/2,this.caseHeight*0.2));
                hourCase.move(i*this.caseWidth,0);
                this.calendarFirstRow.add(hourCase);
                this.calendarFirstRow.move(0,this.height*0.05+this.title.height*1.5);
            }


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
                this.calendarContent.move(0,this.calendarPositionY)
            }

            this.placeRound();

            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.hideBehind);
            this.component.add(this.monthChoice);
            this.component.add(this.picto);

            this.calendarContent.mark("content");
            this.calendarFirstColumn.mark("column");
            this.setEventsMovement();
        }

        placeRound(){
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


            let tab = [];
            for(let j = 0; j<dayMonth.length;j++){
                tab = placePerDay(dayMonth[j],tab);
            }
            this.address=market.calendar.address;

            if(timer.getDate()!=0){
                var tomorrow = timer.getDate(timer.getTime() + 24 * 60 * 60 * 1000);
                var afterTomorrow = timer.getDate(timer.getTime() + 2 * 24 * 60 * 60 * 1000);
                var dayTest = timer.getDate(1496268000000 + 24 * 60 * 60 * 1000);
                var dayTest2 = timer.getDate(1496268000000 + 2 * 24 * 60 * 60 * 1000);
                var dayTest3 = timer.getDate(1497045600000);
                var nextMonth = timer.getDate(timer.getTime() + 31 * 24 * 60 * 60 * 1000);
                var nextMonthAndOne = timer.getDate(timer.getTime() + 32 * 24 * 60 * 60 * 1000);
                let modul = "";
                let modulDay = "";
                let modulTest = "";
                let modulTest2 = "";
                let modulTest3 = "";
                if (timer.getMonth() + 1 < 10) modul = "0";
                if (timer.getDayInMonth()< 10 ) modulDay = "0";
                if (dayTest3.getDate()< 10 ) modulTest3 = "0";
                if (dayTest2.getDate()< 10 ) modulTest2 = "0";
                if (dayTest.getDate()< 10 ) modulTest = "0";
                tab.push({
                    dayP: modulDay+timer.getDayInMonth() + "/" + modul + (timer.getMonth() + 1) + "/" + timer.getYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 2, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulDay+tomorrow.getDate() + "/" + modul + (tomorrow.getMonth() + 1) + "/" + tomorrow.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 3, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulDay+afterTomorrow.getDate() + "/" + modul + (afterTomorrow.getMonth() + 1) + "/" + afterTomorrow.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 4, TPH: 2.5, address : this.address
                });
                tab.push({
                    dayP: modulTest+dayTest.getDate() + "/" + modul + (dayTest.getMonth() + 1) + "/" + dayTest.getFullYear(),
                    hourDL: "13", hourAL: "17", nbT: 4, left: 3, TPH: 1.5, address: this.address
                });
                tab.push({
                    dayP: modulTest2+dayTest2.getDate() + "/" + modul + (dayTest2.getMonth() + 1) + "/" + dayTest2.getFullYear(),
                    hourDL: "16", hourAL: "18", nbT: 2, left: 1, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modulTest3+dayTest3.getDate() + "/" + modul + (dayTest3.getMonth() + 1) + "/" + dayTest3.getFullYear(),
                    hourDL: "16", hourAL: "18", nbT: 2, left: 2, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modul+nextMonth.getDate() + "/" + modul + (nextMonth.getMonth() + 1) + "/" + nextMonth.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 4, TPH: 2, address: this.address
                });
                tab.push({
                    dayP: modul+nextMonthAndOne.getDate() + "/" + modul + (nextMonthAndOne.getMonth() + 1) + "/" + nextMonthAndOne.getFullYear(),
                    hourDL: "10", hourAL: "12", nbT: 2, left: 1, TPH: 2, address : this.address
                });
            }

            this.rounds=[];
            let self = this;
            for(let i = 0; i<dayMonth.length;i++){
                let totLeft = 0;

                for(let j = 0; j < tab.length; j++){
                    if(dayMonth[i]==tab[j].dayP){
                        totLeft += tab[j].left;
                        this.rounds[j] = new Round(0,0,tab[j].nbT*this.caseWidth,this.caseHeight/4,tab[j].nbT,tab[j].left, tab[j].TPH);
                        this.rounds[j].roundContent.mark("round "+j);
                        this.rounds[j].tabH=tab[j];
                        this.rounds[j].placeElements();
                        this.rounds[j].move((tab[j].hourDL-9)*this.caseWidth+this.rounds[j].width/2+this.caseWidth/2,i*this.caseHeight+this.caseHeight*0.1);

                        this.rounds[j].roundContent.onClick(function(e){
                            self.checkPlace(self.rounds[j]);
                        });
                        for(let k = 0; k < tab[j].nbT+1;k++){
                            this.calendarCases[(i*11+Number(tab[j].hourDL-9))+k].droppable = true;
                            this.calendarCases[(i*11+Number(tab[j].hourDL-9))+k].available = true;
                        }
                        this.calendarContent.add(this.rounds[j].component);
                        this.component.add(this.calendarContent);
                        this.rounds[j].changeColor(3);
                    }
                }

                if(totLeft == 0) {
                    this.dayCases[i].add(new Switch("unavailable",this.caseWidth,this.caseHeight).component)

                }else {
                    this.dayCases[i].add(new Switch("available",this.caseWidth,this.caseHeight).component)
                }
            }
        }

        printMonthContent(month,year){
            this.current=false;
            for(let i = 0; i<this.rounds.length;i++){
                if(this.rounds[i].component)this.calendarContent.remove(this.rounds[i].component);
            }
            this.component.remove(this.calendarContent);
            this.component.remove(this.calendarFirstColumn);
            this.component.remove(this.calendarFirstRow);

            let tabDays = [];
            this.numberDaysThisMonth=this.daysInMonth(month,year);
            this.startDay=new Date(year,month+1,0).getDate();

            for(let j=0;j<=this.numberDaysThisMonth-1;j++){
                this.dayCases[j] = new svg.Translation();
                this.dayCases[j].add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.ALMOST_WHITE,1,svg.WHITE));
                let text = this.getWeekDay()[(j+this.startDay)%7]+" "+(j+1);
                this.dayCases[j].add(new svg.Text(text).font("calibri", this.calendarWidth /70, 1).color(svg.BLACK));
                tabDays.push(text);
                this.calendarFirstColumn.add(this.dayCases[j]);
                this.dayCases[j].move(0,j*this.caseHeight);
                this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight;
                this.calendarFirstColumn.move(0,this.calendarPositionY);
            }

            let tabHours = [];
            for (var i=0;i<12;i++){
                let hourCase = new svg.Translation();
                hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREY,1,svg.LIGHT_GREY));
                if(i!=0){

                    let t=new svg.Text((i + 8) + "h").font("calibri", this.width / 55, 1).color(svg.BLACK).position(-this.caseWidth/2,this.caseHeight*0.2);
                    hourCase.add(t);
                    if(i==4){
                        hourCase.add(new Switch('midday',this.caseWidth,this.caseHeight).component);
                    }

                    tabHours.push((i + 8) + "h");
                }
                else hourCase.add(new svg.Text("").font("calibri", this.width / 55, 1).color(svg.BLACK));
                hourCase.move(i*this.caseWidth,0);
                this.calendarFirstRow.add(hourCase);
                this.calendarFirstRow.move(0,this.height*0.05+this.title.height*1.5);
            }

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
                this.calendarContent.move(0,this.calendarPositionY)
            }

            this.placeRound();
            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.hideBehind);
            this.component.add(this.monthChoice);
            this.component.add(this.picto);

            this.calendarFirstColumn.mark("column");
            this.calendarContent.mark("content");
            this.setEventsMovement();
        }

        checkPlace(round){
            if(round.left>0 && this.choice==null){
                this.choice = round;
                round.changeColor(2);
                this.component.remove(this.picto);
                this.picto.position(0,0);
                round.roundContent.add(this.picto);
                this.choiceRdv=round.tabH.dayP;
                market.textToSpeech("Souhaitez-vous confirmer votre choix le :"+this.choiceRdv.split("/").join(" ")
                    + " entre "+round.tabH.hourDL+" et "+(Number(round.tabH.hourAL))+" heure", "fr");
                this.selectedHourday=true;
            }
            else if(this.choice!=round && this.choice!=null && round.left>0) {
                for(let round in this.rounds){
                    if ((this.rounds[round].tabH.dayP==this.choice.tabH.dayP) && (this.rounds[round].tabH.hourAL == this.choice.tabH.hourAL) && (this.rounds[round].tabH.address == this.choice.tabH.address )){
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
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.BLACK);
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
            this.component.onClick(function(){
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
            let self = this;

            function printNumber(number){
                categories.ray.currentDrawn.component.remove(categories.ray.currentDrawn.waitingNumber);
                categories.ray.currentDrawn.waitingNumber = new svg.Text(number);
                categories.ray.currentDrawn.waitingNumber.position(self.width/2,self.height*0.65)
                    .font("Calibri",self.width*0.5,1).opacity(0.7);
                categories.ray.currentDrawn.component.add(categories.ray.currentDrawn.waitingNumber);
            }

            this.anim=false;
            function getNumber(number,element){
                categories.ray.currentDrawn = null;
                if(number=="click") {
                    if(!self.anim) {
                        element.addAnimation("1");
                        market.basket.addProducts(self, "1");
                        market.textToSpeech("Ok, j'ajoute 1 "+ self.name + " au panier");
                        self.anim=true;
                    }
                }
                else if(number!="?") {
                    for(var c of number.split('')){

                        if(c=="?"){
                            market.textToSpeech("Je n'ai pas compris");
                            return;
                        }
                    }
                    element.addAnimation(number);
                    market.textToSpeech("Ok, j'ajoute "+ number+" "+ element.name + " au panier");
                    market.basket.addProducts(element, parseInt(number));
                }else market.textToSpeech("Je n'ai pas compris");

            }

            let mousePos ={};
            this.drawNumber = null;
            this.component.onMouseDown(function(e){
                mousePos = {x:e.pageX,y:e.pageY};
                self.drawNumber = new svg.Drawing(0,0).mark("draw "+self.name);
                if(!categories.ray.currentDrawn) categories.ray.currentDrawn=self;
                neural.init_draw(self.drawNumber,e.pageX,0,self.name, getNumber,printNumber,self,glassCanvas,categories.ray.gesture);
                glassCanvas.add(self.drawNumber);
                self.drawNumber.opacity(0);
            });

            // gestion tactile pour le dessin:
            let touchPos ={};
            this.drawNumber = null;
            svg.addEvent(this.component, "touchstart", function (e) {
                touchPos = {x:e.touches[0].clientX,y:e.touches[0].clientY};
                self.drawNumber = new svg.Drawing(0,0).mark("draw "+self.name);
                neural.init_draw(self.drawNumber,e.touches[0].clientX,0,self.name, getNumber,printNumber,self,glassCanvas,categories.ray.gesture);
                if(!categories.ray.currentDrawn) categories.ray.currentDrawn=self;
                glassCanvas.add(self.drawNumber);
                self.drawNumber.opacity(0);
            });

        }

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
            let self =this;
            function removeNumber(element){
                for(var c=0;c<self.toAdd.length;c++){
                    element.component.remove(self.toAdd[c]);
                }
            }

            for(let i=0; i<number.length;i++){
                this.toAdd[i] = new svg.Text(n[i]).position((i+1)*(this.width/(number.length+1)),this.height/1.5)
                    .font("Calibri",this.height/1.5,1).color(svg.BLACK).opacity(0.7);
                this.component.add(this.toAdd[i]);
            }

            setTimeout(function () {
                removeNumber(self);
                self.anim=false;
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
            this.component.remove(this.listMarkers);
            this.listMarkers=new svg.Translation();
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
            this.listMarkers.add(meNewMarker);
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
                    this.listMarkers.add(newMarker);
                }
            }
            this.component.add(this.listMarkers);
            this.listMarkers.move(market.width*0.75,market.height*0.08);
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
        sentence=replaceChar(sentence);
        let jsonFile = param.data.getJson();
        let words = sentence.split(" ");
        var tabProduct = [];
        var tabTotalCat = [];
        let catDone= [];
        let prodDone = [];
        for (var i=0; i<words.length;i++){
            for (var cat in jsonFile){
                if(config=="all"){
                    if (words[i].toLowerCase().includes(replaceChar(cat).toLowerCase())
                        || (words[i] + " " + words[i + 1]).toLowerCase().includes(replaceChar(cat).toLowerCase())
                        || (words[i] + " " + words[i + 1] + " " + words[i + 2]).toLowerCase().includes(replaceChar(cat).toLowerCase())
                        || (words[i] + "s").toLowerCase().includes(replaceChar(cat).toLowerCase())) {
                        if(catDone.indexOf(cat)==-1){
                            catDone.push(cat);
                            var tabCat = param.data.makeVignettesForRay(cat, ThumbnailRayon);
                            tabTotalCat = tabTotalCat.concat(tabCat);
                        }
                    }
                }
                var products = jsonFile[cat];
                for (var prodName in products){
                    if (words[i].toLowerCase().includes(replaceChar(prodName).toLowerCase())
                        ||(words[i]+" "+words[i+1]).replace("-"," ").toLowerCase().includes(replaceChar(prodName).toLowerCase())
                        ||(words[i]+" "+words[i+1]+" "+words[i+2]).toLowerCase().includes(replaceChar(prodName).toLowerCase())
                        ||(words[i] + "s").toLowerCase().includes(replaceChar(prodName).toLowerCase())){
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

    market.vocalRecognition = function(message) {
        message = replaceChar(message);
        if (message != "") {
            if (market.map) {
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
                        setTimeout(function(){
                            market.map.updateMarkersSide();
                        },500);
                    }
                    else if (words[i].includes("valide")) {
                        market.pages[1].obj.smoothy(10, 40).moveTo(Math.round(-pageWidth + market.width * 0.02), 0);
                        currentPage = market.calendar;
                        currentIndex = 0;
                        market.map.mapOn = false;
                        market.calendar.calendarOn = true;
                        currentMapSearch = market.map.input.value;
                        mapPage.remove(market.map.component);
                        market.map = null;
                    }
                }
            }
            else if (market.calendar.calendarOn) {
                let spMessage = message.split(" ");
                if (spMessage.includes("choisis") || spMessage.includes("créneau") || spMessage.includes("veux") || spMessage.includes("livrer")) {
                    for (let word=0; word < spMessage.length; word ++) {
                        for (let k = 0; k < market.calendar.rounds.length; k++) {
                            if (spMessage[word] == market.calendar.rounds[k].tabH.dayP.substring(0, 2) && market.calendar.rounds[k].tabH.left !== 0) {
                                if(spMessage[word+3]!== undefined){
                                    if(spMessage[word+3] == market.calendar.rounds[k].tabH.hourDL+"h") {
                                        market.calendar.checkPlace(market.calendar.rounds[k]);
                                    }
                                }else
                                    market.calendar.checkPlace(market.calendar.rounds[k]);
                            }else if(spMessage[word] == "aujourd'hui"){
                                let day = timer.getDayInMonth();
                                if(day ==  market.calendar.rounds[k].tabH.dayP.substring(0, 2) && market.calendar.rounds[k].tabH.left !== 0){
                                    if(spMessage[word+2]!== undefined){
                                        if(spMessage[word+2] == market.calendar.rounds[k].tabH.hourDL+"h") {
                                            market.calendar.checkPlace(market.calendar.rounds[k]);
                                        }
                                    }else
                                        market.calendar.checkPlace(market.calendar.rounds[k]);
                                }
                            }else if(spMessage[word] == "demain"){
                                let tomorrow = timer.getDayInMonth() + 1;
                                if(tomorrow ==  market.calendar.rounds[k].tabH.dayP.substring(0, 2) && market.calendar.rounds[k].tabH.left !== 0){
                                    if(spMessage[word+2]!== undefined){
                                        if(spMessage[word+2] == market.calendar.rounds[k].tabH.hourDL+"h") {
                                            market.calendar.checkPlace(market.calendar.rounds[k]);
                                        }
                                    }else
                                        market.calendar.checkPlace(market.calendar.rounds[k]);
                                }
                            }
                        }
                    }
                } else {
                    let answer = message.toLowerCase();

                    if (answer.includes("oui") && market.calendar.selectedHourday) {
                        market.textToSpeech("Ok vous serez livrés aux horaires choisis. Vous allez etre redirigé sur la page d'accueil.", "fr");
                        setTimeout(function(){
                            resetMarket();
                        },3000);
                    }
                    else if (answer.includes("non") && market.calendar.selectedHourday) {
                        market.textToSpeech("Nous annulons votre livraison", "fr");
                        market.calendar.picto.position(market.calendar.width * 0.15, market.calendar.height * 0.09);
                        this.selectedHourday = false;
                    }else{
                        market.textToSpeech("Dites OUI pour valider votre livraison, ou NON pour changer de date", "fr");
                    }
                }
            }

            else {
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

                let oneOrderChecked = false;
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
                            market.textToSpeech("Ok, je cherche.")
                            doSearch(tab);
                        }
                        oneOrderChecked = true;
                    }
                    else {
                        if (order.includes("vide") && order.includes("panier")) {
                            market.textToSpeech("Ok, Je vide le panier");
                            market.basket.emptyBasket();
                            oneOrderChecked = true;
                        }
                        else if (order.includes("paye") || order.includes("paie")) {
                            market.textToSpeech("Ok, passons au payement")
                            market.payment.card.position(market.payment.width * 0.6, market.payment.height / 2);
                            market.payment.cardIn = true;
                            market.payment.showCode();
                            oneOrderChecked = true;
                        }
                    }
                }

                if (!oneOrderChecked) {
                    message += ", " + Date();
                    listener.writeLog(message);
                    console.log("No Correct Order Given");
                    market.textToSpeech("Je n'ai pas bien compris votre demande", "fr");
                }
            }
        }
        else {
            console.log("S'il te plait puisses-tu discuter?");
        }
    };

    market.textToSpeech=function(msg){
        speech.talk(msg);
    };

    function replaceChar(msg){
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
            market.mapsfunction = Maps.initMap(param.data.getMarker(), market.toCalendar,targetMap);
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

    market.toCalendar= function(message){
        currentMapSearch= market.map.input.value;
        mapPage.remove(market.map.component);
        market.map=null;
        market.pages[1].obj.smoothy(10, 40).onChannel(1).moveTo(Math.round(-pageWidth - market.width * 0.02), 0);
        market.calendar.address=message;
        market.calendar.calendarOn=true;
        setTimeout(function () {
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
        market.pages[i].obj.onClick(function(){
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
                        setTimeout(function(){
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

    market.textToSpeech("Bonjour, Bienvenue!","fr");

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
            setTimeout(function(){
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


    return market;
    //////////////////////////////
};