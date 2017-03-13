exports.main = function(svg,param) {

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
                tabVignettes[i].pictogramme.position(height/2+height*i,height/2).dimension(height-4,height-4).mark(current.name);
                tabVignettes[i].pictogramme2.position(height/2+height*i,height/2).dimension(height-4,height-4).mark(current.name+"2");
                tabVignettes[i].title.position(height/2+i*height,height*0.93).font("Calibri",15,1).color(svg.WHITE).mark(current.name + " title");
                listeVignette.add(tabVignettes[i].component);
               
                //GESTION SELECTION//
                tabVignettes[i].component.onClick(function(){
                    let tab =  makeVignettesForCategory(current.name);
                    if(self.rayonTranslation!=null)
                    {
                        market.remove(self.rayonTranslation);
                    }
                    self.rayon = new ListeRayons(market.width*0.85,market.height*0.75,0,market.height/4,tab,current.name);
                    self.rayonTranslation = new svg.Translation().add(self.rayon.component).mark("Rayon " + current.name);
                    market.add(self.rayonTranslation);


                    for(let v=0;v<tabVignettes.length;v++)
                    {
                        tabVignettes[v].pictogramme.opacity(1);
                        tabVignettes[v].pictogramme2.opacity(0);
                    }
                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
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

                tabVignettesR[i].fond        .position(height/4+height/2*place,height/4)        .dimension(height/2-2,height/2-2);
                tabVignettesR[i].pictogramme .position(height/4+height/2*place,height/4)        .dimension(height/2-30,height/2-30).mark("Produit"+i);
                tabVignettesR[i].title       .position(height/4+height/2*place,height/2*0.1)    .font("Calibri",15,1).color(svg.BLACK).mark("Title"+i);
                tabVignettesR[i].printPrice  .position(height/4+height/2*place,height/2*0.95)   .font("Calibri",15,1).color(svg.BLACK);
                tabVignettesR[i].component.mark("Produit "+i);
                this.listeVignetteH.add(tabVignettesR[i].component);
                
                let currentN = tabVignettesR[i];
                currentN.component.onMouseEnter(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                });

                currentN.title.onMouseEnter(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                });

                currentN.component.onMouseOut(function()
                {
                    currentN.pictogramme.smoothy(20,10).resizeTo(height/2-30,height/2-30);
                });

                currentN.component.onClick(function(){
                    panier.ajouterProduits(currentN);
                });

                currentN.component.onMouseDown(function(e){
                    dragRayon(e,currentN)
                });
                
                if(i+1<tabVignettesR.length)
                {
                    tabVignettesR[i+1].fond.dimension(height/2-2,height/2-2).position(height/4+height/2*place,3*height/4).color(svg.WHITE);
                    tabVignettesR[i+1].pictogramme   .position(height/4+height/2*place,3*height/4)
                                                     .dimension(height/2-30,height/2-30).mark("Produit"+(i+1));
                    tabVignettesR[i+1].title         .position(height/4+height/2*place,height/2*1.1)  .font("Calibri",15,1).color(svg.BLACK).mark("Title" +(i+1));
                    tabVignettesR[i+1].printPrice    .position(height/4+height/2*place,height/2*1.95) .font("Calibri",15,1).color(svg.BLACK);
                    tabVignettesR[i+1].component.mark("Produit "+(i+1));
                    this.listeVignetteB.add(tabVignettesR[i+1].component);
                    
                    let currentS = tabVignettesR[i+1];
                    currentS.component.onMouseEnter(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                    });

                    currentS.title.onMouseEnter(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-2,height/2-2);// modif dans svgTranslation
                    });

                    currentS.component.onMouseOut(function()
                    {
                        currentS.pictogramme.smoothy(20,10).resizeTo(height/2-30,height/2-30);
                    });
                  
                    /*currentS.component.onClick(function(){
                        panier.ajouterProduits( currentS);
                    });*/

                    currentS.component.onMouseDown(function(e){
                        dragRayon(e,currentS)
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

                zoneChevronW.onClick(function () {
                    if (self.listeVignetteH.x + height+height/2 <= 0) {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(self.listeVignetteH.x+height,self.listeVignetteH.y);
                        zoneChevronE.opacity(1);
                    }
                    else {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(0, self.listeVignetteH.y);
                        zoneChevronW.opacity(0.2);
                        zoneChevronE.opacity(1);
                    }

                    if (self.listeVignetteB.x + height+height/2 <= 0) {
                        if (self.listeVignetteB.x + height == 0) {
                            zoneChevronW.opacity(0.2);
                        }
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(self.listeVignetteB.x + height, self.listeVignetteB.y);
                        zoneChevronE.opacity(1);
                    }
                    else {
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(0, self.listeVignetteB.y);
                        zoneChevronW.opacity(0.2);
                        zoneChevronE.opacity(1);
                    }
                });

                zoneChevronE.onClick(function () {
                    let widthView = width;

                    let widthTotalH = height / 2 * Math.ceil(tabVignettesR.length / 2);
                    let positionRightH = self.listeVignetteH.x + widthTotalH;
                    if (positionRightH - height-height/2 >= widthView) {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(self.listeVignetteH.x - height, self.listeVignetteH.y);
                        zoneChevronW.opacity(1);
                        console.log(1);

                    }
                    else {
                        self.listeVignetteH.smoothy(10, 20).onChannel("rayonHaut").moveTo(widthView - widthTotalH, self.listeVignetteH.y);
                        zoneChevronE.opacity(0.2);
                        zoneChevronW.opacity(1);
                        console.log(11);

                    }

                    let widthTotalB = null;
                    if (tabVignettesR.length % 2 != 0) widthTotalB = widthTotalH - height / 2;
                    else widthTotalB = widthTotalH;
                    console.log(self.listeVignetteB.x+" "+self.listeVignetteH.x+" "+widthTotalB+" "+widthTotalH);
                    let positionRightB = self.listeVignetteB.x + widthTotalB;
                    if (positionRightB - height-height/2 >= widthView) {
                        if (positionRightB - height == widthView) {
                            zoneChevronE.opacity(0.2);
                        }
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(self.listeVignetteB.x - height, self.listeVignetteB.y);
                        zoneChevronW.opacity(1);
                        console.log(2);
                    }

                    else {
                        self.listeVignetteB.smoothy(10, 20).onChannel("rayonBas").moveTo(widthView - widthTotalB, self.listeVignetteB.y);
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
         
    }
    
    class Panier extends Bandeau {
        constructor(width, height, x, y) {
            super(width, height, x, y);

            let contour = new svg.Rect(width, height).position(width / 2, height / 2);
            contour.color(svg.WHITE, 2, svg.BLACK);
            this.component.add(contour);
            
            this.listeProduits = new svg.Translation().mark("listePanier");
            this.component.add(this.listeProduits);
            this.VignettesProduits = [];

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
            let tab = this.VignettesProduits;
            let pPrice = this.printPrice;

            this.zoneChevronH.onClick(function() {
                if ((zone.y + height / 2) < 0) {
                    chevB.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,zone.y+height/2);
                }
                else {
                    chevB.opacity(0.5);
                    zone.smoothy(10,20).moveTo(zone.x,contour.y-height/2);
                    chevH.opacity(0);
                }
            });

            this.zoneChevronB.onClick(function () {
                let heightZone = tab.length * tab[0].pictogramme.height;
                let positionDown = zone.y + heightZone;

                if(positionDown-height/2>contour.y+height/2)
                {
                    chevH.opacity(0.5);
                    zone.smoothy(10, 20).moveTo(zone.x, zone.y - height / 2);
                }
                else {
                    chevH.opacity(0.5);
                    zone.smoothy(10, 20).moveTo(zone.x, contour.y + (contour.height * 0.80) / 2 - heightZone);
                    chevB.opacity(0);
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

            newProd.pictogramme.mark(vignette.name);
            let width = this.component.width;

            let occur=0;

            if (this.VignettesProduits.length > 0) {

                for (let product of this.VignettesProduits) {
                    if (product.name == vignette.name) {
                        // alert("ok");
                        product.addQuantity(1);
                        let newText=product.quantity + "x " + product.price + " €"+product.complement;
                        product.changeText(newText);
                        product.printPrice.position(width/2,product.pictogramme.y - product.pictogramme.height/2 +product.pictogramme.height * 0.92);
                        occur=1;
                        // this.calculerPrix(newProd.price);
                    }
                }
                if (occur==0){
                    // alert('pas OK');
                    newProd.addQuantity(1);
                    this.listeProduits.add(newProd.component);
                    this.VignettesProduits.push(newProd);
                    newProd.pictogramme.dimension(width * 0.98, width * 0.98);
                }
            }
            else{
                newProd.addQuantity(1);
                this.listeProduits.add(newProd.component);
                this.VignettesProduits.push(newProd);
                newProd.pictogramme.dimension(width * 0.98, width * 0.98);
            }

            newProd.pictogramme.onClick(function () {

                let tab =  makeVignettesForCategory(newProd.categorie);
                market.remove(categories.rayonTranslation);
                categories.rayon = new ListeRayons(market.width * 0.85, market.height * 0.75, 0, market.height / 4, tab, newProd.categorie);
                categories.rayonTranslation = new svg.Translation().add(categories.rayon.component).mark("Rayon " + newProd.categorie);
                market.add(categories.rayonTranslation);

                for(let v=0;v<categories.tabCategories.length;v++)
                {
                    categories.tabCategories[v].pictogramme.opacity(1);
                    categories.tabCategories[v].pictogramme2.opacity(0);
                    if(categories.tabCategories[v].name==newProd.categorie)
                    {
                        categories.tabCategories[v].pictogramme.opacity(0);
                        categories.tabCategories[v].pictogramme2.opacity(1);
                    }
                }
            });

            this.calculerPrix(newProd.price);

            if (this.VignettesProduits.length < 2 && occur==0) {
                newProd.pictogramme.position(width / 2, width / 2);
                newProd.title.position(width / 2, newProd.pictogramme.height * 0.10);
                newProd.printPrice.position(width / 2, newProd.pictogramme.height * 0.92);
                let blackline = new svg.Line(0, newProd.pictogramme.height-1, width, newProd.pictogramme.height-1)
                    .color(svg.BLACK, 2, svg.BLACK);
                this.listeProduits.add(blackline);
            }
            else {
                if(occur==0){
                    if(this.VignettesProduits.length > 2) this.zoneChevronB.opacity(0.5);
                    let ref = this.VignettesProduits[this.VignettesProduits.length - 2];
                    newProd.pictogramme.position(width / 2, ref.pictogramme.y + ref.pictogramme.height);
                    newProd.title.position(width / 2, ref.title.y + ref.pictogramme.height);
                    newProd.printPrice.position(width / 2, ref.printPrice.y + ref.pictogramme.height);
                    this.listeProduits.add(new svg.Line(0, newProd.pictogramme.y + newProd.pictogramme.height / 2-1,
                        width, newProd.pictogramme.y + newProd.pictogramme.height / 2-1).color(svg.BLACK, 2, svg.BLACK));
                }
            }
        }
    }
    
    class Header extends Bandeau{
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.component.add(new svg.Rect(width,height).position(width/2,height/2).color(svg.DARK_BLUE));
            this.component.add(new svg.Text("Supermarché Virtuel").position(100,height/2+5).font("Calibri",20,1).color(svg.WHITE));
        }
    }
    
    class Payement extends Bandeau
    {
        constructor(width,height,x,y)
        {
            super(width,height,x,y);
            this.component.add(new svg.Rect(width,height).position(width/2,height/2).color(svg.DARK_BLUE)); 
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
        }
	}
    
    class VignettePanier extends VignetteRayon{
        constructor(image,title,price,complement,cat){
            super(image,title,price,complement,cat);
            this.quantity = 0;
            this.name = title;
        }

        addQuantity(num){
            this.quantity = this.quantity+num;
        }
        /*minusQuantity(num){
            this.quantity = this.quantity-num;
        }*/
        changeText(newText){
            this.component.remove(this.printPrice);
            this.printPrice = new svg.Text(newText);
            this.component.add(this.printPrice);
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

    ///Functions///

    /////////// MANAGE JSON
    // Make vignettes tab for a category
    function makeVignettesForCategory(catTitle){
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

    ///Functions///
    function dragRayon(e,current) {
        market.add(glassDnD);
        let tmp = new Vignette(current.pictogramme.src,current.name);
        tmp.pictogramme.position(current.pictogramme.x+categories.rayon.listeVignetteH.x,current.pictogramme.y+categories.rayon.listeVignetteH.y+market.height/4)
            .dimension(current.pictogramme.width,current.pictogramme.height);
        tmp.title.position(current.title.x,current.title.y+market.height/4).font("Calibri",15,1).color(svg.BLACK);
        tmp.fond.position(current.pictogramme.x+categories.rayon.listeVignetteH.x,current.pictogramme.y+categories.rayon.listeVignetteH.y+market.height/4)
            .dimension(current.fond.height,current.fond.width);
        tmp.component.mark("GlassVignette");

        glassDnD.add(tmp.component);
        let clickx=e.pageX;
        let clicky=e.pageY;

        tmp.component.onMouseMove(function(e){
            tmp.pictogramme.position(e.pageX,e.pageY);
            tmp.title.position(e.pageX,e.pageY-tmp.pictogramme.height*0.4);
            tmp.fond.position(e.pageX,e.pageY);

        });

        tmp.component.onMouseUp(function(e){
            let upx=e.pageX;
            let upy=e.pageY;
            if((tmp.pictogramme.x>market.width*0.85)&&(tmp.pictogramme.y<market.height*0.80))
            {
                panier.ajouterProduits(current);
            }
            else if(clickx==upx && clicky==upy){
                panier.ajouterProduits(current);
            }

            glassDnD.remove(tmp.component);
            market.remove(glassDnD);
        });

        //gui.installDnD(current.component,glassDnD,{StartInDragMode:true});
    }
    //////

    /////Déclaration Interface////
    let header = new Header(market.width,market.height/20,0,0);
    let zoneHeader = new svg.Translation().add(header.component).mark("header");
    let categories = new ListeCategorie(market.width*0.85,market.height/5,0,market.height/20,vignettes);
    let zoneCategories = new svg.Translation().add(categories.component).mark("categories");
    let panier = new Panier(market.width*0.15,market.height*0.75,market.width*0.85,market.height/20);
    let zonePanier = new svg.Translation().add(panier.component).mark("basket");
    let payement = new Payement(market.width*0.15,market.height*0.20,market.width*0.85,market.height*0.80);
    let zonePayement = new svg.Translation().add(payement.component);

    market.add(zoneHeader).add(zoneCategories).add(zonePanier).add(zonePayement);

    return market;
	//////////////////////////////
};