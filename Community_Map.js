// ---------------------------------------------------------------------------------------------//
// Comuunity Map JS Code
// Brendan Quigley
// ---------------------------------------------------------------------------------------------//
var map;
// Creates Map
function initMap() {
    //Set Defaults
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 44.300,
            lng: -78.320
        },
        zoom: 12
    });

    // ---------------------------------------------------------------------------------------------//
    // Create data objects for each layer
    // ---------------------------------------------------------------------------------------------//
    var ptboBound = new google.maps.Data();
    var ptboAreas = new google.maps.Data();

    ptboBound.loadGeoJson('https://googledrive.com/host/0BxlTeKPFeJ-KbWRRM2VkdTROaU0/PTBO_Boundary.geojson');
    ptboAreas.loadGeoJson('https://googledrive.com/host/0BxlTeKPFeJ-KbWRRM2VkdTROaU0/CommunityAreas.geojson');

    var ptboBoundcheck = document.getElementById('ptboBound').checked;
    var ptboAreascheck = document.getElementById('ptboAreas').checked;

    // ---------------------------------------------------------------------------------------------//
    // Check to see if checkboxes are checked and enable that layer
    // ---------------------------------------------------------------------------------------------//
    if (ptboBoundcheck === true) {
        ptboBound.setMap(map);
    }

    if (ptboAreascheck === true) {
        ptboAreas.setMap(map);
    }

    // ---------------------------------------------------------------------------------------------//
    // Style Based on Fields in the GeoJson Layers
    // ---------------------------------------------------------------------------------------------//

    // Sets ptboBounds Styles
    ptboBound.setStyle(function (feature) {
        return /** @type {google.maps.Data.StyleOptions} */ ({
            fillColor: feature.getProperty('color'),
            fillOpacity: feature.getProperty('Opacity'),
            clickable: feature.getProperty('click'),
            strokeWeight: 1

        });
    });

    // Sets ptboAreas Styles
    ptboAreas.setStyle(function (feature) {
        return /** @type {google.maps.Data.StyleOptions} */ ({
            fillColor: feature.getProperty('color'),
            fillOpacity: feature.getProperty('Opacity'),
            strokeWeight: 1

        });
    });

    // ---------------------------------------------------------------------------------------------//
    // On mouseover indicated selected area by increaing the stroke weight
    // ---------------------------------------------------------------------------------------------//
    ptboAreas.addListener('mouseover', function (event) {
        ptboAreas.revertStyle();
        ptboAreas.overrideStyle(event.feature, {
            strokeWeight: 3
        });
    });

    ptboAreas.addListener('mouseout', function (event) {
        ptboAreas.revertStyle();
    });

    // ---------------------------------------------------------------------------------------------// 
    // Info Window    
    // ---------------------------------------------------------------------------------------------//      

    // Click anywhere on the map to remove the info window
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    //One info window variable only allows for one window to be open at one time
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 325
    });

    // Show info window for ptboAreas    
    ptboAreas.addListener('click', function (event) {
        infowindow.setContent(
            '<strong>' + event.feature.getProperty('Name') + '</strong><br><br>' + event.feature.getProperty('Des1') + ' ' + event.feature.getProperty('Des2'));

        infowindow.setPosition(event.latLng);
        infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, -34)
        });
        infowindow.open(map);
    });


    // ---------------------------------------------------------------------------------------------// 
    // Google Search Box Code     
    // ---------------------------------------------------------------------------------------------//    
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon
                , size: new google.maps.Size(71, 71)
                , origin: new google.maps.Point(0, 0)
                , anchor: new google.maps.Point(17, 34)
                , scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map
                , icon: icon
                , title: place.name
                , position: place.geometry.location
            }));

            if (place.geometry.viewport) {

                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    // [END region_getplaces]  

    // ---------------------------------------------------------------------------------------------//
    // Check to see if checkboxes are checked and enable that layer
    // ---------------------------------------------------------------------------------------------//
    if (ptboBoundcheck === true) {
        ptboBound.setMap(map);
    };

    if (ptboAreascheck === true) {
        ptboAreas.setMap(map);
    };

}// [END initialize function]