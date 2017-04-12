exports.main = function(svg,gui,param,neural) {

    let screenSize = svg.runtime.screenSize();
	let market = new svg.Drawing(screenSize.width,screenSize.height).show('content');
    let glassDnD = new svg.Translation().mark("Glass");

    ///////////////BANDEAUX/////////////////
	class DrawingZone {
		constructor(width,height,x,y)
		{
			this.component = new svg.Drawing(width,height).position(x,y);
		}
	}

	class ListCategorie extends DrawingZone {
		constructor(width,height,x,y,tabCat)
		{
			super(width,height,x,y);
            
            //Rebords
            let rectangleBackground = new svg.Rect(width,height).position(width/2,height/2).color(svg.BLACK);
            this.component.add(rectangleBackground);

            //Rayon Actuellement Selectionné
            this.ray = null;
            this.rayTranslation = null;
            var self = this;
            this.currentSearch=[];

            this.tabCategories = tabCat;
            let listThumbnail = new svg.Translation().mark("listeCategories");
            for(let i=0;i<this.tabCategories.length;i++) {
                let current = this.tabCategories[i];
                current.placeElements();
                current.move(height*i,0);
                listThumbnail.add(current.component);
            }
            this.component.add(listThumbnail);

            let chevronWest = new svg.Chevron(20,50,3,"W").position(30,this.component.height/2).color(svg.WHITE);
            let chevronEast = new svg.Chevron(20,50,3,"E").position(width-30,this.component.height/2).color(svg.WHITE);
            let ellipseChevronWest = new svg.Ellipse(30,40).color(svg.BLACK).opacity(0.70).position(30,this.component.height/2);
            let ellipseChevronEast = new svg.Ellipse(30,40).color(svg.BLACK).opacity(0.70).position(this.component.width-30,this.component.height/2);
            let zoneChevronWest = new svg.Translation().add(ellipseChevronWest).add(chevronWest).opacity(0.2).mark("chevronWCategorie");
            let zoneChevronEast = new svg.Translation().add(ellipseChevronEast).add(chevronEast).mark("chevronECategorie");
            
            zoneChevronWest.onClick(function(){
                if(listThumbnail.x+3*height<=0)
                {
                    if(listThumbnail.x+3*height==0)
                    {
                        zoneChevronWest.opacity(0.2);
                    }
                    listThumbnail.smoothy(10,20).moveTo(listThumbnail.x+height*3,listThumbnail.y);
                    zoneChevronEast.opacity(1);
                }
               
                else{
                    listThumbnail.smoothy(10, 20).moveTo(0, listThumbnail.y);
                    zoneChevronWest.opacity(0.2);
                    zoneChevronEast.opacity(1);
                }
            });
            
            zoneChevronEast.onClick(function(){
                let widthTotal = height*self.tabCategories.length;
                let widthView = width;
                let positionRight = listThumbnail.x+widthTotal;
                if(positionRight-3*height>=widthView){
                    if (positionRight - 3 * height == widthView) {
                        zoneChevronEast.opacity(0.2);
                    }
                    listThumbnail.smoothy(10, 20).moveTo(listThumbnail.x - height * 3, listThumbnail.y);
                    zoneChevronWest.opacity(1);
                }
                else
                {
                    listThumbnail.smoothy(10,20).moveTo(widthView-widthTotal,listThumbnail.y);
                    zoneChevronEast.opacity(0.2);
                    zoneChevronWest.opacity(1);
                }
            });

            this.component.add(zoneChevronEast).add(zoneChevronWest);
		}
	}
    
    class Ray extends DrawingZone {
        
		constructor(width,height,x,y,tabThumbnail,cat)
		{
			super(width,height,x,y);

			var self = this; // Gestion Evenements

			this.name = cat;
            let fond = new svg.Rect(width, height).position(width/2,height/2);
            fond.color(svg.LIGHT_GREY,5);
            this.component.add(fond);

            this.listThumbnailsUp = new svg.Translation().mark("listRayUp");
            this.listThumbnailsDown = new svg.Translation().mark("listRayDown");
            let place = 0;
            for(let i=0;i<tabThumbnail.length;i=i+2){
                tabThumbnail[i].placeElements(1);
                tabThumbnail[i].move(height/2*place,0);
                this.listThumbnailsUp.add(tabThumbnail[i].component);

                
                if(i+1<tabThumbnail.length)
                {
                    tabThumbnail[i+1].placeElements(0);
                    tabThumbnail[i+1].move(height/2*place,height/2);
                    this.listThumbnailsDown.add(tabThumbnail[i+1].component);
                }
                place++;
            }
            this.component.add(this.listThumbnailsDown).add(this.listThumbnailsUp);

            let chevronWest = new svg.Chevron(20, 70, 3, "W").position(30, this.component.height / 2).color(svg.WHITE);
            let chevronEast = new svg.Chevron(20, 70, 3, "E").position(width - 30, this.component.height / 2).color(svg.WHITE);
            let ellipseChevronWest = new svg.Ellipse(30, 50).color(svg.BLACK).opacity(0.40)
                                                            .position(30, this.component.height / 2);
            let ellipseChevronEast = new svg.Ellipse(30, 50).color(svg.BLACK).opacity(0.40)
                                                            .position(this.component.width - 30, this.component.height / 2);
            let zoneChevronWest = new svg.Translation().add(ellipseChevronWest).add(chevronWest).opacity(0.2).mark("chevronWRay");
            let zoneChevronEast = new svg.Translation().add(ellipseChevronEast).add(chevronEast).mark("chevronERay");

            zoneChevronWest.onClick(function () {
                if (self.listThumbnailsUp.x + height*2 <= 0) {
                    self.listThumbnailsUp.smoothy(10, 20).onChannel("rayUp").moveTo(self.listThumbnailsUp.x+height,self.listThumbnailsUp.y);
                    self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(self.listThumbnailsDown.x+height,self.listThumbnailsUp.y);
                    zoneChevronEast.opacity(1);
                }
                else {
                    self.listThumbnailsUp.smoothy(10, 20).onChannel("rayUp").moveTo(0, self.listThumbnailsUp.y);
                    if (tabThumbnail.length % 2 != 0) {
                        self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(0, self.listThumbnailsDown.y);
                    }
                    else{
                        self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(0, self.listThumbnailsDown.y);
                    }
                    zoneChevronWest.opacity(0.2);
                    zoneChevronEast.opacity(1);
                }
            });

            zoneChevronEast.onClick(function () {
                let widthView = width;
                let widthTotalH = height / 2 * Math.ceil(tabThumbnail.length / 2);
                let positionRightH = self.listThumbnailsUp.x + widthTotalH;
                if (positionRightH - height*2 >= widthView) {
                    self.listThumbnailsUp.smoothy(10, 20).onChannel("rayUp").moveTo(self.listThumbnailsUp.x - height, self.listThumbnailsUp.y);
                    self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(self.listThumbnailsDown.x - height, self.listThumbnailsDown.y);
                    zoneChevronWest.opacity(1);
                }
                else {
                    self.listThumbnailsUp.smoothy(10, 20).onChannel("rayUp").moveTo(widthView - widthTotalH, self.listThumbnailsUp.y);
                    if (tabThumbnail.length % 2 != 0) {
                        self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(widthView - widthTotalH + height/2, self.listThumbnailsDown.y);
                    }
                    else{
                        self.listThumbnailsDown.smoothy(10, 20).onChannel("rayDown").moveTo(widthView - widthTotalH, self.listThumbnailsDown.y);
                    }
                    zoneChevronEast.opacity(0.2);
                    zoneChevronWest.opacity(1);
                }
            });
            this.component.add(zoneChevronEast).add(zoneChevronWest);
        }
    }
    
    class Basket extends DrawingZone {
        constructor(width, height, x, y) {
            super(width, height, x, y);


            let stroke = new svg.Rect(width, height).position(width / 2, height / 2);
            stroke.color(svg.WHITE,4,svg.BLACK);
            this.component.add(stroke);
            
            this.listProducts = new svg.Translation().mark("listBasket");
            this.component.add(this.listProducts);
            this.thumbnailsProducts = [];

            this.zoneTotal = new svg.Rect(width, height * 0.1).position(width / 2, height * 0.95);
            this.zoneTotal.color(svg.WHITE, 2, svg.BLACK);
            this.component.add(this.zoneTotal);

            this.total = new svg.Text("Total: ");
            this.component.add(this.total);
            this.totalPrice = 0;
            this.printPrice = new svg.Text(this.totalPrice);
            this.component.add(this.printPrice);

            let chevronUp = new svg.Chevron(70, 20, 3, "N").position(this.component.width / 2, 50).color(svg.WHITE);
            let chevronDown = new svg.Chevron(70, 20, 3, "S").position(this.component.width / 2, this.component.height - 100)
                .color(svg.WHITE);
            let ellipseChevronUp = new svg.Ellipse(40, 30).color(svg.BLACK).opacity(0.40).position(this.component.width / 2, 50);
            let ellipseChevronDown = new svg.Ellipse(40, 30).color(svg.BLACK).opacity(0.40)
                .position(this.component.width / 2, this.component.height - 100);
            this.zoneChevronUp = new svg.Translation().add(ellipseChevronUp).add(chevronUp).opacity(0).mark("chevronUpBasket");
            this.zoneChevronDown = new svg.Translation().add(ellipseChevronDown).add(chevronDown).opacity(0).mark("chevronDownBasket");

            let chevDown = this.zoneChevronDown;
            let chevUp = this.zoneChevronUp;
            let zone = this.listProducts;
            let tab = this.thumbnailsProducts;

            this.zoneChevronUp.onClick(function() {
                if ((zone.y + height / 2) < 0) {
                    chevDown.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,zone.y+height/2);
                }
                else {
                    chevDown.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,stroke.y-height/2+2);
                    chevUp.opacity(0);
                }
            });

            this.zoneChevronDown.onClick(function () {
                let heightZone = tab.length * tab[0].height;
                let positionDown = zone.y + heightZone;
                if (chevDown._opacity!=0) {
                    if (positionDown - height / 2 > stroke.y + height / 2) {
                        chevUp.opacity(0.5);
                        zone.smoothy(10, 20).moveTo(zone.x, zone.y - height / 2 + 2);
                    }
                    else {
                        chevUp.opacity(0.5);
                        zone.smoothy(10, 20).moveTo(zone.x, stroke.y + (stroke.height * 0.4) - heightZone + 2);
                        chevDown.opacity(0);
                    }
                }
            });
            this.component.add(this.zoneChevronUp).add(this.zoneChevronDown);

            this.calculatePrice(0);
        }

        calculatePrice(price) {
            this.totalPrice = this.totalPrice + price;
            this.component.remove(this.printPrice);
            this.component.remove(this.total);
            if(this.totalPrice>10000){
                this.printPrice = new svg.Text(this.totalPrice.toFixed(2) + " €").position(this.component.width * 0.65, this.zoneTotal.y + 10)
                    .font("calibri", this.zoneTotal.height*0.35, 1).color(svg.BLACK).mark("bigPrice");
                this.total = new svg.Text("TOTAL").position(this.component.width / 5, this.zoneTotal.y + 10)
                    .font("calibri", this.zoneTotal.height*0.35, 1).color(svg.BLACK);
            }
            else{
                this.printPrice = new svg.Text(this.totalPrice.toFixed(2) + " €").position(this.component.width * 0.70, this.zoneTotal.y + 10)
                    .font("calibri", this.zoneTotal.height*0.40, 1).color(svg.BLACK).mark("Price");
                this.total = new svg.Text("TOTAL").position(this.component.width / 4, this.zoneTotal.y + 10)
                    .font("calibri", this.zoneTotal.height*0.40, 1).color(svg.BLACK);
            }
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
                    let newText=product.quantity + "x " + product.price + " €"+product.complement;
                    product.changeText(newText);
                    occur=1;
                }
            }
            if (occur==0){
                newProd.addQuantity(quantity);
                this.listProducts.add(newProd.component);
                this.thumbnailsProducts.push(newProd);
                let newText=newProd.quantity + "x " + newProd.price + " €"+newProd.complement;
                newProd.changeText(newText);
            }

            newProd.component.onMouseDown(function(e){
                self.dragBasket(e,newProd);
            });

            this.calculatePrice(newProd.price*quantity);

            if (this.thumbnailsProducts.length < 2 && occur==0) {
                newProd.placeElements();
                newProd.move(0,0);
            }
            else {
                if(occur==0){
                    if(this.thumbnailsProducts.length>2)
                    {
                        this.zoneChevronDown.opacity(0.5);
                    }
                    let ref = this.thumbnailsProducts[this.thumbnailsProducts.length-2];
                    newProd.placeElements();
                    newProd.move(0,ref.y+ref.height);
                }
            }
        }

        deleteProducts(thumbnail,numberProduct){
            let height = this.component.height;
            let chevB = this.zoneChevronDown;
            let chevH = this.zoneChevronUp;

            thumbnail.minusQuantity(numberProduct);
            let newText = thumbnail.quantity + " x " + thumbnail.price + " €" + thumbnail.complement;
            thumbnail.changeText(newText);

            if(thumbnail.quantity ==0){
                if ((this.thumbnailsProducts.indexOf(thumbnail)==this.thumbnailsProducts.length-1 || this.thumbnailsProducts.indexOf(thumbnail)==this.thumbnailsProducts.length-2) && this.thumbnailsProducts.length-1>2){
                    let heightZone=this.thumbnailsProducts.length * this.thumbnailsProducts[0].height;
                    this.listProducts.smoothy(10, 20).moveTo(this.listProducts.x,(height*0.9-heightZone+this.thumbnailsProducts[0].height ));
                }else if(this.thumbnailsProducts.length-1<=2){
                    this.listProducts.smoothy(10, 20).moveTo(this.listProducts.x, 0);
                    chevB.opacity(0);
                    chevH.opacity(0);
                }
                this.listProducts.remove(thumbnail.component);
                this.thumbnailsProducts.splice(this.thumbnailsProducts.indexOf(thumbnail), 1);
                this.calculatePrice(-((thumbnail.price)*numberProduct));
                for (let product of this.thumbnailsProducts) {
                    product.placeElements();
                    product.move(0,this.thumbnailsProducts.indexOf(product)*(product.height));
                }
            }else {
                this.calculatePrice(-((thumbnail.price)*numberProduct));
            }
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
        }

        emptyBasket() {
            for (var i=this.thumbnailsProducts.length-1; i>=0; i--){
                console.log(this.thumbnailsProducts[i].component);
                basket.deleteProducts(this.thumbnailsProducts[i],this.thumbnailsProducts[i].quantity);
            }
            this.thumbnailsProducts.splice(0,this.thumbnailsProducts.length);
            console.log(this.thumbnailsProducts);
        }


        dragBasket(e,current) {
            let dragged = new Thumbnail(current.image.src,current.name);
            dragged.placeElementsDnD(current);
            dragged.cross = new svg.Cross(10, 10, 2).color(svg.RED, 2, svg.RED).opacity(0).mark("cross");
            dragged.cross.smoothy(1,1).rotateTo(-45);
            dragged.cross.position(dragged.width*0.55,dragged.height*0.71);
            dragged.component.add(dragged.cross);
            dragged.cross.onMouseUp(function(){
                basket.deleteProducts(current,current.quantity);
            });

            dragged.move(current.x,current.y);
            dragged.component.opacity(0.9).mark("dragged");
            basket.listProducts.add(dragged.component);

            gui.installDnD(dragged,glassDnD,{
                moved:
                    function(dragged){
                        if((dragged.x+dragged.width/2<0)&&(dragged.y+dragged.height/2>market.height*0.20)){
                            basket.deleteProducts(current, 1);
                            changeRay(current.categorie);
                        }
                    },
                revert:
                    function(dragged){
                        basket.listProducts.remove(dragged.component);
                    },
                clicked :
                    function(){
                        changeRay(current.categorie);
                    }
            });
            svg.event(dragged.component, 'mousedown', e);
            market.add(glassDnD);
        }

        emptyBasket() {
            for (var i=this.thumbnailsProducts.length-1; i>=0; i--){
                console.log(this.thumbnailsProducts[i].component);
                basket.deleteProducts(this.thumbnailsProducts[i],this.thumbnailsProducts[i].quantity);
            }
            this.thumbnailsProducts.splice(0,this.thumbnailsProducts.length);
            console.log(this.thumbnailsProducts);
        }
    }

    class Header extends DrawingZone{
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.component.add(new svg.Rect(width,height).position(width/2,height/2).color(svg.DARK_BLUE,2,svg.BLACK));
            this.component.add(new svg.Text("Digi-Market").position(100,height*0.75).font("Calibri",this.component.height*0.75,1)
                .color(svg.WHITE));
            this.micro = new svg.Image("img/microphone.png").mark("micro");
            this.component.add(this.micro);
            this.micro.position(width*0.95,height/2).dimension(height*0.9,height*0.9);

            this.micro.onClick(function(){
                vocalRecognition("");
            });
        }
    }

    class Payment extends DrawingZone
    {
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.background = new svg.Rect(width,height).position(width/2,height/2).color(svg.WHITE,2,svg.BLACK);
            this.card = new svg.Image("img/card.png").dimension(width*0.65,height*0.75).position(width*0.1,height/2).mark("card");
            this.tpeBack = new svg.Image("img/atm-empty-background.png").dimension(width,height).position(width,height/2);
            this.tpe = new svg.Image("img/atm-empty.png").dimension(width,height).position(width,height/2);
            this.glassDnd = new svg.Translation().mark("glass");

            this.iteration=1;
            this.width = width;
            this.height = height;
            this.cardIn = false;

            this.component.add(this.background);
            this.component.add(this.tpeBack);
            this.component.add(this.card);
            this.component.add(this.glassDnd);
            this.component.add(this.tpe);

            let self = this;
            this.card.onMouseDown(function(e){
                self.dragCard(e);
            });

            svg.addEvent(this.card,"touchstart",function(){
                svg.addEvent(self.card,"touchmove",function(e){
                    if(self.card.x+self.card.width/2<self.tpe.x-self.tpe.width/4)
                        self.card.position(e.touches[0].clientX-x,self.card.y);
                    else if(self.cardIn==false){
                        self.showCode();
                        self.card.position(self.width*0.6,self.height/2);
                        self.cardIn=true;
                        svg.event(self.card, 'touchend', e);
                    }
                });
            });
        }

        dragCard(e)
        {
            let dragged = new Object();
            let self = this;

            dragged.x = 0;
            dragged.events = [];
            dragged.addEvent = function(eventName, handler) {
                svg.addEvent(this.component, eventName, handler);
                this.events[eventName] = handler;
                return this;
            };
            dragged.move = function(x){
                this.x = x;
                this.component.move(x,0);
                if((this.x+self.card.width/2>self.tpe.x-self.tpe.width/2)&&(self.cardIn==false)) {
                    svg.event(dragged.component, 'mouseup', e);
                    self.card.position(self.width*0.6,self.height/2);
                    self.cardIn=true;
                    self.showCode();
                }
                else if(self.cardIn==true) {
                    svg.event(dragged.component, 'mouseup', e);
                    self.card.position(self.width*0.1,self.height/2);
                    self.cardIn=false;
                }
            };

            dragged.removeEvent = function(eventName){
                svg.removeEvent(this.component, eventName);
                delete this.events[eventName];
                return this;
            };

            dragged.component = new svg.Translation().mark("dragged");
            dragged.component.add(new svg.Image(this.card.src).dimension(this.card.width,this.card.height).position(this.card.x,this.card.y));

            this.component.add(dragged.component);
            this.card.opacity(0);

            this.component.add(this.glassDnd);
            this.component.add(this.tpe);

            gui.installDnD(dragged,this.glassDnd,{
                moved:
                    function(){
                        self.card.opacity(1);
                    },
                revert:
                    function(dragged){
                        self.component.remove(dragged.component);
                    },
                clicked :
                    function(){
                        self.card.opacity(1);
                    }
            });
            svg.event(dragged.component, 'mousedown', e);
        }

        showCode()
        {
            this.zoneCode = new SecurityCode(market.width,market.height,0,0);
            this.zoneCode.component.opacity(1).mark("code");
            this.zoneCode.placeElements();
            market.add(this.zoneCode.component);
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
            this.circleTimer = new svg.Circle(30);
            this.arcTimer = new svg.Path(0,0);
            this.onDrawing = false;
            this.cross = new svg.Image("img/icone-supprimer.png").mark("cross");
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
                            if (market.payment.iteration >3) {
                                self.launchTimer(10, false);
                            }
                        }
                    }else{
                        market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
                        market.payment.cardIn=false;
                        market.payment.iteration=1;
                        self.printCalendar();
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
                        self.printCalendar();
                        market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
                        market.payment.cardIn=false;
                        market.payment.iteration=0;
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
                    self.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,e.pageX,e.pageY).color(svg.BLACK,5,svg.BLACK);
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
                    if(!self.code.includes(button.value)) self.code += button.value;
                }

                //Dessin Dynamique
                if(self.onDrawing && self.code.length>0) {
                    self.buttons.remove(self.currentLine);
                    let buttonBase = self.tabButtons[parseInt(self.code.charAt(self.code.length-1))-1];
                    self.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,
                        e.touches[0].clientX,e.touches[0].clientY)
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
            this.width = width;
            this.height = height;
        }

        placeElements()
        {
            this.arcTimer.move(this.width/2,this.height*0.93).color(svg.LIGHT_GREY,5,svg.RED).opacity(0).arc(30,30,0,1,0,this.width/2,this.height*0.93);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).color(svg.GREY,1,svg.BLACK).opacity(0.8);
            this.title.position(this.width/2,this.height*0.1).font("calibri",this.width/20,1).color(svg.BLACK);
            this.circleTimer.position(this.width/2,this.height*0.93).color(svg.LIGHT_GREY,5,svg.RED).opacity(0);
            this.timer.position(this.width/2,this.height*0.90).font("calibri",20,1).color(svg.BLACK).opacity(0);
            this.cross.position(this.width/2,this.height*0.80).dimension(this.width*0.1,this.width*0.05).color(svg.BLACK).opacity(1);

        }

        changeTimer(newTimer,color){
            var x=this.width/2 + 30*Math.cos( (Math.PI / 180)*(360/10)*(7.5-(newTimer)));
            var y=this.height*0.93 + 30*Math.sin( (Math.PI / 180)*(360/10)*(7.5-(newTimer)));
            var lf=1;
            if(10-newTimer>10/2)lf=0;
            if(newTimer==10){this.circleTimer.opacity(1).color(svg.LIGHT_GREY,5,svg.RED);}
            else{this.circleTimer.opacity(1).color(svg.LIGHT_GREY,5,svg.LIGHT_GREY);}
            this.component.remove(this.arcTimer);
            this.component.remove(this.timer);
            this.timer = new svg.Text(newTimer);
            this.timer.position(this.width/2,this.height*0.935).font("Calibri",20,1).color(svg.BLACK);
            this.arcTimer = new svg.Path(this.width/2,this.height*0.93-30);
            this.arcTimer.arc(30,30,0,lf,0,x,y).color(svg.LIGHT_GREY,5,color);
            this.component.add(this.arcTimer);
            this.component.add(this.timer);
        }

        changeText(message,color){
            this.component.remove(this.message);
            this.message = new svg.Text(message).mark("result");
            this.message.position(this.width/2,this.height*0.87).font("calibri",20,1).color(color).opacity(1);
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
             if(state===false){
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
             else{
                 for(let i =0;i<seconds+1;i++){
                     setTimeout(function(i){
                         return function(){
                             market.payment.zoneCode.hideCircle();
                             market.payment.zoneCode.changeText("Code correct",svg.GREEN);
                             if (i===seconds){
                                 market.remove(glassTimer);
                                 market.remove(market.payment.zoneCode.component);
                             }
                         }
                     }(i),i*1000);
                 }
             }
        }

        checkPassword(password){
              if(password === "321456987"){
                  return true;
              }
              return false;
        }

        printCalendar(){
            market.calendar = new Calendar(market.width,market.height,0,0);
            market.calendar.placeElements(new Date().getMonth());
            let zoneCalendar = new svg.Translation().add(market.calendar.component);
            market.add(zoneCalendar);
        }
    }

    class Calendar{

        constructor(width,height,x,y){
            this.component = new svg.Translation();
            this.background = new svg.Rect();
            this.title = new svg.Rect();
            this.titleText = new svg.Text("Avril 2017");
            this.calendarFirstRow = new svg.Translation();
            this.calendarFirstColumn = new svg.Translation();
            this.calendarContent = new svg.Translation();
            this.calendarCases = [];
            this.monthChoice = new svg.Translation();

            this.component.add(this.background);
            this.component.add(this.title);
            this.component.add(this.titleText);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.monthChoice);

            this.x = x;
            this.y = y;
            this.component.move(x,y);
            this.width = width;
            this.height = height;

            let self = this;
            this.picto = new svg.Image("img/user.png");
            let onMove=false;
            this.picto.onMouseDown(function(e){
                onMove=true;
                let anchorPoint = {x:e.pageX-self.picto.x,y:e.pageY-self.picto.y};
                self.picto.onMouseMove(function(e){
                    if(onMove) self.picto.position(e.pageX-anchorPoint.x,e.pageY-anchorPoint.y);
                });

                self.picto.onMouseUp(function(e){
                    onMove=false;
                    self.checkPlace(e.pageX,e.pageY);
                });
            });
            this.component.add(this.picto);

            this.calendarWidth = width*0.9;
            this.calendarHeight = height*0.8;
        }

        placeElements(month){
            this.caseWidth = this.calendarWidth/12;
            this.caseHeight = this.calendarHeight/10;
            this.picto.position(this.width*0.05,this.height*0.25).dimension(this.caseWidth,this.caseHeight);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).color(svg.WHITE).opacity(0.8);
            this.title.dimension(this.calendarWidth,this.calendarHeight*0.1).color(svg.LIGHT_BLUE,1,svg.BLACK).opacity(0.8);
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.BLACK);
            this.monthChoice.add(this.title).add(this.titleText);
            this.monthChoice.move(this.width*0.6-this.caseWidth, this.height*0.05+this.title.height/2);

            let date = new Date();
            let tabDays = [];
            let modulator=0;
            for(let j=0;j<11;j++) {
                let dayCase = new svg.Translation();
                dayCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.ORANGE,1,svg.BLACK));
                let text = "";
                if (j==0){
                   text = "Dates";
                }
                else if ((j ==1)&&(month==date.getMonth())){
                    text = "Aujourd'hui";
                }
                else if ((j ==2)&&(month==date.getMonth())){
                    text = "Demain";
                }
                else{
                    if(((j-1)+date.getDay())%7==0) modulator++;
                    text = this.getWeekDay()[((j-1+modulator)+date.getDay())%7]+ " " + (date.getDate()+j-1+modulator);
                }
                dayCase.add(new svg.Text(text).font("calibri", this.width /70, 1).color(svg.BLACK));
                tabDays.push(text);
                this.calendarFirstColumn.add(dayCase);
                dayCase.move(0,j*this.caseHeight);
                this.calendarFirstColumn.move(this.width*0.6-this.title.width/2-this.caseWidth/2,this.height*0.05+this.title.height*1.5);
            }

            let tabHours = [];
            for (var i=0;i<11;i++){
                let hourCase = new svg.Translation();
                hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREEN,1,svg.BLACK));
                hourCase.add(new svg.Text((i+8)+"h-"+(i+9)+"h").font("calibri",this.width/55,1).color(svg.BLACK));
                tabHours.push((i+8)+"h-"+(i+9)+"h");
                hourCase.move(i*this.caseWidth,0);
                this.calendarFirstRow.add(hourCase);
                this.calendarFirstRow.move(this.width*0.6-this.title.width/2+this.caseWidth/2,this.height*0.05+this.title.height*1.5);
            }

            for(var i=0;i<11;i++){
                let line = new svg.Translation();
                for (var j=0;j<11;j++){
                    let element = new svg.Rect(this.caseWidth,this.caseHeight).color(svg.WHITE,1,svg.BLACK).position(j*this.caseWidth,0);
                    line.add(element);
                    this.calendarCases.push({background:element,hour:tabHours[j],day:tabDays[i],
                            x:this.width*0.6-this.title.width/2+this.caseWidth/2+j*this.caseWidth,y:this.height*0.05+this.title.height*1.5+i*this.caseHeight});
                }
                line.move(this.width*0.6-this.title.width/2+this.caseWidth/2,this.height*0.05+this.title.height*1.5+this.caseHeight+this.caseHeight*i);
                this.calendarContent.add(line);
            }
        }

        checkPlace(x,y){
            let choice = null;
            for (let i = 0; i < this.calendarCases.length; i++) {
                if ((x > this.calendarCases[i].x-this.caseWidth/2) && (x < this.calendarCases[i].x + this.caseWidth/2) &&
                    (y > this.calendarCases[i].y-this.caseHeight/2) && (y > this.calendarCases[i].y - this.caseHeight/2)){
                    choice = this.calendarCases[i];
                }
            }
            if(choice!=null) {
                this.picto.position(choice.x, choice.y);
            }
            else{
                this.picto.position(this.width*0.05,this.height*0.25);
            }
            console.log(choice.day+" "+choice.hour);
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
    }
    

    ////////////VIGNETTES//////////////////
	class Thumbnail {
        constructor(image,title)
        {
            this.component = new svg.Translation();
            this.image = new svg.Image(image);
            this.name = title;
            this.title = new svg.Text(title);
            this.background = new svg.Rect().color(svg.WHITE);
            this.component.add(this.background);
            this.component.add(this.image);
            this.component.add(this.title);
            this.events = [];

            this.x = 0;
            this.y = 0;
            this.component.move(this.x,this.y);
            this.width = 0;
            this.height = 0;
        }

        addEvent(eventName, handler) {
            svg.addEvent(this.component, eventName, handler);
            this.events[eventName] = handler;
            return this;
        }

        removeEvent(eventName) {
            svg.removeEvent(this.component, eventName);
            delete this.events[eventName];
            return this;
        }

        move(x,y) {
            this.x = x;
            this.y = y;
            this.component.move(x,y);
        }

        placeElementsDnD(current)
        {
            this.width = current.width;
            this.height = current.height;
            this.image.position(this.width/2-2,this.height/2-2).dimension(this.width-30,this.height-30);
            this.title.position(this.width/2,this.height*0.1).font("Calibri",15,1).color(svg.BLACK);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height);
        }
	}

	class ThumbnailCategorie extends Thumbnail {
        constructor(image,image2,title){
            super(image,title);
            this.highlightedImage = new svg.Image(image2);
            this.highlightedImage.opacity(0);
            this.image.opacity(1);
            this.component.add(this.highlightedImage);
            this.component.add(this.title);
            this.name = title;

            this.width = (market.height/5)-4;
            this.height = (market.height/5)-4;

            //GESTION SELECTION//
            let current = this;
            this.component.onClick(function(){
                changeRay(current.name);
            });

            this.component.onMouseEnter(function(){

                current.image.opacity(0);
                current.highlightedImage.opacity(1);
            });

            this.title.onMouseEnter(function(){
                current.image.opacity(0);
                current.highlightedImage.opacity(1);
            });

            this.component.onMouseOut(function(){
                if(categories.ray==null || current.name!=categories.ray.name)
                {
                    current.image.opacity(1);
                    current.highlightedImage.opacity(0);
                }
            });
		}

		placeElements()
        {
            this.image.position(this.width/2,this.height/2+2).dimension(this.width,this.height).mark(this.name);
            this.highlightedImage.position(this.width/2,this.height/2+2).dimension(this.width,this.height).mark(this.name+"2");
            this.title.position(this.height/2,this.height*0.93).font("Calibri",15,1).color(svg.WHITE).mark(this.name + " title");
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
            this.width = market.height*0.75/2;
            this.height = market.height*0.75/2;
            this.toAdd=[];
            this.waitingNumber = new svg.Text("");
            this.numberArea = new svg.Rect(0,0);
            this.component.add(this.numberArea);
            this.component.add(this.waitingNumber);
            let self = this;
            this.image.onMouseEnter(function()
            {
                self.image.smoothy(20,10).resizeTo(self.width-2,self.height-2);// modif dans svgTranslation
            });

            this.title.onMouseEnter(function()
            {
                self.image.smoothy(20,10).resizeTo(self.width-2,self.height-2);// modif dans svgTranslation
            });

            this.image.onMouseOut(function()
            {
                self.image.smoothy(20,10).resizeTo(self.width-30,self.height-30);
            });

            function printNumber(number){
            self.component.remove(self.waitingNumber);
            self.component.remove(self.numberArea);
            if(number==="") {
                self.numberArea = new svg.Rect(0,0);
                self.component.add(self.numberArea);
                }
                else {
                    self.numberArea = new svg.Rect(self.width*0.12,self.height*0.1).position(self.width*0.1,self.height*0.08).color(svg.WHITE,2,svg.BLACK);
                    self.component.add(self.numberArea);

                }
            self.waitingNumber = new svg.Text(number);
            self.waitingNumber.position(self.width*0.1,self.height*0.1).font("Calibri",self.width*0.075,1);
            self.component.add(self.waitingNumber);
            }

            function getNumber(number,e,element){
                if((number=="click")||(mousePos.x==e.pageX && mousePos.y==e.pageY)) {
                    element.addAnimation("1");
                    basket.addProducts(self,"1");
                }
                else if(number!="?") {
                    for(var c of number.split('')){
                        if(c=="?") return;
                    }
                    element.addAnimation(number);
                    basket.addProducts(element, parseInt(number));
                }
            }

            let mousePos ={};
            this.component.onMouseDown(function(e){
                mousePos = {x:e.pageX,y:e.pageY};
                self.drawNumber = new svg.Drawing(0,0).mark("drawing "+self.name);
                neural.init_draw(self.drawNumber,0,0,self.name, getNumber,printNumber,e,self,glassCanvas);
                glassCanvas.add(self.drawNumber);
                self.drawNumber.opacity(0);
            });
        }

        placeElements(place) {
            this.component.mark("Product " + this.name);
            this.image.position(this.width/2,this.height/2).dimension(this.height-30,this.height-30).mark("Image " + this.name);
            this.background       .position(this.width/2,this.height/2).dimension(this.height-2,this.height-2);
            this.title      .position(this.width/2,this.height*0.1) .font("Calibri",15,1).color(svg.BLACK).mark("Title "+this.name);
            this.printPrice .position(this.width/2,this.height*0.95).font("Calibri",15,1).color(svg.BLACK);
        }

        addAnimation(number){
            let n =number.split('');
            let self =this;
            function removeNumber(){
                    for(var c=0;c<self.toAdd.length;c++){
                        self.component.remove(self.toAdd[c]);
                }
            }
            for(let i=0; i<number.length;i++){
                this.toAdd[i] = new svg.Text(n[i]).position((i+1)*(this.width/(number.length+1)),this.height/1.5).font("Calibri",this.height/1.5,1).color(svg.BLACK).opacity(0.7);
                this.component.add(this.toAdd[i]);
            }
            setTimeout(function () {
                removeNumber();
            },1000);
        }
	}

    class ThumbnailBasket extends ThumbnailRayon{
        constructor(image,title,price,complement,cat){
            super(image,title,price,complement,cat);
            this.quantity = 0;
            this.name = title;
            this.line = new svg.Line(0,0,0,0);
            this.component.add(this.line);

            this.cross = new svg.Image("img/icone-supprimer.png");
            this.component.add(this.cross);

            this.component.mark(this.name);
            this.width = market.width*0.15;
            this.height = market.width*0.15;

            let self = this;
            this.image.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.title.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.cross.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.background.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.component.onMouseOut(function(){
                self.cross.opacity(0);
            });
        }

        addQuantity(num){
            this.quantity = this.quantity+parseInt(num);
        }

        minusQuantity(num){
            this.quantity = this.quantity-parseInt(num);
        }

        changeText(newText){
            this.component.remove(this.printPrice);
            this.printPrice = new svg.Text(newText);
            this.printPrice.position(this.width/2,this.height*0.92).font("Calibri",15,1).color(svg.BLACK);
            this.component.add(this.printPrice);
        }

        placeElements() {
            this.component.mark("Product basket " + this.name);
            this.image.position(this.width/2,this.height/2).dimension(this.width*0.90,this.height*0.90).mark(this.name);
            this.printPrice.position(this.width/2,this.height*0.92).font("Calibri",15,1).color(svg.BLACK);
            this.title.position(this.width/2,this.height*0.10).mark("title "+this.name);
            this.background.position(this.width/2,this.height/2).dimension(this.width-6,this.height-4).mark("background "+this.name);
            this.line.start(0,this.height).end(this.width,this.height).color(svg.BLACK,2,svg.BLACK);
            this.cross.position(this.width*0.90,this.height*0.1).mark("cross "+this.name).dimension(this.width*0.1,this.height*0.1).opacity(0);
        }
    }
    //////////////////////////////////////

    ///Functions///
    function changeRay(name){
        let tab=[];
	    if(name=="Recherche")
        {
            tab = categories.currentSearch;
        }
        else tab = param.data.makeVignettesForRay(name,ThumbnailRayon);
        if(categories.rayTranslation!=null)
        {
            market.remove(categories.rayTranslation);
        }
        categories.ray = new Ray(market.width * 0.85, market.height * 0.75, 0, market.height / 4, tab, name);
        categories.rayTranslation = new svg.Translation().add(categories.ray.component).mark("ray " + name);
        market.add(categories.rayTranslation);
        for(let v=0;v<categories.tabCategories.length;v++)
        {
            categories.tabCategories[v].image.opacity(1);
            categories.tabCategories[v].highlightedImage.opacity(0);
            if(categories.tabCategories[v].name==name)
            {
                categories.tabCategories[v].image.opacity(0);
                categories.tabCategories[v].highlightedImage.opacity(1);
            }
        }
    }

    function search(sentence){
        let jsonFile = param.data.getJson();
        let words = sentence.split(" ");
        var tabProduct = [];
        var tabTotalCat = [];
        for (var i in words){
            for (var cat in jsonFile){
                if(words[i]== cat){
                    var tabCat = param.data.makeVignettesForRay(cat, ThumbnailRayon);
                    tabTotalCat = tabTotalCat.concat(tabCat);
                }
                var products = jsonFile[cat];

                for (var prodName in products){
                    if ((words[i].toLowerCase() == prodName.toLowerCase())
                            ||(words[i].toLowerCase()==prodName.toLowerCase()+"s")
                        ||(words[i].toLowerCase()==prodName.toLowerCase()+"x")){
                        var prod = products[prodName];
                        var thumbnailProduct = new ThumbnailRayon(prod.image,prod.nom, prod.prix,prod.complement, cat);
                        tabProduct.push(thumbnailProduct);
                    }
                }
            }
        }
        var tabThumbnailProd = tabTotalCat.concat(tabProduct);
        return tabThumbnailProd;
    }

    function doSearch(search) {
        market.remove(categories.rayTranslation);
        zoneCategories.remove(categories.component);
        let tab = search;
        let tabCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);
        tabCategories.push(new ThumbnailCategorie("img/search.png","img/search2.png","Recherche"));
        categories=new ListCategorie(market.width*0.85,market.height*0.2,0,market.height*0.05,tabCategories);
        categories.currentSearch=tab;
        zoneCategories.add(categories.component);
        market.add(zoneCategories);

        changeRay("Recherche");
    }

    function vocalRecognition(message){
        message = message.toLowerCase();
        if(message!="") {
            let tab = search(message);
            if (tab[0]) {
                if (message.includes("ajouter")) {
                    for(var i=0;i<tab.length;i++){
                        let quantity = message[message.indexOf(tab[i].name.toLowerCase())-2];
                        if(quantity>="0"&&quantity<="9") {
                            let bef = message[message.indexOf(tab[i].name.toLowerCase())-3];
                            if(bef<"0"&&bef>"9") {
                                bef="";
                            }
                            let bef2 = message[message.indexOf(tab[i].name.toLowerCase())-4];
                            if(bef2<"0"&&bef2>"9") {
                                bef2
                            }
                            basket.addProducts(tab[i], parseInt(""+bef2+bef+quantity));
                        }
                        else basket.addProducts(tab[i], 1);
                    }
                }
                else if (message.includes("supprimer")) {
                    for(var i=0;i<tab.length;i++) {
                        var number = message[message.indexOf(tab[i].name.toLowerCase())-2];
                        var unUne = message.substring(message.indexOf(tab[i].name.toLowerCase())-4,
                            message.indexOf(tab[i].name.toLowerCase())-1);
                        if(number>="0"&&number<="9")
                        {
                            let bef = message[message.indexOf(tab[i].name.toLowerCase())-3];
                            if(bef<"0"||bef>"9") {
                                bef="";
                            }
                            let bef2 = message[message.indexOf(tab[i].name.toLowerCase())-4];
                            if(bef2<"0"&&bef2>"9") {
                                bef2="";
                            }
                            basket.deleteFromName(tab[i].name,parseInt(""+bef2+bef+number));
                        }
                        else if(unUne==" un"||unUne=="une"){
                            basket.deleteFromName(tab[i].name,1);
                        }
                        else basket.deleteFromName(tab[i].name,null);
                    }
                }
                else {
                    doSearch(tab);
                }
            }
            else {
                if (message.includes("vider le panier")) {
                    basket.emptyBasket();
                }
                else if (message.includes("payer")||message.includes("payement")){
                    market.payment.card.position(market.payment.width*0.6,market.payment.height/2);
                    market.payment.cardIn=true;
                    market.payment.showCode();
                }
                else {
                    console.log("PAS KOMPRI");
                }
            }
        }
        else {
            console.log("S'il te plait puisses-tu discuter?");
        }
    }
    //////

    /////Déclaration Interface////
    let glassTimer = new svg.Translation();
    let header = new Header(market.width,market.height/19);
    let zoneHeader = new svg.Translation().add(header.component).mark("header");
    let tabDefaultCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);
    let categories = new ListCategorie(market.width*0.85,market.height*0.2,0,market.height*0.05,tabDefaultCategories);
    let zoneCategories = new svg.Translation().add(categories.component).mark("categories");
    let basket = new Basket(market.width*0.15,market.height*0.75,market.width*0.85,market.height*0.05);
    let zoneBasket = new svg.Translation().add(basket.component).mark("basket");
    market.payment = new Payment(market.width*0.15,market.height*0.20,market.width*0.85,market.height*0.80);
    let zonePayment = new svg.Translation().add(market.payment.component).mark("payment");
    let glassCanvas= new svg.Translation().mark("glassCanvas");

    function addAllParts()
    {
        market.add(zoneCategories).add(zoneBasket).add(zonePayment).add(zoneHeader);
        market.add(glassDnD);
        market.add(glassCanvas);
    }

    addAllParts();
    changeRay("HighTech");
    return market;
	//////////////////////////////
};