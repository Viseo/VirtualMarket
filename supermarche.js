exports.main = function(svg,gui,param,neural) {

    let screenSize = svg.runtime.screenSize();
	let market = new svg.Drawing(screenSize.width,screenSize.height).show('content');

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

            newProd.component.onMouseDown(function(){
                if(market.pages[2].obj==currentPage) self.dragBasket(newProd);
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

        deleteProducts(vignette,numberProduct){
            let height = this.component.height;
            let chevB = this.zoneChevronDown;
            let chevH = this.zoneChevronUp;

            vignette.minusQuantity(numberProduct);
            let newText = vignette.quantity + " x " + vignette.price + " €" + vignette.complement;
            vignette.changeText(newText);

            if(vignette.quantity ==0){
                if ((this.thumbnailsProducts.indexOf(vignette)==this.thumbnailsProducts.length-1 ||
                    this.thumbnailsProducts.indexOf(vignette)==this.thumbnailsProducts.length-2) && this.thumbnailsProducts.length-1>2){
                    let heightZone=this.thumbnailsProducts.length * this.thumbnailsProducts[0].height;
                    this.listProducts.smoothy(10, 20).moveTo(this.listProducts.x,(height*0.9-heightZone+this.thumbnailsProducts[0].height ));
                }else if(this.thumbnailsProducts.length-1<=2){
                    this.listProducts.smoothy(10, 20).moveTo(this.listProducts.x, 0);
                    chevB.opacity(0);
                    chevH.opacity(0);
                }
                this.listProducts.remove(vignette.component);
                this.thumbnailsProducts.splice(this.thumbnailsProducts.indexOf(vignette), 1);
                this.calculatePrice(-((vignette.price)*numberProduct));
                for (let product of this.thumbnailsProducts) {
                    product.placeElements();
                    product.move(0,this.thumbnailsProducts.indexOf(product)*(product.height));
                }
            }else {
                this.calculatePrice(-((vignette.price)*numberProduct));
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

        dragBasket(current) {
            let dragged = new Thumbnail(current.image.src,current.name);
            dragged.placeElementsDnD(current);
            dragged.cross = new svg.Cross(10, 10, 2).color(svg.RED, 2, svg.RED).opacity(0).mark("cross");
            dragged.cross.smoothy(1,1).rotateTo(-45);
            dragged.cross.position(dragged.width*0.55,dragged.height*0.71);
            dragged.component.add(dragged.cross);
            dragged.move(current.x+pageWidth*0.85,current.y+header.height);
            dragged.component.opacity(0.9).mark("dragged");

            dragged.component.onMouseMove(function(e){
                dragged.move(e.pageX-current.width/2,e.pageY-current.height/2);
            });

            dragged.component.onMouseUp(function(){
                if((dragged.x+dragged.width/2<pageWidth*0.85)&&(dragged.y+dragged.height/2>market.height*0.20)){
                    market.basket.deleteProducts(current, 1);
                    changeRay(current.categorie);
                }
                glassDnD.remove(dragged.component);
            });

            glassDnD.add(dragged.component);
            market.add(glassDnD);
        }

        emptyBasket() {
            for (var i=this.thumbnailsProducts.length-1; i>=0; i--){
                market.basket.deleteProducts(this.thumbnailsProducts[i],this.thumbnailsProducts[i].quantity);
            }
            this.thumbnailsProducts.splice(0,this.thumbnailsProducts.length);
        }
    }
    
    class Header extends DrawingZone{
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.component.add(new svg.Rect(width,height).position(width/2,height/2).color(svg.DARK_BLUE,2,svg.BLACK));
            this.component.add(new svg.Text("Digi-Market").position(100,height*0.75).font("Calibri",this.component.height*0.75,1).color(svg.WHITE));
            this.micro = new svg.Image("img/microphone-deactivated.png");
            this.component.add(this.micro);
            this.micro.position(width*0.95,height/2).dimension(height*0.9,height*0.9);
            this.height = height;
            this.width=width;
            let recording=false;
            let micro=this.micro;
            var voice=[];
            let timer;

            this.micro.onClick(function(){
                if(!recording) {
                    voice = [];
                    startRecording();
                    recording=true;
                    console.log("je record");
                    micro.url("img/microphone.gif");
                    setTimeout(function () {
                        stopRecording();
                        console.log("je record plus");
                        micro.url("img/microphone-deactivated.png");
                        let i = 0;
                        timer = setInterval(function () {
                            i++;
                            console.log(i);
                            voice = getMessage();
                            if ((voice['transcript'].length != 0 && voice['transcript'] != "Je n'ai pas compris") || i == 25) {
                                clearInterval(timer);
                                console.log(voice['transcript']);
                                if (i == 25) textToSpeech("Je n'ai rien entendu", "FR");
                                else if (voice['confidence'] > 0.5) {
                                    // console.log(voice['transcript']+" taux de confiance : "+voice['confidence']);
                                    market.vocalRecognition(voice['transcript']);
                                }
                                else {
                                    console.log("je n'ai pas bien saisi votre demande : " + voice['transcript']);
                                    textToSpeech("Je n'ai pas bien compris votre demande", "fr");

                                }
                                i = 0;
                                voice = [];
                                recording = false;
                            }
                        }, 200);
                    }, 4000);
                }
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

        dragCard(e) {
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

        showCode() {
            this.zoneCode = new SecurityCode(pageWidth,market.height-market.height/19,0,market.height/19);
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
                            if (market.payment.iteration >3) {
                                self.launchTimer(10, false);
                            }
                        }
                    }else{
                        self.moveMainpage();
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
                    if(!self.code.includes(button.value)) self.code += button.value;
                }

                //Dessin Dynamique
                if(self.onDrawing && self.code.length>0) {
                    self.buttons.remove(self.currentLine);
                    let buttonBase = self.tabButtons[parseInt(self.code.charAt(self.code.length-1))-1];
                    self.currentLine = new svg.Line(buttonBase.gapX,buttonBase.gapY,
                        e.touches[0].clientX-self.width*1.15,e.touches[0].clientY-self.height*0.2)
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

        moveMainpage(){
            market.payment.card.position(market.payment.width*0.1,market.payment.height/2);
            market.payment.cardIn=false;
            market.payment.iteration=0;
            market.remove(market.payment.zoneCode.component);
            market.pages[2].obj.smoothy(10, 40).moveTo(Math.round(-pageWidth + market.width*0.02),0);
            market.pages[1].active = true;
            market.pages[0].active = true;
            currentPage=map;
            currentIndex=1;
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
    }

    class Calendar{
        constructor(width,height,x,y){
            this.component = new svg.Translation().mark("calendar");
            this.background = new svg.Rect();
            this.title = new svg.Rect();
            this.titleText = new svg.Text("Avril");
            this.calendarFirstRow = new svg.Translation();
            this.calendarFirstColumn = new svg.Translation();
            this.calendarContent = new svg.Translation();
            this.calendarPositionY = 0;
            this.calendarCases = [];
            this.monthChoice = new svg.Translation().mark("monthChoice");
            this.chevronDown = new svg.Chevron(35,20,8,"S").color(svg.WHITE,3,svg.BLACK).opacity(0.7).mark("chevronDownCalendar");
            this.chevronUp = new svg.Chevron(35,20,8,"N").color(svg.WHITE,3,svg.BLACK).opacity(0.7).mark("chevronUpCalendar");
            this.chevronWest = new svg.Chevron(10, 40, 2, "W").color(svg.WHITE).opacity(0.5);
            this.chevronEast = new svg.Chevron(10, 40, 2, "E").color(svg.WHITE);
            this.ellipseChevronWest = new svg.Ellipse(20, 30).color(svg.BLACK).opacity(0.40);
            this.ellipseChevronEast = new svg.Ellipse(20, 30).color(svg.BLACK).opacity(0.40);
            // this.cross = new svg.Image("img/icone-supprimer.png").mark("cross");
            this.zoneChevronWest = new svg.Translation().add(this.ellipseChevronWest).add(this.chevronWest).mark("chevronWCalendar");
            this.zoneChevronEast = new svg.Translation().add(this.ellipseChevronEast).add(this.chevronEast).mark("chevronECalendar");

            this.component.add(this.background);
            this.component.add(this.title);
            this.component.add(this.titleText);
            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.monthChoice);
            this.component.add(this.chevronDown).add(this.chevronUp);
            // this.component.add(this.cross);

            this.x = x;
            this.y = y;
            this.component.move(x,y);
            this.width = width;
            this.height = height;

            let self = this;

            // this.cross.onClick(function(){
            //     market.remove(market.calendar.component);
            // });

            this.movement=0;
            this.picto = new svg.Image("img/panier.png").mark("iconUser");
            this.pictoPosX = this.width*0.15;
            this.pictoPosY = this.height*0.09;
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

            this.chevronDown.onClick(function(){
                let moveY=null;
                let place = 0;
                self.picto.position(self.pictoPosX,self.pictoPosY);
                if(self.currentDate!=0) place = self.currentDate.getDate()-1;
                if (place + self.movement + 4 <= self.numberDaysThisMonth - 10) {
                    self.movement = self.movement + 4;
                    moveY = self.caseHeight * 4;
                }
                else {
                    moveY = ((self.numberDaysThisMonth-10)-(self.movement+place)) * self.caseHeight;
                    self.movement = self.numberDaysThisMonth-10-place;
                }
                self.calendarPositionY = self.calendarPositionY - moveY;
                self.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn").moveTo(self.width * 0.6 - self.title.width / 2 - self.caseWidth / 2, self.calendarPositionY);
                self.calendarContent.smoothy(10, 10).onChannel("calendarContent").moveTo(self.width * 0.6 - self.title.width / 2 + self.caseWidth / 2, self.calendarPositionY);
                for (let i = 0; i < self.calendarCases.length; i++) {
                    self.calendarCases[i].y = self.calendarCases[i].y - moveY;
                }
            });

            this.chevronUp.onClick(function(){
                let moveY=null;
                let place = 0;
                self.picto.position(self.pictoPosX,self.pictoPosY);
                if(self.currentDate!=0) place = self.currentDate.getDate();
                if ((place + self.movement - 4 >= place)) {
                    self.movement = self.movement - 4;
                    moveY = self.caseHeight * 4;
                }
                else {
                    moveY = self.movement * self.caseHeight;
                    self.movement = 0;
                }

                self.calendarPositionY = self.calendarPositionY + moveY;
                self.calendarFirstColumn.smoothy(10, 10).onChannel("calendarColumn").moveTo(self.width * 0.6 - self.title.width / 2 - self.caseWidth / 2, self.calendarPositionY);
                self.calendarContent.smoothy(10, 10).onChannel("calendarContent").moveTo(self.width * 0.6 - self.title.width / 2 + self.caseWidth / 2, self.calendarPositionY);
                for (let i = 0; i < self.calendarCases.length; i++) {
                    self.calendarCases[i].y = self.calendarCases[i].y + moveY;
                }
            });
            this.calendarWidth = width*0.925;
            this.calendarHeight = height*0.8;

            this.date = new Date();
            this.monthNumber = this.date.getMonth();
            this.presentMonth = this.monthNumber;
            this.presentYear = this.date.getYear()+1900;
            this.month = this.getMonth()[this.monthNumber];
            this.year = this.date.getYear()+1900;
            self=this;

            this.zoneChevronEast.onClick(function(){
                self.picto.position(self.pictoPosX,self.pictoPosY);
                self.monthNumber++;
                if (self.monthNumber===12){
                    self.monthNumber=0;
                    self.year++;
                }
                self.month = self.getMonth()[self.monthNumber];
                self.changeTitleText(self.month+" "+self.year);
                self.chevronWest.opacity(1);
                self.printMonthContent(self.monthNumber,self.year);
            });

            this.zoneChevronWest.onClick(function(){
                self.picto.position(self.pictoPosX,self.pictoPosY);
                self.monthNumber--;
                if((self.presentMonth>self.monthNumber)&&(self.presentYear===self.year)){
                    self.monthNumber++;
                    self.chevronWest.opacity(0.5);
                }
                else {
                    if (self.monthNumber < 0) {
                        self.monthNumber = 11;
                        self.year--;
                    }
                    self.month = self.getMonth()[self.monthNumber];
                    self.changeTitleText(self.month + " " + self.year);
                    self.printMonthContent(self.monthNumber,self.year);
                }
                if((self.presentMonth===self.monthNumber)&&(self.presentYear===self.year)){
                    self.chevronWest.opacity(0.5);
                    self.printCurrentMonthContent();
                }
            });
        }

        placeElements(){
            this.caseWidth = this.calendarWidth/12;
            this.caseHeight = this.calendarHeight/10;
            this.picto.position(this.pictoPosX,this.pictoPosY).dimension(this.caseWidth,this.caseHeight);
            this.background.position(this.width/2,this.height/2).dimension(this.width,this.height).color(svg.ALMOST_WHITE).opacity(0.8);
            this.title.dimension(this.calendarWidth,this.calendarHeight*0.1).color(svg.LIGHT_BLUE,1,svg.BLACK).opacity(1).corners(15,15);
            this.titleText.font("calibri",this.width/45,1).position(0,this.title.height*0.25).color(svg.BLACK);
            // this.cross.position(this.width*0.07,this.height*0.75).dimension(this.caseWidth,this.caseHeight);

            this.chevronDown.position(this.width*0.02+this.caseWidth/2.5,this.height*0.97);
            this.chevronUp.position(this.width*0.02+this.caseWidth/2.5,this.title.height*1.5+this.caseHeight);
            this.chevronWest.position(-this.calendarWidth/2.1,0).mark("chevronWest");
            this.chevronEast.position(this.calendarWidth/2.1,0).mark("chevronEast");
            this.ellipseChevronWest.position(-this.calendarWidth/2.1,0).mark("ellipseChevronWest");
            this.ellipseChevronEast.position(this.calendarWidth/2.1,0).mark("ellipseChevronEast");
            this.monthChoice.add(this.title).add(this.titleText).add(this.zoneChevronEast).add(this.zoneChevronWest);
            this.monthChoice.move(this.width*0.6-this.caseWidth, this.height*0.05+this.title.height/2);


            this.printCurrentMonthContent();
        }

        printCurrentMonthContent(){
            this.component.remove(this.calendarContent);
            this.component.remove(this.calendarFirstColumn);
            this.component.remove(this.calendarFirstRow);
            this.movement=0;
            this.currentDate = new Date();
            this.changeTitleText(this.month+" "+this.year);
            let tabDays = [];
            this.numberDaysThisMonth = this.daysInMonth(this.currentDate.getMonth(),this.currentDate.getYear());

            for(let j=0;j<this.numberDaysThisMonth-this.currentDate.getDate()+1;j++){
                let dayCase = new svg.Translation();
                dayCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.ORANGE,1,svg.BLACK));
                let text = "";
                if (j ==0){
                    text = "Aujourd'hui";
                }
                else if (j ==1){
                    text = "Demain";
                }
                else{
                    text = this.getWeekDay()[(this.currentDate.getDay()+j)%7]+" "+ (this.currentDate.getDate()+j);
                }
                dayCase.add(new svg.Text(text).font("calibri", this.calendarWidth /70, 1).color(svg.BLACK));
                tabDays.push(text);
                this.calendarFirstColumn.add(dayCase);
                dayCase.move(0,j*this.caseHeight);
                this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight;
                this.calendarFirstColumn.move(this.width*0.6-this.title.width/2-this.caseWidth/2,this.calendarPositionY);
            }

            let tabHours = [];
            for (var i=0;i<12;i++){
                let hourCase = new svg.Translation();
                hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREEN,1,svg.BLACK));
                if(i!=0) {
                    hourCase.add(new svg.Text((i + 8) + "h").font("calibri", this.width / 55, 1).color(svg.BLACK));
                    tabHours.push((i + 8) + "h");
                }
                else hourCase.add(new svg.Text("Dates").font("calibri", this.width / 55, 1).color(svg.BLACK));
                hourCase.move(i*this.caseWidth,0);
                this.calendarFirstRow.add(hourCase);
                this.calendarFirstRow.move(this.width*0.6-this.title.width/2-this.caseWidth/2,this.height*0.05+this.title.height*1.5);
            }

            for(var i=0;i<this.numberDaysThisMonth-this.currentDate.getDate()+1;i++){
                let line = new svg.Translation();
                for (var j=0;j<11;j++){
                    let element = new svg.Rect(this.caseWidth,this.caseHeight).color(svg.WHITE,1,svg.BLACK).position(j*this.caseWidth,0);
                    line.add(element);
                    this.calendarCases.push({background:element,hour:tabHours[j],day:tabDays[i],
                        x:this.width*0.6-this.title.width/2+this.caseWidth/2+j*this.caseWidth,y:i*this.caseHeight+this.calendarPositionY});
                }
                line.move(0,this.caseHeight*i);
                this.calendarContent.add(line);
                this.calendarContent.move(this.width*0.6-this.title.width/2+this.caseWidth/2,this.calendarPositionY)
            }

            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.monthChoice);
            this.component.add(this.picto);
            this.component.add(this.chevronUp).add(this.chevronDown);
        }

        printMonthContent(month,year){
            this.component.remove(this.calendarContent);
            this.component.remove(this.calendarFirstColumn);
            this.component.remove(this.calendarFirstRow);

            this.movement=0;
            this.currentDate=0;
            let tabDays = [];
            this.numberDaysThisMonth=this.daysInMonth(month,year);
            this.startDay=new Date(year,month,1).getDay();

            for(let j=0;j+this.startDay<=this.numberDaysThisMonth+this.startDay;j++){
                let dayCase = new svg.Translation();
                dayCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.ORANGE,1,svg.BLACK));
                let text = this.getWeekDay()[(j+this.startDay)%7]+" "+(j+1);
                dayCase.add(new svg.Text(text).font("calibri",this.calendarWidth/70, 1).color(svg.BLACK));
                tabDays.push(text);
                this.calendarFirstColumn.add(dayCase);
                dayCase.move(0,j*this.caseHeight);
                this.calendarPositionY = this.height*0.05+this.title.height*1.5+this.caseHeight;
                this.calendarFirstColumn.move(this.width*0.6-this.title.width/2-this.caseWidth/2,this.calendarPositionY);
            }

            let tabHours = [];
            for (var i=0;i<12;i++){
                let hourCase = new svg.Translation();
                hourCase.add(new svg.Rect(this.caseWidth,this.caseHeight).color(svg.LIGHT_GREEN,1,svg.BLACK));
                if(i!=0){
                    hourCase.add(new svg.Text((i + 8) + "h").font("calibri", this.width / 55, 1).color(svg.BLACK));
                    tabHours.push((i + 8) + "h");
                }
                else hourCase.add(new svg.Text("Dates").font("calibri", this.width / 55, 1).color(svg.BLACK));
                hourCase.move(i*this.caseWidth,0);
                this.calendarFirstRow.add(hourCase);
                this.calendarFirstRow.move(this.width*0.6-this.title.width/2-this.caseWidth/2,this.height*0.05+this.title.height*1.5);
            }

            for(var i=0;i+this.startDay<=this.numberDaysThisMonth+this.startDay;i++){
                let line = new svg.Translation();
                for (var j=0;j<11;j++){
                    let element = new svg.Rect(this.caseWidth,this.caseHeight).color(svg.WHITE,1,svg.BLACK).position(j*this.caseWidth,0);
                    line.add(element);
                    this.calendarCases.push({background:element,hour:tabHours[j],day:tabDays[i],
                        x:this.width*0.6-this.title.width/2+this.caseWidth/2+j*this.caseWidth,y:i*this.caseHeight+this.calendarPositionY});
                }
                line.move(0,this.caseHeight*i);
                this.calendarContent.add(line);
                this.calendarContent.move(this.width*0.6-this.title.width/2+this.caseWidth/2,this.calendarPositionY)
            }

            this.component.add(this.calendarFirstColumn);
            this.component.add(this.calendarContent);
            this.component.add(this.calendarFirstRow);
            this.component.add(this.monthChoice);
            this.component.add(this.picto);
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
                console.log(choice.day+" "+choice.hour);
            }
            else{
                this.picto.position(this.pictoPosX,this.pictoPosY);
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

        daysInMonth(month, year) {
            return new Date(year, month+1, 0).getDate();
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

        move(x,y){
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
                self.waitingNumber = new svg.Text(number);
                self.waitingNumber.position(self.width/2,self.height*0.65).font("Calibri",self.width/1.5,1).opacity(0.7);
                self.component.add(self.waitingNumber);
            }

            function getNumber(number,e,element){
                if(number=="click") {
                    element.addAnimation("1");
                    market.basket.addProducts(self,"1");
                }
                else if(number!="?") {
                    for(var c of number.split('')){

                        if(c=="?")return;
                    }
                    element.addAnimation(number);
                    market.basket.addProducts(element, parseInt(number));
                }
            }

            let mousePos ={};
            this.drawNumber = null;
            this.component.onMouseDown(function(e){
                mousePos = {x:e.pageX,y:e.pageY};
                self.drawNumber = new svg.Drawing(0,0).mark("draw "+self.name);
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

            this.cross = new svg.Image("img/icone-supprimer.png");
            this.component.add(this.cross);

            this.component.mark(this.name);
            this.width = pageWidth*0.15;
            this.height = pageWidth*0.15;

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
            mainPage.remove(categories.rayTranslation);
        }
        categories.ray = new Ray(pageWidth * 0.85, market.height * 0.75, 0, market.height / 4, tab, name);
        categories.rayTranslation = new svg.Translation().add(categories.ray.component).mark("ray " + name);
        mainPage.add(categories.rayTranslation);
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
        market.remove(categories.rayTranslation);
        zoneCategories.remove(categories.component);
        let tab = search;
        let tabCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);
        tabCategories.push(new ThumbnailCategorie("img/search.png","img/search2.png","Recherche"));
        categories=new ListCategorie(pageWidth*0.85,market.height*0.2,0,market.height*0.05,tabCategories);
        categories.currentSearch=tab;
        zoneCategories.add(categories.component);
        market.add(zoneCategories);

        changeRay("Recherche");
    }

    market.vocalRecognition = function(message){
        message=replaceChar(message);
        if(message!="") {
            let tabMessage=message.split(" ");
            let splitMessage=[];
            for(var i = tabMessage.length-1;i>0;i--){
                if(tabMessage[i].includes("ajoute")||tabMessage[i].includes("supprime")||tabMessage[i].includes("vide")
                    ||tabMessage[i].includes("paiement")||tabMessage[i].includes("paye")){
                    splitMessage.push(message.substring(message.lastIndexOf(tabMessage[i]),message.length));
                    message = message.substring(0,message.lastIndexOf(tabMessage[i]));
                }
            }
            splitMessage.push(message);

            let oneOrderChecked =false;
            for(var j = splitMessage.length-1;j>=0;j--) {
                let order = splitMessage[j];
                let tab = search(order,"all");
                if (tab[0]) {
                    tab = search(order,"prod");
                    if (order.includes("ajoute")) {
                        for (var i = 0; i < tab.length; i++) {
                            let quantity = order[order.indexOf(tab[i].name.toLowerCase()) - 2];
                            var determining = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 4,
                                order.indexOf(tab[i].name.toLowerCase()) - 1);
                            var determining2 = order.substring(order.indexOf(tab[i].name.toLowerCase()) - 6,
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
                                market.basket.addProducts(tab[i], parseInt("" + bef2 + bef + quantity));
                            }
                            else if (determining.trim() == "de"){
                                market.basket.addProducts(tab[i],2);
                            }
                            else if (determining2.trim() == "cette" || determining.trim() =="cet") {
                                market.basket.addProducts(tab[i], 7);
                            } else {
                                market.basket.addProducts(tab[i], 1);
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
                            if (number >= "0" && number <= "9") {
                                let bef = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 3]);
                                if (isNaN(bef)) {
                                    bef = "";
                                }
                                let bef2 = parseInt(order[order.indexOf(tab[i].name.toLowerCase()) - 4]);
                                if (isNaN(bef2)) {
                                    bef2 = "";
                                }
                                market.basket.deleteFromName(tab[i].name, parseInt("" + bef2 + bef + number));
                            }
                            else if (determining == " un" || determining == "une")
                                market.basket.deleteFromName(tab[i].name, 1);
                            else if (determining.trim() =="de")
                                market.basket.deleteFromName(tab[i].name,2);
                            else if(determining2.trim() == "cette" || determining.trim() == "cet")
                                market.basket.deleteFromName(tab[i].name,7);
                            else market.basket.deleteFromName(tab[i].name, null);
                        }
                    }
                    else {
                        tab = search(order,"all");
                        doSearch(tab);
                    }
                    oneOrderChecked =true;
                }
                else {
                    if (order.includes("vide") && order.includes("panier")) {
                        market.basket.emptyBasket();
                        oneOrderChecked =true;
                    }
                    else if (order.includes("paye") || order.includes("paie")) {
                        market.payment.card.position(market.payment.width * 0.6, market.payment.height / 2);
                        market.payment.cardIn = true;
                        market.payment.showCode();
                        oneOrderChecked =true;
                    }
                }
            }

            if(!oneOrderChecked) {
                message+=", "+Date();
                writeLog(message);

                console.log("No Correct Order Given");
                textToSpeech("Je n'ai pas bien compris votre demande","fr");
            }
        }
        else {
            console.log("S'il te plait puisses-tu discuter?");
        }
    };
    function textToSpeech(msg,language){
        // msg=msg.replace(/ /g, "+");
        // msg=msg.replace(/'/g, "%27");
        // msg=msg.replace(/é/g, "%C3%A9");
        // var audio = document.createElement('audio');
        // audio.src ='http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=64&client=t-ob&q='+msg+'&tl='+language;
        // console.log(audio.play());

        var speak = new SpeechSynthesisUtterance(msg);
        window.speechSynthesis.speak(speak);
//            document.removeChild(audio);
    }


    function replaceChar(msg){
        return msg.replace(/é/g, "e").replace(/à/g,"a").replace(/è/,"e").replace(/ê/g, "e").replace(/ù/g, "u").replace(/-/g, " ").toLowerCase();
    }
    // textToSpeech("Digi-market peut parler","fr");
    //////

    /////Déclaration Interface////
    let mainPage=new svg.Translation().mark("mainPage");
    let pageWidth=market.width*0.96;

    let glassTimer = new svg.Translation();
    let header = new Header(market.width,market.height/19);
    let zoneHeader = new svg.Translation().add(header.component).mark("header");
    let tabDefaultCategories = param.data.makeVignettesForCategories(ThumbnailCategorie);
    let categories = new ListCategorie(pageWidth*0.85,market.height*0.2,0,market.height*0.05,tabDefaultCategories);
    let zoneCategories = new svg.Translation().add(categories.component).mark("categories");
    market.basket = new Basket(pageWidth*0.15,market.height*0.75,pageWidth*0.85,market.height*0.05);
    let zoneBasket = new svg.Translation().add(market.basket.component).mark("basket");
    market.payment = new Payment(pageWidth*0.15,market.height*0.20,pageWidth*0.85,market.height*0.80);
    let zonePayment = new svg.Translation().add(market.payment.component).mark("payment");
    let glassCanvas= new svg.Translation().mark("glassCanvas");
    let glassDnD = new svg.Translation().mark("Glass");

    //Gestion des pages
    market.calendar = new Calendar(market.width,market.height,0,0);
    market.calendar.placeElements();
    let calendarPage = new svg.Translation().add(market.calendar.component);

    let rectRed=new svg.Rect(market.width-market.width*0.04,market.height).color(svg.RED)
        .position(market.width/2,market.height/2+market.height/19);
    let map = new svg.Translation().add(rectRed).mark("map");

    let currentPage=mainPage;
    let currentIndex=2;
    market.pages=[];
    market.pages.push({obj:calendarPage,active:false},{obj:map,active:false},{obj:mainPage,active:true});

    for(var i =0;i<market.pages.length;i++){
        let index = i;
        market.pages[i].obj.onClick(function(){
            if(market.pages[index].active) {
                if (currentIndex > index) {
                    for (let j = currentIndex; j > index; j--) {
                        market.pages[j].obj.smoothy(10, 40).onChannel(j).moveTo(Math.round(-pageWidth + market.width * 0.02), 0);
                    }
                }
                else {
                    for (let j = currentIndex; j <= index; j++) {
                        market.pages[j].obj.smoothy(10, 40).onChannel(j).moveTo(0, 0);
                    }
                }
                currentPage = market.pages[index].obj;
                currentIndex = index;
            }
        });
        market.add(market.pages[i].obj);
    }

    market.add(mainPage);
    mainPage.add(zoneCategories).add(zoneBasket).add(zonePayment);
    market.add(glassDnD);
    mainPage.add(glassCanvas);
    market.add(zoneHeader);

    changeRay("HighTech");
    return market;
    //////////////////////////////
};