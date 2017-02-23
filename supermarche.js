exports.main = function(svg, param) {

	var market = new svg.Drawing(screen.width,screen.height).show("content"); //Ecran Total

    ///////////////BANDEAUX/////////////////
	class Bandeau {
		constructor(width,height,x,y)
		{
			this.component = new svg.Drawing(width,height).position(x,y);    
		}
	}
//test
	class ListeCategorie extends Bandeau {
		constructor(width,height,x,y,tabVignettes)
		{
			super(width,height,x,y);
            
            //Rebords
            var rectangleFond = new svg.Rect(width,height).position(width/2,height/2).color(svg.BLACK);
            this.component.add(rectangleFond);

            //Catégorie actuellement selectionnée
            let selected = null;
           
            var listeVignette = new svg.Translation();
            for(var i=0;i<tabVignettes.length;i++){
               
                tabVignettes[i].pictogramme.position(height/2+height*i,height/2).dimension(height-4,height-4);
                tabVignettes[i].pictogramme2.position(height/2+height*i,height/2).dimension(height-4,height-4);
                tabVignettes[i].title.position(height/2+i*height,height*0.93).font("Calibri",15,1).color(svg.WHITE);
                
                listeVignette.add(tabVignettes[i].component);
               
                //GESTION SELECTION//
                let current = tabVignettes[i];
                var rayon = null;
                var rayonTranslation = null;
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
                        if(rayonTranslation!=null)
                        {
                            market.remove(rayonTranslation);
                        }
                        rayon = new ListeRayons(market.width*0.8,market.height*0.75,0,market.height/4,tab);
                        rayonTranslation = new svg.Translation().add(rayon.component);
                        market.add(rayonTranslation);
                    }
                    
                    for(let v=0;v<tabVignettes.length;v++)
                    {
                        tabVignettes[v].pictogramme.opacity(1);
                        tabVignettes[v].pictogramme2.opacity(0);
                    }
                    selected = current.name;
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
                    if(current.name!=selected) 
                        {
                            current.pictogramme.opacity(1); 
                            current.pictogramme2.opacity(0);
                        }
                        
                });
                /////////////////////
            }
            this.component.add(listeVignette); 

            var chevronW = new svg.Chevron(20,50,3,"W").position(30,this.component.height/2).color(svg.WHITE);
            var chevronE = new svg.Chevron(20,50,3,"E").position(width-30,this.component.height/2).color(svg.WHITE);
            var elipseChevronW = new svg.Ellipse(20,40).color(svg.BLACK).opacity(0.40).position(30,this.component.height/2);
            var elipseChevronE = new svg.Ellipse(20,40).color(svg.BLACK).opacity(0.40).position(this.component.width-30,this.component.height/2);
            var zoneChevronW = new svg.Translation().add(elipseChevronW).add(chevronW).opacity(0.2);
            var zoneChevronE = new svg.Translation().add(elipseChevronE).add(chevronE);
            
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
               
                else if(listeVignette.x<=0)
                {
                    listeVignette.smoothy(10,20).moveTo(0,listeVignette.y);
                    zoneChevronW.opacity(0.2);
                    zoneChevronE.opacity(1);
                }
                
            });
            
            zoneChevronE.onClick(function(){
                var widthTotal = height*tabVignettes.length;
                var widthView = width;
                var positionRight = listeVignette.x+widthTotal;
                if(positionRight-3*height>=widthView)
                {
                    if(positionRight-3*height==widthView) 
                    {
                        zoneChevronE.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x-height*3,listeVignette.y);
                    zoneChevronW.opacity(1);
                }
               
                else if(positionRight-widthView>=0)
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
        
		constructor(width,height,x,y,tabVignettesR)
		{
			super(width,height,x,y);
            
            var fond = new svg.Rect(width, height).position(width/2,height/2);
            fond.color(svg.LIGHT_GREY,5);
            this.component.add(fond);
            
            var listeVignette = new svg.Translation();
            var place = 0;
            for(var i=0;i<tabVignettesR.length;i=i+2){
                
                tabVignettesR[i].pictogramme .position(height/4+height/2*place+1,height/4+1)    .dimension(height/2-2,height/2-2);
                tabVignettesR[i].title       .position(height/4+height/2*place,height/2*0.1)    .font("Calibri",15,1).color(svg.BLACK);
                tabVignettesR[i].printPrice  .position(height/4+height/2*place,height/2*0.95)   .font("Calibri",15,1).color(svg.BLACK);
                listeVignette.add(tabVignettesR[i].component);
                
                let currentN = tabVignettesR[i];
                currentN.component.onMouseEnter(function()
                {
                    currentN.pictogramme.dimension(height/2+30,height/2+30);
                });
               
                currentN.component.onMouseOut(function()
                {
                    currentN.pictogramme.dimension(height/2-2,height/2-2);
                });
                
                
                currentN.component.onClick(function(){
                    
                });
                
                if(i+1<tabVignettesR.length)
                {
                    tabVignettesR[i+1].pictogramme   .position(height/4+height/2*place+1,3*height/4+1).dimension(height/2-2,height/2-2);
                    tabVignettesR[i+1].title         .position(height/4+height/2*place,height/2*1.1)  .font("Calibri",15,1).color(svg.BLACK);
                    tabVignettesR[i+1].printPrice    .position(height/4+height/2*place,height/2*1.95) .font("Calibri",15,1).color(svg.BLACK);
                    listeVignette.add(tabVignettesR[i+1].component);
                    
                    let currentS = tabVignettesR[i+1];
                    currentS.component.onMouseEnter(function()
                    {
                        currentS.pictogramme.dimension(height/2+30,height/2+30);
                    });

                    currentS.component.onMouseOut(function()
                    {
                        currentS.pictogramme.dimension(height/2-2,height/2-2);
                    });
                    
                    currentS.component.onClick(function(){
            
                    
                    });
                }
                
                place++;
            }
            this.component.add(listeVignette);
            
            
            var chevronW = new svg.Chevron(20,70,3,"W").position(30,this.component.height/2).color(svg.WHITE);
            var chevronE = new svg.Chevron(20,70,3,"E").position(width-30,this.component.height/2).color(svg.WHITE);
            var elipseChevronW = new svg.Ellipse(30,50).color(svg.BLACK).opacity(0.40).position(30,this.component.height/2);
            var elipseChevronE = new svg.Ellipse(30,50).color(svg.BLACK).opacity(0.40).position(this.component.width-30,this.component.height/2);
            var zoneChevronW = new svg.Translation().add(elipseChevronW).add(chevronW).opacity(0.2);
            var zoneChevronE = new svg.Translation().add(elipseChevronE).add(chevronE);
            
            zoneChevronW.onClick(function(){
                console.log(listeVignette.x+height*2);
                if(listeVignette.x+3*height/2<=0)
                {
                    if(listeVignette.x+2*height/2==0) 
                    {
                        zoneChevronW.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x+height/2*2,listeVignette.y);
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
                var widthTotal = height/2*Math.ceil(tabVignettesR.length/2);
                var widthView = width;
                var positionRight = listeVignette.x+widthTotal;
                if(positionRight-2*height>=widthView)
                {
                    if(positionRight-2*height==widthView) 
                    {
                        zoneChevronE.opacity(0.2);
                    }
                    listeVignette.smoothy(10,20).moveTo(listeVignette.x-height/2*2,listeVignette.y);
                    zoneChevronW.opacity(1);
                }

                else if(positionRight-widthView>=0){
                    listeVignette.smoothy(10,20).moveTo(widthView-widthTotal,listeVignette.y);
                    zoneChevronE.opacity(0.2);
                    zoneChevronW.opacity(1);
                }   
            });

            this.component.add(zoneChevronE).add(zoneChevronW);
            
    
        }
         
    }
    
    class Panier extends Bandeau {
        constructor(width,height,x,y,tabVignettes)
        {   
            super(width,height,x,y);
            var test = new svg.Rect(width,height).position(width/2,height/2);
            test.color(svg.WHITE,2,svg.BLACK);

            this.component.add(test);

            var total = new svg.Rect(width*1.58,height*0.1).position(width*0.8,height*0.946);
            total.color(svg.WHITE,2,svg.BLACK);
            this.component.add(total); 

            
            
            
            this.listeProduits = new svg.Translation();
            this.component.add(this.listeProduits);
            this.VignettesProduits = [ ];

        }

        ajouterProduits(vignette) {

                this.listeProduits.add(vignette.component);
                this.tabVignettes.push(vignette.component);
                
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
			constructor(image,title){
                
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
        
			constructor(image,title,price)
            {
                super(image,title);
                this.component.add(this.pictogramme);
                this.component.add(this.title);
                this.price = price;
                this.printPrice = new svg.Text(price + " €/kilo");
                this.component.add(this.printPrice);    
		    }
	}
    
    class VignettePanier extends VignetteRayon{
        constructor(image,title,price,id){
            super(image,title,price);
            this.id= id;
            this.quantity = 0;
        }
        
        addQuantity(num){
            this.quantity = this.quantity+num;
        }
        
        minusQuantity(num){
            this.quantity = this.quantity-num;
        }
        
        
    }
    //////////////////////////////////////
    
    //TEST CREATION TABLEAU VIGNETTE//
    var vignettes = [
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Produits laitiers"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Légumes"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Fruits"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Electromenager"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Voyages"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "HighTech"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Boissons"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Soins du corps"),
        new VignetteCategorie("img/fruits.jpg","img/fruits2.jpg", "Mode"),
        new VignetteCategorie("img/legumes.jpg","img/legumes2.jpg", "Mobilier")
               
    ];
    
    var vignettesFruits = [
        new VignetteRayon("img/produits/Fruits/Bananes.jpg","Bananes","1"),
        new VignetteRayon("img/produits/Fruits/Citron vert.jpg","Citron vert","1"),
        new VignetteRayon("img/produits/Fruits/Clementines.jpg","Clementines","1"),
        new VignetteRayon("img/produits/Fruits/Fraises.jpg","Fraises","1"),
        new VignetteRayon("img/produits/Fruits/Framboises.jpg","Framboises","1"),
        new VignetteRayon("img/produits/Fruits/Kiwi.jpg","Kiwi","1"),
        new VignetteRayon("img/produits/Fruits/Mangue.jpg","Mangue","1"),
        new VignetteRayon("img/produits/Fruits/Orange.jpg","Oranges","1"),
        new VignetteRayon("img/produits/Fruits/Poires.jpg","Poires","1"),
        new VignetteRayon("img/produits/Fruits/Pommes.jpg","Pommes","1"),
    ];
   
    var vignettesLegumes = [
        new VignetteRayon("img/produits/Legumes/carotte.jpg","Carottes","1"),
        new VignetteRayon("img/produits/Legumes/Chou.jpg","Chou","1"),
        new VignetteRayon("img/produits/Legumes/Concombre.jpg","Concombres","1"),
        new VignetteRayon("img/produits/Legumes/Courgette.jpg","Courgette","1"),
        new VignetteRayon("img/produits/Legumes/Haricot vert.jpg","Haricots verts","1"),
        new VignetteRayon("img/produits/Legumes/oignon.jpg","Oignons","1"),
        new VignetteRayon("img/produits/Legumes/Pomme de terre.jpg","Pommes de terre","1"),
        new VignetteRayon("img/produits/Legumes/Tomates.jpg","Tomates","1"),
    ];
    
    
    
    
    /////
    
    var header = new Header(market.width,market.height/20,0,0);
    var zoneHeader = new svg.Translation().add(header.component);
    var categories = new ListeCategorie(market.width*0.8,market.height/5,0,market.height/20,vignettes);
    var zoneCategories = new svg.Translation().add(categories.component);
    var panier = new Panier(market.width*0.2,market.height*0.8,market.width*0.8,market.height/20);
    var zonePanier = new svg.Translation().add(panier.component);
    var payement = new Payement(market.width/5,market.height*0.15,market.width*0.8,market.height*0.85);
    var zonePayement = new svg.Translation().add(payement.component);
    market.add(zoneCategories).add(zonePanier).add(zoneHeader).add(zonePayement);
	
};