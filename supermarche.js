exports.main = function(svg, param) {

    let screenSize = svg.runtime.screenSize();
	let market = new svg.Drawing(screenSize.width,screenSize.height).show("content"); //Ecran Total

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
                    let tab =null;
                    switch(current.name)
                    {
                        case "Fruits" : tab = vignettesFruits;
                                        break;
                        case "Légumes": tab = vignettesLegumes;
                                        break;
                        default : break;
                    }

                    if(tab!=null)
                    {
                        if(self.rayonTranslation!=null)
                        {
                            market.remove(self.rayonTranslation);
                        }
                        self.rayon = new ListeRayons(market.width*0.85,market.height*0.75,0,market.height/4,tab,current.name);
                        self.rayonTranslation = new svg.Translation().add(self.rayon.component).mark("Rayon " + current.name);
                        market.add(self.rayonTranslation);
                    }
                    
                    for(let v=0;v<tabVignettes.length;v++)
                    {
                        tabVignettes[v].pictogramme.opacity(1);
                        tabVignettes[v].pictogramme2.opacity(0);
                    }
                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
                });
                
                tabVignettes[i].pictogramme.onMouseEnter(function(){
                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
                });
                
                tabVignettes[i].title.onMouseEnter(function(){
                    current.pictogramme.opacity(0);
                    current.pictogramme2.opacity(1);
                });
                
                tabVignettes[i].pictogramme.onMouseOut(function(){
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
			this.name = cat;
            let fond = new svg.Rect(width, height).position(width/2,height/2);
            fond.color(svg.LIGHT_GREY,5);
            this.component.add(fond);

            let listeVignette = new svg.Translation().mark("listeRayon");
            let place = 0;
            for(let i=0;i<tabVignettesR.length;i=i+2){

                let fondVignette = new svg.Rect(height/2-2,height/2-2).position(height/4+height/2*place,height/4).color(svg.WHITE);
                listeVignette.add(fondVignette);

                tabVignettesR[i].pictogramme .position(height/4+height/2*place,height/4)        .dimension(height/2-30,height/2-30).mark("Produit"+i);
                tabVignettesR[i].title       .position(height/4+height/2*place,height/2*0.1)    .font("Calibri",15,1).color(svg.BLACK);
                tabVignettesR[i].printPrice  .position(height/4+height/2*place,height/2*0.95)   .font("Calibri",15,1).color(svg.BLACK);
                tabVignettesR[i].component.mark("Produit "+i);
                listeVignette.add(tabVignettesR[i].component);

                
                let currentN = tabVignettesR[i];
                currentN.component.onMouseEnter(function()
                {
                    currentN.pictogramme.dimension(height/2-2,height/2-2);
                });
               
                currentN.component.onMouseOut(function()
                {
                    currentN.pictogramme.dimension(height/2-30,height/2-30);
                });
                
                currentN.component.onClick(function(){
                    panier.ajouterProduits(currentN);
                });
                
                if(i+1<tabVignettesR.length)
                {
                    let fondVignetteBas = new svg.Rect(height/2-2,height/2-2).position(height/4+height/2*place,3*height/4).color(svg.WHITE);
                    listeVignette.add(fondVignetteBas);
                    tabVignettesR[i+1].pictogramme   .position(height/4+height/2*place,3*height/4)
                                                     .dimension(height/2-30,height/2-30).mark("Produit"+(i+1));
                    tabVignettesR[i+1].title         .position(height/4+height/2*place,height/2*1.1)  .font("Calibri",15,1).color(svg.BLACK);
                    tabVignettesR[i+1].printPrice    .position(height/4+height/2*place,height/2*1.95) .font("Calibri",15,1).color(svg.BLACK);
                    tabVignettesR[i+1].component.mark("Produit "+(i+1));
                    listeVignette.add(tabVignettesR[i+1].component);
                    
                    let currentS = tabVignettesR[i+1];
                    currentS.component.onMouseEnter(function()
                    {
                        currentS.pictogramme.dimension(height/2-2,height/2-2);
                    });

                    currentS.component.onMouseOut(function()
                    {
                        currentS.pictogramme.dimension(height/2-30,height/2-30);
                    });
                  
                    currentS.component.onClick(function(){
                        panier.ajouterProduits( currentS);
                    });
                }
                
                place++;
            }
            this.component.add(listeVignette);

            let chevronW = new svg.Chevron(20,70,3,"W").position(30,this.component.height/2).color(svg.WHITE);
            let chevronE = new svg.Chevron(20,70,3,"E").position(width-30,this.component.height/2).color(svg.WHITE);
            let elipseChevronW = new svg.Ellipse(30,50).color(svg.BLACK).opacity(0.40).position(30,this.component.height/2);
            let elipseChevronE = new svg.Ellipse(30,50).color(svg.BLACK).opacity(0.40).position(this.component.width-30,this.component.height/2);
            let zoneChevronW = new svg.Translation().add(elipseChevronW).add(chevronW).opacity(0.2).mark("chevronWRayon");
            let zoneChevronE = new svg.Translation().add(elipseChevronE).add(chevronE).mark("chevronERayon");
            
            zoneChevronW.onClick(function(){
                if(listeVignette.x+height<=0)
                {
                    if(listeVignette.x+height==0)
                    {
                        zoneChevronW.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x+height,listeVignette.y);
                    zoneChevronE.opacity(1); 
                }
                else
                {
                    listeVignette.smoothy(10,20).moveTo(0,listeVignette.y);
                    zoneChevronW.opacity(0.2);
                    zoneChevronE.opacity(1);
                }
            });
            
            zoneChevronE.onClick(function()
            {
                let widthTotal = height/2*Math.ceil(tabVignettesR.length/2);
                let widthView = width;
                let positionRight = listeVignette.x+widthTotal;
                if(positionRight-height>=widthView)
                {
                    if(positionRight-height==widthView)
                    {
                        zoneChevronE.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x-height,listeVignette.y);
                    zoneChevronW.opacity(1);
                }

                else{
                    listeVignette.smoothy(10,20).moveTo(widthView-widthTotal,listeVignette.y);
                    zoneChevronE.opacity(0.2);
                    zoneChevronW.opacity(1);
                }   
            });

            this.component.add(zoneChevronE).add(zoneChevronW);
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
                    zone.smoothy(10, 20).moveTo(zone.x, contour.y + (contour.height * 0.85) / 2 - heightZone);
                    chevB.opacity(0);
                }
            });
            this.component.add(this.zoneChevronH).add(this.zoneChevronB);
        }

        calculerPrix(prix) {
            this.prixTotal = this.prixTotal + prix;
            this.component.remove(this.printPrice);
            this.printPrice = new svg.Text(this.prixTotal.toFixed(2) + " €").position(this.component.width * 0.75, this.zoneTotal.y + 10)
                .font("calibri", 30, 1).color(svg.BLACK);
            this.component.remove(this.total);
            this.total = new svg.Text("TOTAL").position(this.component.width / 4, this.zoneTotal.y + 10)
                .font("calibri", 30, 1).color(svg.BLACK);
            this.component.add(this.total);
            this.component.add(this.printPrice);
        }

        ajouterProduits(vignette) {
            let newProd = new VignettePanier(vignette.pictogramme.src, vignette.name, vignette.price, vignette.categorie);
            newProd.pictogramme.mark(vignette.name);
            this.listeProduits.add(newProd.component);
            this.VignettesProduits.push(newProd);
            let width = this.component.width;
            newProd.pictogramme.dimension(width * 0.98, width * 0.98);

            newProd.pictogramme.onClick(function () {
                let tab = null;
                console.log(newProd.categorie);
                switch (newProd.categorie) {
                    case "Fruits" :
                        tab = vignettesFruits;
                        break;
                    case "Légumes":
                        tab = vignettesLegumes;
                        break;
                }

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

            if (this.VignettesProduits.length < 2) {
                newProd.pictogramme.position(width / 2, width / 2);
                newProd.title.position(width / 2, newProd.pictogramme.height * 0.15);
                newProd.printPrice.position(width / 2, newProd.pictogramme.height * 0.9);
                let blackline = new svg.Line(0, newProd.pictogramme.height, width, newProd.pictogramme.height)
                    .color(svg.BLACK, 2, svg.BLACK);
                this.listeProduits.add(blackline);
            }
            else {
                if(this.VignettesProduits.length > 2) this.zoneChevronB.opacity(0.5);
                let ref = this.VignettesProduits[this.VignettesProduits.length - 2];
                newProd.pictogramme.position(width / 2, ref.pictogramme.y + ref.pictogramme.height);
                newProd.title.position(width / 2, ref.title.y + ref.pictogramme.height);
                newProd.printPrice.position(width / 2, ref.printPrice.y + ref.pictogramme.height);
                this.listeProduits.add(new svg.Line(0, newProd.pictogramme.y + newProd.pictogramme.height / 2,
                    width, newProd.pictogramme.y + newProd.pictogramme.height / 2).color(svg.BLACK, 2, svg.BLACK));
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
        }
	}

	class VignetteCategorie extends Vignette {
        constructor(image,image2,title){
            super(image,title);
            this.pictogramme2 = new svg.Image(image2);
            this.component.add(this.pictogramme2);
            this.component.add(this.pictogramme);
            this.component.add(this.title);
		}
	}

	class VignetteRayon extends Vignette {
        constructor(image,title,price,cat)
        {
            super(image,title);
            this.component.add(this.pictogramme);
            this.component.add(this.title);
            this.price = price;
            this.printPrice = new svg.Text(price + " €/kilo");
            this.component.add(this.printPrice);
            this.categorie=cat;
        }
	}
    
    class VignettePanier extends VignetteRayon{
        constructor(image,title,price,cat){
            super(image,title,price,cat);
            this.quantity = 0;
        }
        
        /*addQuantity(num){
            this.quantity = this.quantity+num;
        }
        
        minusQuantity(num){
            this.quantity = this.quantity-num;
        }*/
    }
    //////////////////////////////////////
    
    //TEST CREATION TABLEAU VIGNETTE//
    let vignettes = [
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Produits laitiers"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Légumes"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Fruits"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Electromenager"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Voyages"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "HighTech"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Boissons"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Soins du corps"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Mode"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Mobilier"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Soins du corps"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Mode"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Mobilier")

               
    ];

    var vignettesFruits = [
        new VignetteRayon("img/produits/Fruits/Bananes.jpg","Bananes",1.1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Citron vert.jpg","Citron vert",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Clementines.jpg","Clementines",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Fraises.jpg","Fraises",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Framboises.jpg","Framboises",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Kiwi.jpg","Kiwi",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Mangue.jpg","Mangue",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Orange.jpg","Oranges",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Poires.jpg","Poires",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Pommes.jpg","Pommes",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Bananes.jpg","Bananes",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Citron vert.jpg","Citron vert",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Clementines.jpg","Clementines",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Fraises.jpg","Fraises",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Framboises.jpg","Framboises",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Kiwi.jpg","Kiwi",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Mangue.jpg","Mangue",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Orange.jpg","Oranges",1,"Fruits"),
        new VignetteRayon("img/produits/Fruits/Poires.jpg","Poires",1,"Fruits"),
    ];
   
    var vignettesLegumes = [
        new VignetteRayon("img/produits/Legumes/carotte.jpg","Carottes",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Chou.jpg","Chou",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Concombre.jpg","Concombres",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Courgette.jpg","Courgette",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Haricot vert.jpg","Haricots verts",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/oignon.jpg","Oignons",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Pomme de terre.jpg","Pommes de terre",1,"Légumes"),
        new VignetteRayon("img/produits/Legumes/Tomates.jpg","Tomates",1,"Légumes")
    ];   
    
    
    /////
    
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

	
};