
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

    getControls(){
        return this.map.controls;
    }

    createAutocomplete(input){
        let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);
        return autocomplete;
    }
};
