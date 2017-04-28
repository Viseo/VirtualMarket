var myAddress={
    coord:{lat:0,lng:0},
    address:""
};

function initMap(data,cb) {
    // runtime.attr(this.divMap,"style","height: "+mapHeight+"px; width: "+mapWidth+"px; z-index: -2; position :absolute; left:0px; top: 0px;");
    var map = new google.maps.Map(document.getElementById('divMap'), {
        zoom: 14,
        center: {lat: 48.856, lng: 2.29},
        gestureHandling:'greedy',
        mapTypeControl: true,

    });
    var myPos = new google.maps.Marker({
        position: {lat:0,lng:0},
        map: map,
        label:" "
    });


    var marker=[];
    var infowindow = new google.maps.InfoWindow({
        content: ""
    });
    var infoWindowMyPos = new google.maps.InfoWindow({map: map});

    document.getElementById("divMap");
    var geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            refreshMarker(map,marker,infowindow,infoWindowMyPos,data,pos,cb);

            map.setCenter(pos);
            map.setZoom(14);

            geocodeLatLng(geocoder, map, infoWindowMyPos,pos,myPos);
        })

    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindowMyPos, map.getCenter());

    }

    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));
    // research("2 rue darcel, boulogne");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var image = {
        url: "img/map-marker-blue.png",
        scaledSize: new google.maps.Size(70, 70),
    };
    myPos.setIcon(image);

    autocomplete.addListener('place_changed', function() {
        myPos.setVisible(false);
        var place = autocomplete.getPlace();

        myPos.setPosition(place.geometry.location);
        myPos.setVisible(true);

        var address = input.value;
        myAddress.address=address;
        myAddress.coord={lat:place.geometry.location.lat(),lng:place.geometry.location.lng()};

        infoWindowMyPos.setContent("<div><strong>"+address+"</strong>");
        infoWindowMyPos.open(map,myPos);
        map.setCenter(myAddress.coord);
        map.setZoom(14);
        refreshMarker(map,marker,infowindow,infoWindowMyPos,data,myAddress.coord,cb);
    });

    function geocodeAddress(geocoder, resultsMap,adresse) {
        geocoder.geocode({'address': adresse}, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                resultsMap.setZoom(16);
                myPos.setPosition(results[0].geometry.location);
                infoWindowMyPos.setContent("<div><strong>"+adresse+"</strong>");
                var pos={lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()};
                refreshMarker(resultsMap,marker,infowindow,infoWindowMyPos,data,pos)
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    var research = function(research) {
        input.value = research;
        setTimeout(function () {
            let results = document.getElementsByClassName('pac-item');
            let address=null;
            if(typeof results[0]!="undefined") {
                address = results[0].getElementsByClassName('pac-item-query')[0].outerText + " " + results[0].children[2].textContent;
            }
            else{
                address = research;
            }
            geocodeAddress(geocoder, map, address);
            input.value = address;
        }, 800);
    };

    var chooseRelai = function(num){
        markers=refreshMarker(map,marker,infowindow,infoWindowMyPos,data,myAddress.coord,cb)
        for(let mark in markers){
            if(mark==num){
                return markers[mark].title;
            }
        }
    }

    return {research:research,
        chooseRelai:chooseRelai
    };
}

function geocodeLatLng(geocoder, map, infowindow, latlng, myPos) {
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                myPos.setPosition(latlng)

                myPos.addListener('click', function() {
                    infowindow.open(map, myPos);
                    infowindow.setContent("<div><strong>"+results[0].formatted_address+"</strong>");

                });

                infowindow.setContent("<div><strong>"+results[0].formatted_address+"</strong>");
                infowindow.open(map, myPos);

                myAddress.coord=latlng;
                myAddress.address=results[0].formatted_address;

                return results[0].formatted_address;
            }
        }
    });
}

function distanceGPS(coordD, coordA){
    let R = 6371 * 1000;
    let latD = coordD.lat;
    let longD = coordD.lng;
    let latA = coordA.lat;
    let longA = coordA.lng;
    let dLat =(Math.PI/180)*(latA-latD);
    let dLon =(Math.PI/180)*(longA-longD);
    latD = (Math.PI/180)*(latD);
    latA = (Math.PI/180)*(latA);
    let A = Math.sin(dLat/2)* Math.sin(dLat/2)+ Math.cos(latD) * Math.cos(latA) *  Math.sin(dLon/2)* Math.sin(dLon/2);
    let c = 2 * Math.atan(Math.sqrt(A),Math.sqrt(1-A));
    let d = R * c / 1000;
    return d; //in km
}

function nearAddress(ref,data){
    let d =0;
    let nearest = {};
    let key;
    for(let address in data) {
        data[address].dist = distanceGPS(ref, data[address].coord);
        if (d == 0 || data[address].dist <= d) {
            d = data[address].dist;
            nearest = data[address];
            key=address;
        }
    }
    return {key:key,ob:nearest};
}

function refreshMarker(map,markers,infowindow,infowindowmypos,data,pos,cb){
    for(let delmark in markers){
        markers[delmark].setMap(null)
    }
    var image = {
        url: "img/map-marker-red.png",
        scaledSize: new google.maps.Size(70, 70),
        labelOrigin: new google.maps.Point(35,22)
    };
    let j=0;
    var point=[];
    var ad=[];
    var tab=aroundAddress(pos,data);
    if(tab.length==0){
        infowindowmypos.setContent("Il n'y a pas de point relai à proximité");
        console.log("Il n'y a pas de point relai à proximité");
    }
    else{
        for(let p of tab){
            point[j]=p.coord;
            ad[j]=p.address;
            j++;
        }

        for(let i=0;i<point.length;i++){
            markers[i] = new google.maps.Marker({
                icon: image,
                position: point[i],
                map: map,
                title: ad[i],
                label: {
                    text: ''+i,
                    fontSize:'20px',
                    fontWeight:'bold',
                }
            });
            markers[i].addListener('click',function(){
                if(markers[i].icon.url=="img/map-marker-green.png"){
                    cb(markers[i].title);
                }
                else{
                    for(let mark in markers){
                        if (markers[mark]!=markers[i]){
                            markers[mark].setIcon(red);
                            if (markers[mark].getAnimation() !== -1){
                                markers[mark].setAnimation(-1);
                            }
                        }
                        else{
                            markers[mark].setIcon(green);
                            if (markers[mark].getAnimation() == -1){
                                markers[mark].setAnimation(google.maps.Animation.BOUNCE);
                            }
                        }
                    }
                    let distance=distanceGPS({lat:markers[i].position.lat(),lng:markers[i].position.lng()},myAddress.coord);
                    infowindow.setContent("<div><strong>"+markers[i].title+"</strong></br>"+"Ce point relai est à : "+distance.toFixed(2)+" km");
                    infowindow.open(map, markers[i]);
                }

            });
        }

        nearest=nearAddress(pos,data);
        var green = {
            url: "img/map-marker-green.png",
            scaledSize: new google.maps.Size(70, 70),
            labelOrigin: new google.maps.Point(35,22)

        };
        var red = {
            url: "img/map-marker-red.png",
            scaledSize: new google.maps.Size(70, 70),
            labelOrigin: new google.maps.Point(35,22)

        };
        for(let mark in markers){
            if(markers[mark].title==nearest.ob.address){
                markers[mark].setIcon(green);
                markers[mark].setAnimation(google.maps.Animation.BOUNCE);
                infowindow.setContent(("<div><strong>"+markers[mark].title+"</strong></br>"+"Ce point relai est à : "+nearest.ob.dist.toFixed(2)));
                infowindow.open(map, markers[mark])
            }
            else {
                markers[mark].setIcon(red);
                if (markers[mark].getAnimation() !== -1) {
                    markers[mark].setAnimation(-1);
                }
            }
        }
    }
    return markers;
}

function aroundAddress(ref,data){
    let around =[];
    let nothing=true;
    for (let point in data){
        data[point].dist = distanceGPS(ref,data[point].coord);
        if (data[point].dist <= 5){
            around.push(data[point]);
            nothing=false;
        }
    }
    if(nothing==true)return [];
    else if(around.length == 0){
        around=(nearAddress(ref));
    }
    return around;
}


exports.initMap=initMap;
