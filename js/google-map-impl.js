
exports.googleMap=class {
    initMap(){
        this.map = new google.maps.Map(document.getElementById('divMap'), {
            zoom: 14,
            center: {lat: 48.856, lng: 2.29},
            gestureHandling: 'greedy',
        });

        this.imagetmp = {
            url: "img/map-marker-red.png",
            scaledSize: new google.maps.Size(1, 1),
        };
    }

    createMarker(content){
        content.map=this.map;
        return new google.maps.Marker(content);
    }

    createInfoWindow(content){
        return new google.maps.InfoWindow(content);
    }

    geocoder(){
        return new google.maps.Geocoder();
    }

    setCenter(center){
        this.map.setCenter(center);
    }

    setZoom(zoom){
        this.map.setZoom(zoom);
    }

    getMarkers(mark,ref,data,cb){
        return mark;
    }

    getControls(){
        return this.map.controls;
    }

    createAutocomplete(input){
        let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);
        return autocomplete;
    }

    getTopLeftControl(){
        return google.maps.ControlPosition.TOP_LEFT;
    }

    createMapSize(l,h){
        return new google.maps.Size(l, h);
    }

    getBounceAnimation(){
        return google.maps.Animation.BOUNCE;
    }

    getInputDiv(){
        return document.getElementById('pac-input');
    }

    getItemDiv(){
        return document.getElementsByClassName('pac-item');
    }

    getItemQueryDiv(item){
        return item.getElementsByClassName('pac-item-query')[0].outerText + " " + item.children[2].textContent;
    }

    createMapPoint(x,y){
        return new google.maps.Point(x,y);
    }

    handleError(){
        handleLocationError(false, infoWindowMyPos, map.getCenter());
    }
};
