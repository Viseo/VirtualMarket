/**
 * Created by GEH3641 on 20/04/2017.
 */
(function(window) {
    window.initMap=function() {
        var myLatlng = {lat: -25.363, lng: 131.044};
        var infowindow = new google.maps.InfoWindow({
            content: "hola"
        });
        var map = new google.maps.Map(document.getElementById('divMap'), {
            zoom: 4,
            center: myLatlng,
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Click to zoom',
            scale:1.25
            // draggable:true,
            // clickable: true
        });

        // map.addListener('center_changed', function() {
        //     // 3 seconds after the center of the map has changed, pan back to the
        //     // marker.
        //     window.setTimeout(function() {
        //         map.panTo(marker.getPosition());
        //     }, 3000);
        // });
        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(8);
            map.setCenter(marker.getPosition());
            infowindow.setContent(marker.title);
            infowindow.open(map,marker)
        })
        // marker.addListener('click', function() {
        //     map.setZoom(8);
        //     map.setCenter(marker.getPosition());
        //     infowindow.setContent(marker.title);
        //     infowindow.open(map,marker)
        // });
    };


    // window.initMap = function (data) {
    //     map = new google.maps.Map(document.getElementById("divMap"), {
    //         center: {lat: 48.85, lng: 2.29},
    //         zoom: 10,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP,
    //         mapTypeControl: true,
    //         mapTypeControlOptions: {
    //             style: google.maps.MapTypeControlStyle.DEFAULT
    //         },
    //         scaleControl:true,
    //         fullscreenControl: true,
    //         zoomControl:false
    //     });
    //
    //
    //     var geocoder = new google.maps.Geocoder();
    //     var infoWindow = new google.maps.InfoWindow({map: map});
    //     // google.maps.event.trigger(map, 'resize');
    //     // geocodeAddress(geocoder,map);
    //
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function (position) {
    //             var pos = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude
    //                 // lat: 48.856, lng: 2.29
    //             };
    //             // for(let point in data){
    //             //     console.log(data[point])
    //
    //                 // var marker = new google.maps.Marker({
    //                 //     position: pos,
    //                 //     map: map,
    //                 //     title:"coucou"
    //                 // });
    //
    //             var marker = new google.maps.Marker({
    //                 position: pos,
    //                 map: map,
    //                 title: 'Click to zoom'
    //             });
    //                 marker.addListener("click",function () {
    //                     infowindow.setContent(marker.title);
    //                     infowindow.open(map,marker)
    //                 });
    //             // }
    //
    //             var address="";
    //             address=geocodeLatLng(geocoder, map, infoWindow,pos);
    //             // alert(address);
    //             // infoWindow.open(map,marker);
    //             // infoWindow.setContent('You are here !'+address);
    //             map.setCenter(pos);
    //         }, function () {
    //             handleLocationError(true, infoWindow, map.getCenter());
    //         });
    //     } else {
    //         // Browser doesn't support Geolocation
    //         handleLocationError(false, infoWindow, map.getCenter());
    //
    //     }
    //
    // }

    function geocodeLatLng(geocoder, map, infowindow,latlng) {
        // var input = document.getElementById('latlng').value;
        // var latlngStr = input.split(',', 2);
        // var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    // map.setZoom(11);
                    // var marker = new google.maps.Marker({
                    //     position: latlng,
                    //     map: map
                    // });
                    // infowindow.setContent(results[1].formatted_address);
                    // infowindow.open(map, marker);
                    // window.alert(results[1].formatted_address);
                    return results[1].formatted_address;
                }
            }
        });
    }
})(this);