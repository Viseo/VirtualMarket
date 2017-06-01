/**
 * Created by TNA3624 on 01/06/2017.
 */

exports.googleMap=class {
    initMap(){
        this.map = {
            zoom: 14,
            center: {lat: 48.856, lng: 2.29},
            gestureHandling: 'greedy',
            setCenter(x){
                this.center=x;
            },
            setZoom(x){
                this.zoom=x;
            }
        };

        this.imagetmp = {
            url: "img/map-marker-red.png",
            scaledSize:0,
        };
    }

    createMarker(content){
        content.map=this.map;
        content.setAnimation=function(x){content.animation=x};
        content.setPosition=function(x){};
        content.setIcon=function(x){content.icon=x};
        content.setMap=function(g){};
        content.getAnimation=function(){return content.animation};
        return content;
    }

    createInfoWindow(content){
        content.setContent=function(text){content.content=text};
        content.open=function(map,marker){};
        return content;
    }

    geocoder(){
        return {
            geocode(address,func){}
        };
    }

    setCenter(center){
        this.map.setCenter(center);
    }

    setZoom(zoom){
        this.map.setZoom(zoom);
    }

    getControls(){
        return [[]];
    }

    createAutocomplete(input){
        let autocomplete = {
            input:input,
            addListener(place,func){
            },
            getPlace(){return {geometry:{location:{lat(){return 0},lng(){return 1}}}}}
        };
        return autocomplete;
    }

    getTopLeftControl(){
        return 0;
    }

    createMapSize(l,h){
        return {l:l,h:h};
    }

    getBounceAnimation(){
        return 0;
    }

    getInputDiv(){
        return {};
    }

    getItemDiv(doc){
        return {};
    }

    getItemQueryDiv(item){
        return {};
    }

    createMapPoint(x,y){
        return {x:x,y:y};
    }

    handleError(){

    }
};