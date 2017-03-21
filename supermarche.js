exports.main = function(svg,gui,param) {

    let screenSize = svg.runtime.screenSize();
	let market = new svg.Drawing(screenSize.width,screenSize.height).show('content');
    let glassDnD = new svg.Translation().mark("Glass");

    ///////////////BANDEAUX/////////////////
	class Bandeau {
		constructor(width,height,x,y)
		{
			this.component = new svg.Drawing(width,height).position(x,y);
		}
	}

	class ListeCategorie extends Bandeau {
		constructor(width,height,x,y,tabVignettes)
		{
			super(width,height,x,y);
            
            //Rebords
            let rectangleFond = new svg.Rect(width,height).position(width/2,height/2).color(svg.BLACK);
            this.component.add(rectangleFond);

            //Rayon Actuellement Selectionné
            this.rayon = null;
            this.rayonTranslation = null;
            var self = this;

            this.tabCategories = tabVignettes;

            let listeVignette = new svg.Translation().mark("listeCategories");
            for(let i=0;i<tabVignettes.length;i++)
            {
                let current = tabVignettes[i];
                tabVignettes[i].placeElements();
                tabVignettes[i].move(height*i,0);
                listeVignette.add(tabVignettes[i].component);
               
                //GESTION SELECTION//
                tabVignettes[i].component.onClick(function(){
                    changeRay(current.name);
                });

                tabVignettes[i].component.onMouseEnter(function(){

                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
                });

                tabVignettes[i].title.onMouseEnter(function(){
                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
                });
                
                tabVignettes[i].component.onMouseOut(function(){
                    if(self.rayon==null || current.name!=self.rayon.name)
                    {
                        current.pictogramme.opacity(1);
                        current.pictogramme2.opacity(0);
                    }
                });
                /////////////////////
            }
            this.component.add(listeVignette);

            let chevronW = new svg.Chevron(20,50,3,"W").position(30,this.component.height/2).color(svg.WHITE);
            let chevronE = new svg.Chevron(20,50,3,"E").position(width-30,this.component.height/2).color(svg.WHITE);
            let elipseChevronW = new svg.Ellipse(30,40).color(svg.BLACK).opacity(0.70).position(30,this.component.height/2);
            let elipseChevronE = new svg.Ellipse(30,40).color(svg.BLACK).opacity(0.70).position(this.component.width-30,this.component.height/2);
            let zoneChevronW = new svg.Translation().add(elipseChevronW).add(chevronW).opacity(0.2).mark("chevronWCategorie");
            let zoneChevronE = new svg.Translation().add(elipseChevronE).add(chevronE).mark("chevronECategorie");
            
            zoneChevronW.onClick(function(){
                if(listeVignette.x+3*height<=0)
                {
                    if(listeVignette.x+3*height==0) 
                    {
                        zoneChevronW.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x+height*3,listeVignette.y);
                    zoneChevronE.opacity(1); 
                }
               
                else{
                    listeVignette.smoothy(10, 20).moveTo(0, listeVignette.y);
                    zoneChevronW.opacity(0.2);
                    zoneChevronE.opacity(1);
                }
            });
            
            zoneChevronE.onClick(function(){
                let widthTotal = height*tabVignettes.length;
                let widthView = width;
                let positionRight = listeVignette.x+widthTotal;
                if(positionRight-3*height>=widthView){
                    if (positionRight - 3 * height == widthView) {
                        zoneChevronE.opacity(0.2);
                    }
                    listeVignette.smoothy(10, 20).moveTo(listeVignette.x - height * 3, listeVignette.y);
                    zoneChevronW.opacity(1);
                }
                else
                {
                    listeVignette.smoothy(10,20).moveTo(widthView-widthTotal,listeVignette.y);
                    zoneChevronE.opacity(0.2);
                    zoneChevronW.opacity(1);
                }
            });

            this.component.add(zoneChevronE).add(zoneChevronW);
		}
	}
    
    class ListeRayons extends Bandeau {
        
		constructor(width,height,x,y,tabVignettesR,cat)
		{
			super(width,height,x,y);

			var self = this; // Gestion Evenements

			this.name = cat;
            let fond = new svg.Rect(width, height).position(width/2,height/2);
            fond.color(svg.LIGHT_GREY,5);
            this.component.add(fond);

            this.listeVignetteH = new svg.Translation().mark("listeRayonH");
            this.listeVignetteB = new svg.Translation().mark("listeRayonB");
            let place = 0;
            for(let i=0;i<tabVignettesR.length;i=i+2){

                tabVignettesR[i].placeElements();
                tabVignettesR[i].move(height/2*place,0);
                this.listeVignetteH.add(tabVignettesR[i].component);
                
                let currentN = tabVignettesR[i];
                currentN.pictogramme.onMouseEnter(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                });

                currentN.title.onMouseEnter(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                });

                currentN.pictogramme.onMouseOut(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-30,height/2-30);
                });

                currentN.component.onMouseDown(function(e){
                    self.dragRayon(e,currentN,1);
                });
                
                if(i+1<tabVignettesR.length)
                {
                    tabVignettesR[i+1].placeElements();
                    tabVignettesR[i+1].move(height/2*place,height/2);
                    this.listeVignetteB.add(tabVignettesR[i+1].component);
                    
                    let currentS = tabVignettesR[i+1];
                    currentS.pictogramme.onMouseEnter(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                    });

                    currentS.title.onMouseEnter(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                    });

                    currentS.pictogramme.onMouseOut(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-30,height/2-30);
                    });

                    currentS.component.onMouseDown(function(e){
                        self.dragRayon(e,currentS,0);
                    });
                }
                place++;
            }
            this.component.add(this.listeVignetteB).add(this.listeVignetteH);

            if(width<height/2*Math.ceil(tabVignettesR.length/2)) {

                let chevronW = new svg.Chevron(20, 70, 3, "W").position(30, this.component.height / 2).color(svg.WHITE);
                let chevronE = new svg.Chevron(20, 70, 3, "E").position(width - 30, this.component.height / 2).color(svg.WHITE);
                let elipseChevronW = new svg.Ellipse(30, 50).color(svg.BLACK).opacity(0.40).position(30, this.component.height / 2);
                let elipseChevronE = new svg.Ellipse(30, 50).color(svg.BLACK).opacity(0.40).position(this.component.width - 30, this.component.height / 2);
                let zoneChevronW = new svg.Translation().add(elipseChevronW).add(chevronW).opacity(0.2).mark("chevronWRayon");
                let zoneChevronE = new svg.Translation().add(elipseChevronE).add(chevronE).mark("chevronERayon");

                zoneChevronW.onClick(function () {
                    if (self.listeVignetteH.x + height*2 <= 0) {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(self.listeVignetteH.x+height,self.listeVignetteH.y);
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(self.listeVignetteB.x+height,self.listeVignetteH.y);
                        zoneChevronE.opacity(1);
                    }
                    else {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(0, self.listeVignetteH.y);
                        if (tabVignettesR.length % 2 != 0) {
                            self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(0, self.listeVignetteB.y);
                        }
                        else{
                            self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(0, self.listeVignetteB.y);
                        }
                        zoneChevronW.opacity(0.2);
                        zoneChevronE.opacity(1);
                    }
                });

                zoneChevronE.onClick(function () {
                    let widthView = width;

                    let widthTotalH = height / 2 * Math.ceil(tabVignettesR.length / 2);
                    let positionRightH = self.listeVignetteH.x + widthTotalH;
                    if (positionRightH - height*2 >= widthView) {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(self.listeVignetteH.x - height, self.listeVignetteH.y);
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(self.listeVignetteB.x - height, self.listeVignetteB.y);
                        zoneChevronW.opacity(1);
                    }
                    else {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(widthView - widthTotalH, self.listeVignetteH.y);
                        if (tabVignettesR.length % 2 != 0) {
                            self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(widthView - widthTotalH + height/2, self.listeVignetteB.y);
                        }
                        else{
                            self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(widthView - widthTotalH, self.listeVignetteB.y);
                        }
                        zoneChevronE.opacity(0.2);
                        zoneChevronW.opacity(1);
                    }
                });
                this.component.add(zoneChevronE).add(zoneChevronW);
            }
            else
            {
                let whiteComplementary = new svg.Rect(width-(height/2*Math.ceil(tabVignettesR.length/2)),height)
                    .position(height/2*Math.ceil(tabVignettesR.length/2)+(width-(height/2*Math.ceil(tabVignettesR.length/2)))/2,height/2)
                    .color(svg.WHITE);
                this.component.add(whiteComplementary);
            }
        }

        dragRayon(e,current,placement) {
            let tmp = new Vignette(current.pictogramme.src, current.name);
            tmp.placeElementsDnD(current);
            tmp.move(current.x, current.y);
            tmp.component.opacity(0.9).mark("tmp");
            if (placement === 1) {
                categories.rayon.listeVignetteH.add(tmp.component);
            } else {
                categories.rayon.listeVignetteB.add(tmp.component);
            }

            gui.installDnD(tmp, glassDnD, {
                moved: function (tmp) {
                    if ((market.width * 0.85 - e.pageX < tmp.x - current.x) && (tmp.y + tmp.height / 2 < market.height * 0.5)) {
                        panier.ajouterProduits(current);
                    }
                },
                revert: function (tmp) {
                    if (placement === 1) {
                        categories.rayon.listeVignetteH.remove(tmp.component);
                    } else {
                        categories.rayon.listeVignetteB.remove(tmp.component);
                    }
                },
                clicked: function () {
                    panier.ajouterProduits(current);
                }
            });
            svg.event(tmp.component, 'mousedown', e);
            market.add(glassDnD);
        }
    }
    
    class Panier extends Bandeau {
        constructor(width, height, x, y) {
            super(width, height, x, y);

            let contour = new svg.Rect(width, height).position(width / 2, height / 2);
            contour.color(svg.WHITE,4,svg.BLACK);
            this.component.add(contour);
            
            this.listeProduits = new svg.Translation().mark("listePanier");
            this.component.add(this.listeProduits);
            this.vignettesProduits = [];

            this.zoneTotal = new svg.Rect(width, height * 0.1).position(width / 2, height * 0.95);
            this.zoneTotal.color(svg.WHITE, 2, svg.BLACK);
            this.component.add(this.zoneTotal);

            this.total = new svg.Text("Total: ").position(width / 4, height * 0.96).font("calibri", 20, 1).color(svg.BLACK);

            this.component.add(this.total);
            this.prixTotal = 0;
            this.printPrice = new svg.Text(this.prixTotal).position(width / 2, height * 0.96).font("calibri", 20, 1).color(svg.BLACK);
            this.component.add(this.printPrice);

            let chevronH = new svg.Chevron(70, 20, 3, "N").position(this.component.width / 2, 50).color(svg.WHITE);
            let chevronB = new svg.Chevron(70, 20, 3, "S").position(this.component.width / 2, this.component.height - 100)
                .color(svg.WHITE);
            let elipseChevronH = new svg.Ellipse(40, 30).color(svg.BLACK).opacity(0.40).position(this.component.width / 2, 50);
            let elipseChevronB = new svg.Ellipse(40, 30).color(svg.BLACK).opacity(0.40)
                .position(this.component.width / 2, this.component.height - 100);
            this.zoneChevronH = new svg.Translation().add(elipseChevronH).add(chevronH).opacity(0).mark("chevronHBasket");
            this.zoneChevronB = new svg.Translation().add(elipseChevronB).add(chevronB).opacity(0).mark("chevronBBasket");

            let chevB = this.zoneChevronB;
            let chevH = this.zoneChevronH;
            let zone = this.listeProduits;
            let tab = this.vignettesProduits;

            this.zoneChevronH.onClick(function() {
                if ((zone.y + height / 2) < 0) {
                    chevB.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,zone.y+height/2);
                }
                else {
                    chevB.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,contour.y-height/2+2);
                    chevH.opacity(0);
                }
            });

            this.zoneChevronB.onClick(function () {
                let heightZone = tab.length * tab[0].height;
                let positionDown = zone.y + heightZone;
                if (chevB._opacity!=0) {
                    if (positionDown - height / 2 > contour.y + height / 2) {
                        chevH.opacity(0.5);
                        zone.smoothy(10, 20).moveTo(zone.x, zone.y - height / 2 + 2);
                    }
                    else {
                        chevH.opacity(0.5);
                        zone.smoothy(10, 20).moveTo(zone.x, contour.y + (contour.height * 0.4) - heightZone + 2);
                        chevB.opacity(0);
                    }
                }
            });
            this.component.add(this.zoneChevronH).add(this.zoneChevronB);
        }

        calculerPrix(prix) {
            this.prixTotal = this.prixTotal + prix;
            this.component.remove(this.printPrice);
            this.component.remove(this.total);
            if(this.prixTotal>10000){
                this.printPrice = new svg.Text(this.prixTotal.toFixed(2) + " €").position(this.component.width * 0.65, this.zoneTotal.y + 10)
                    .font("calibri", 25, 1).color(svg.BLACK).mark("bigPrice");
                this.total = new svg.Text("TOTAL").position(this.component.width / 5, this.zoneTotal.y + 10)
                    .font("calibri", 25, 1).color(svg.BLACK);
            }
            else{
                this.printPrice = new svg.Text(this.prixTotal.toFixed(2) + " €").position(this.component.width * 0.75, this.zoneTotal.y + 10)
                    .font("calibri", 30, 1).color(svg.BLACK).mark("Price");
                this.total = new svg.Text("TOTAL").position(this.component.width / 4, this.zoneTotal.y + 10)
                    .font("calibri", 30, 1).color(svg.BLACK);
            }
            this.component.add(this.total);
            this.component.add(this.printPrice);
        }

        ajouterProduits(vignette) {

            let newProd = new VignettePanier(vignette.pictogramme.src, vignette.name, vignette.price, vignette.complement, vignette.categorie);
            let occur=0;
            let self =this;

            if (this.vignettesProduits.length > 0) {

                for (let product of this.vignettesProduits) {
                    if (product.name == vignette.name) {
                        // alert("ok");
                        product.addQuantity(1);
                        let newText=product.quantity + "x " + product.price + " €"+product.complement;
                        product.changeText(newText);
                        occur=1;
                    }
                }
                if (occur==0){
                    // alert('pas OK');
                    newProd.addQuantity(1);
                    this.listeProduits.add(newProd.component);
                    this.vignettesProduits.push(newProd);
                }
            }
            else{
                newProd.addQuantity(1);
                this.listeProduits.add(newProd.component);
                this.vignettesProduits.push(newProd);
            }

            newProd.component.onMouseDown(function(e){
                self.dragBasket(e,newProd);
            });

            this.calculerPrix(newProd.price);

            if (this.vignettesProduits.length < 2 && occur==0) {
                newProd.placeElements();
                newProd.move(0,0);
            }
            else {
                if(occur==0){
                    if(this.vignettesProduits.length>2)
                    {
                        this.zoneChevronB.opacity(0.5);
                    }
                    let ref = this.vignettesProduits[this.vignettesProduits.length-2];
                    newProd.placeElements();
                    newProd.move(0,ref.y+ref.height);
                }
            }
        }

        supprimerProduit(vignette,numberProduct){
            let width = this.component.width;
            let height = this.component.height;
            let chevB = this.zoneChevronB;
            let chevH = this.zoneChevronH;

            vignette.minusQuantity(numberProduct);
            let newText = vignette.quantity + " x " + vignette.price + " €" + vignette.complement;
            vignette.changeText(newText);

            if(vignette.quantity ==0){
                if (this.vignettesProduits.indexOf(vignette)==this.vignettesProduits.length-1 &&this.vignettesProduits.length-1>2){
                    let heightZone=this.vignettesProduits.length * this.vignettesProduits[0].height;
                    this.listeProduits.smoothy(10, 20).moveTo(this.listeProduits.x,(height*0.9-heightZone+this.vignettesProduits[0].height ));
                }else if(this.vignettesProduits.length-1<=2){
                    this.listeProduits.smoothy(10, 20).moveTo(this.listeProduits.x, 0);
                    chevB.opacity(0);
                    chevH.opacity(0);
                }
                this.listeProduits.remove(vignette.component);
                this.vignettesProduits.splice(this.vignettesProduits.indexOf(vignette), 1);
                this.calculerPrix(-((vignette.price)*numberProduct));
                for (let product of this.vignettesProduits) {
                    product.placeElements();
                    product.move(0,this.vignettesProduits.indexOf(product)*(product.height));
                }
            }else {
                this.calculerPrix(-((vignette.price)*numberProduct));
            }
        }

        dragBasket(e,current) {
            let tmp = new Vignette(current.pictogramme.src,current.name);
            tmp.placeElementsDnD(current);
            tmp.cross = new svg.Cross(10, 10, 2).color(svg.RED, 2, svg.RED).opacity(1).mark("cross");
            tmp.cross.smoothy(1,1).rotateTo(-45);
            tmp.cross.position(tmp.width*0.55,tmp.height*0.71).opacity(1);
            tmp.component.add(tmp.cross);
            tmp.cross.onMouseUp(function(){
                panier.supprimerProduit(current,current.quantity);
            });

            tmp.move(current.x,current.y);
            tmp.component.opacity(0.9).mark("tmp");
            panier.listeProduits.add(tmp.component);

            gui.installDnD(tmp,glassDnD,{
                moved:
                    function(tmp){
                        if((tmp.x+tmp.width/2<0)&&(tmp.y+tmp.height/2>market.height*0.20)){
                            panier.supprimerProduit(current, 1);
                            changeRay(current.categorie);
                        }
                    },
                revert:
                    function(tmp){
                        panier.listeProduits.remove(tmp.component);
                    },
                clicked :
                    function(){
                        changeRay(current.categorie);
                    }
            });
            svg.event(tmp.component, 'mousedown', e);
            market.add(glassDnD);
        }
    }
    
    class Header extends Bandeau{
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.component.add(new svg.Rect(width,height).position(width/2,height/2).color(svg.DARK_BLUE,2,svg.BLACK));
            this.component.add(new svg.Text("Supermarché Virtuel").position(100,height/2+5).font("Calibri",20,1).color(svg.WHITE));
        }
    }
    
    class Payement extends Bandeau
    {
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.fond = new svg.Rect(width,height).position(width/2,height/2).color(svg.WHITE,2,svg.BLACK);
            this.card = new svg.Image("img/Carte-Visa-Classic.png").dimension(width/2,height/3).position(width*0.75,height/2).mark("card");
            this.tpeFond = new svg.Image("img/tpeFond.png").dimension(width/2,height*0.75).position(width*0.3,height/2);
            this.tpe = new svg.Image("img/tpe.png").dimension(width/2,height*0.75).position(width*0.3,height/2);
            this.glassDnd = new svg.Translation();

            this.width = width;
            this.height = height;
            this.cardIn = false;

            this.component.add(this.fond);
            this.component.add(this.tpeFond);
            this.component.add(this.card);
            this.component.add(this.glassDnd);
            this.component.add(this.tpe);

            let self = this;
            this.card.onMouseDown(function(e){
                self.dragCard(e);
            });
        }

        dragCard(e)
        {
            let tmp = new Object();
            let self = this;

            tmp.x = 0;
            tmp.events = [];
            tmp.addEvent = function(eventName, handler) {
                svg.addEvent(this.component, eventName, handler);
                this.events[eventName] = handler;
                return this;
            };
            tmp.move = function(x){
                this.x = x;
                this.component.move(x,0);
                if((this.x<-(self.width*0.1))&&(self.cardIn==false))
                {
                    svg.event(tmp.component, 'mouseup', e);
                    self.card.position(self.width*0.50,self.height/2);
                    self.cardIn=true;
                    self.showCode();
                }
                else if((this.x>(self.width*0.1))&&(self.cardIn==true))
                {
                    svg.event(tmp.component, 'mouseup', e);
                    self.card.position(self.width*0.75,self.height/2);
                    self.cardIn=false;
                }
            };

            tmp.removeEvent = function(eventName){
                svg.removeEvent(this.component, eventName);
                delete this.events[eventName];
                return this;
            };

            tmp.component = new svg.Translation();
            tmp.component.add(new svg.Image(this.card.src).dimension(this.width/2,this.height/3).position(this.card.x,this.card.y));

            this.component.add(tmp.component);
            this.card.opacity(0);

            this.component.add(this.glassDnd);
            this.component.add(this.tpe);

            gui.installDnD(tmp,this.glassDnd,{
                moved:
                    function(tmp){
                        self.card.opacity(1);
                    },
                revert:
                    function(tmp){
                        self.component.remove(tmp.component);
                    },
                clicked :
                    function(tmp){
                        self.card.opacity(1);
                    }
            });
            svg.event(tmp.component, 'mousedown', e);
        }

        showCode()
        {

        }

    }
    ///////////////////////////////////////
    
    ////////////VIGNETTES//////////////////
	class Vignette {
        constructor(image,title)
        {
            this.component = new svg.Translation();
            this.pictogramme = new svg.Image(image);
            this.name = title;
            this.title = new svg.Text(title);
            this.fond = new svg.Rect().color(svg.WHITE);
            this.component.add(this.fond);
            this.component.add(this.pictogramme);
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
            this.pictogramme.position(this.width/2-2,this.height/2-2).dimension(this.width-30,this.height-30);
            this.title      .position(this.width/2,this.height*0.1).font("Calibri",15,1).color(svg.BLACK);
            this.fond       .position(this.width/2,this.height/2).dimension(this.width,this.height);
        }
	}

	class VignetteCategorie extends Vignette {
        constructor(image,image2,title){
            super(image,title);
            this.pictogramme2 = new svg.Image(image2);
            this.pictogramme2.opacity(0);
            this.pictogramme.opacity(1);
            this.component.add(this.pictogramme2);
            this.component.add(this.title);
            this.name = title;

            this.width = (market.height/5)-4;
            this.height = (market.height/5)-4;
		}

		placeElements()
        {
            this.pictogramme.position(this.width/2,this.height/2+2).dimension(this.width,this.height).mark(this.name);
            this.pictogramme2.position(this.width/2,this.height/2+2).dimension(this.width,this.height).mark(this.name+"2");
            this.title.position(this.height/2,this.height*0.93).font("Calibri",15,1).color(svg.WHITE).mark(this.name + " title");
        }
	}

	class VignetteRayon extends Vignette {
        constructor(image,title,price,complement,cat)
        {
            super(image,title);
            this.component.add(this.pictogramme);
            this.component.add(this.title);
            this.price = price;
            this.complement = complement;
            this.printPrice = new svg.Text(price + " €" + complement);
            this.component.add(this.printPrice);
            this.categorie=cat;
            this.name = title;

            this.width = market.height*0.75/2;
            this.height = market.height*0.75/2;
        }

        placeElements() {
            this.component.mark("Produit " + this.name);
            this.pictogramme.position(this.width/2,this.height/2).dimension(this.height-30,this.height-30).mark("Image " + this.name);
            this.fond       .position(this.width/2,this.height/2).dimension(this.height-2,this.height-2);
            this.title      .position(this.width/2,this.height*0.1) .font("Calibri",15,1).color(svg.BLACK).mark("Title "+this.name);
            this.printPrice .position(this.width/2,this.height*0.95).font("Calibri",15,1).color(svg.BLACK);
        }
	}
    
    class VignettePanier extends VignetteRayon{
        constructor(image,title,price,complement,cat){
            super(image,title,price,complement,cat);
            this.quantity = 0;
            this.name = title;
            this.line = new svg.Line(0,0,0,0);
            this.component.add(this.line);

            this.cross = new svg.Cross(10, 10, 2).color(svg.RED, 2, svg.RED).opacity(0);
            this.component.add(this.cross);

            this.component.mark(this.name);
            this.width = market.width*0.15;
            this.height = market.width*0.15;

            let self = this;
            this.pictogramme.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.title.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.cross.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.fond.onMouseEnter(function(){
                self.cross.opacity(1);
            });

            this.component.onMouseOut(function(){
                self.cross.opacity(0);
            });
        }

        addQuantity(num){
            this.quantity = this.quantity+num;
        }
        minusQuantity(num){
            this.quantity = this.quantity-num;
        }
        changeText(newText){
            this.component.remove(this.printPrice);
            this.printPrice = new svg.Text(newText);
            this.printPrice.position(this.width/2,this.height*0.92).font("Calibri",15,1).color(svg.BLACK);
            this.component.add(this.printPrice);
        }

        placeElements() {
            this.component.mark("Produit panier " + this.name);
            this.pictogramme.position(this.width/2,this.height/2).dimension(this.width*0.90,this.height*0.90).mark(this.name);
            this.printPrice.position(this.width/2,this.height*0.92).font("Calibri",15,1).color(svg.BLACK);
            this.title.position(this.width/2,this.height*0.10).mark("title "+this.name);
            this.fond.position(this.width/2,this.height/2).dimension(this.width-6,this.height-4).mark("fond "+this.name);
            this.line.start(0,this.height).end(this.width,this.height).color(svg.BLACK,2,svg.BLACK);
            this.cross.position(this.width*0.55,this.height*0.71).mark("cross "+this.name);
            this.cross.smoothy(1,1).rotateTo(-45);
        }
    }
    //////////////////////////////////////
    
    //TEST CREATION TABLEAU VIGNETTE//
    let vignettes = [
        new VignetteCategorie("img/categories/produits-laitiers.jpg","img/categories/produits-laitiers2.jpg", "Produits laitiers"),
        new VignetteCategorie("img/categories/legumes.jpg","img/categories/legumes2.jpg", "Légumes"),
        new VignetteCategorie("img/categories/fruits.jpg","img/categories/fruits2.jpg", "Fruits"),
        new VignetteCategorie("img/categories/electromenager.jpg","img/categories/electromenager2.jpg", "Electromenager"),
        new VignetteCategorie("img/categories/voyages.jpg","img/categories/voyages2.jpg", "Voyages"),
        new VignetteCategorie("img/categories/hightech.jpg","img/categories/hightech2.jpg", "HighTech"),
        new VignetteCategorie("img/categories/boissons.jpg","img/categories/boissons2.jpg", "Boissons"),
        new VignetteCategorie("img/categories/soinsducorps.jpg","img/categories/soinsducorps2.jpg", "Soins du corps"),
        new VignetteCategorie("img/categories/mode.jpg","img/categories/mode2.jpg", "Mode"),
        new VignetteCategorie("img/categories/mobilier.jpg","img/categories/mobilier2.jpg", "Mobilier"),
        new VignetteCategorie("img/categories/superpouvoir.jpg","img/categories/superpouvoir2.jpg", "Super Pouvoirs"),
    ];

    /////////// MANAGE JSON
    // Make vignettes tab for a category
    function makeVignettesForRay(catTitle){
        var tabVignettes = [];
        // mettre le tableau de product dans une variable
        var cat = param.jsonData[catTitle];
        //pour chaque produit dans categorie,
        for (var product in cat){
            //mettre la valeur de img dans une var
            var data = cat[product];
            //construire une vignette
            var vignetteProduct = new VignetteRayon(data.image, data.nom, data.prix,data.complement, catTitle);
            //ajouter la vignette au tableau
            tabVignettes.push(vignetteProduct);
        }
        return tabVignettes;
    }

    function makeVignettesForCategories(){

    }

    ///Functions///

    function changeRay(name)
    {
        let tab =  makeVignettesForRay(name);
        if(categories.rayonTranslation!=null)
        {
            market.remove(categories.rayonTranslation);
        }
        categories.rayon = new ListeRayons(market.width * 0.85, market.height * 0.75, 0, market.height / 4, tab, name);
        categories.rayonTranslation = new svg.Translation().add(categories.rayon.component).mark("Rayon " + name);
        market.add(categories.rayonTranslation);

        for(let v=0;v<categories.tabCategories.length;v++)
        {
            categories.tabCategories[v].pictogramme.opacity(1);
            categories.tabCategories[v].pictogramme2.opacity(0);
            if(categories.tabCategories[v].name==name)
            {
                categories.tabCategories[v].pictogramme.opacity(0);
                categories.tabCategories[v].pictogramme2.opacity(1);
            }
        }
    }
    //////

    /////Déclaration Interface////
    let header = new Header(market.width,market.height/19);
    let zoneHeader = new svg.Translation().add(header.component).mark("header");
    let categories = new ListeCategorie(market.width*0.85,market.height*0.2,0,market.height*0.05,vignettes);
    let zoneCategories = new svg.Translation().add(categories.component).mark("categories");
    let panier = new Panier(market.width*0.15,market.height*0.75,market.width*0.85,market.height*0.05);
    let zonePanier = new svg.Translation().add(panier.component).mark("basket");
    let payement = new Payement(market.width*0.15,market.height*0.20,market.width*0.85,market.height*0.80);
    let zonePayement = new svg.Translation().add(payement.component).mark("payment");

    market.add(zoneCategories).add(zonePanier).add(zonePayement).add(zoneHeader);
    market.add(glassDnD);

    return market;
	//////////////////////////////
};