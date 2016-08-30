// ---------------------------------------------------------------------------------------------//
// Comuunity Map JS Code
// Brendan Quigley
// ---------------------------------------------------------------------------------------------//
var map;
// Creates Map
function initMap() {
    //Set Defaults
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.300, lng: -78.320},
        zoom: 12
    });

    // ---------------------------------------------------------------------------------------------//
    // Create data objects for each layer
    // ---------------------------------------------------------------------------------------------//
    ptboBound = new google.maps.Data();
    ptboAreas = new google.maps.Data();
    ptboCatholicElementary = new google.maps.Data();
    ptboCatholicSecondary = new google.maps.Data();
    //ptboPublicElementary = new google.maps.Data();
    //ptboPublicSecondary = new google.maps.Data();

    var allLayers = ["ptboBound", "ptboAreas", "ptboCatholicElementary","ptboCatholicSecondary","ptboPublicElementary","ptboPublicSecondary" ]
    
    // ---------------------------------------------------------------------------------------------//
    // Load Layers
    // ---------------------------------------------------------------------------------------------//
   
    ptboBound.loadGeoJson('https://googledrive.com/host/0BxlTeKPFeJ-KbWRRM2VkdTROaU0/PTBO_Boundary.geojson');
    ptboAreas.loadGeoJson('https://googledrive.com/host/0BxlTeKPFeJ-KbWRRM2VkdTROaU0/CommunityAreas.geojson');
    ptboCatholicElementary.loadGeoJson('https://raw.githubusercontent.com/le0nard0/ptbo-comunitymap/master/Data/CElementary.geojson');
    ptboCatholicSecondary.loadGeoJson('https://googledrive.com/host/0BxlTeKPFeJ-KbWRRM2VkdTROaU0/CSecondary.geojson')
    //ptboPublicElementary.loadGeoJson('')
    //ptboPublicSecondary.loadGeoJson('')

    // ---------------------------------------------------------------------------------------------//
    // Set Boundary as Default Layer
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
    
    //Sets ptboBounds Mouseover
    ptboBound.addListener('mouseover', function (event) {
    ptboBound.revertStyle();
    ptboBound.overrideStyle(event.feature, {
            strokeWeight: 3
        });
    });

    ptboBound.addListener('mouseout', function (event) {
    ptboBound.revertStyle();
    });
    
    //Sets ptboBounds layer as active
    ptboBound.setMap(map);


    // ---------------------------------------------------------------------------------------------// 
    // Info Window    
    // ---------------------------------------------------------------------------------------------//      

    // Click anywhere on the map to remove the info window
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    // One info window variable only allows for one window to be open at one time
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 325
    });

    // ptboAreas Info Window   
    ptboAreas.addListener('click', function (event) {
    infowindow.setContent('<strong>' + event.feature.getProperty('Name') + '</strong><br><br>' + event.feature.getProperty('Des1') + ' ' + event.feature.getProperty('Des2'));

        infowindow.setPosition(event.latLng);
        infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, -34)
        });
        
        infowindow.open(map);
    });
    
    // ptboCatholicElementary Info Window    
    ptboCatholicElementary.addListener('click', function (event) {
        infowindow.setContent('<strong>' + event.feature.getProperty('Name') + '</strong><br><br>' + event.feature.getProperty('City'));

        infowindow.setPosition(event.latLng);
        infowindow.setOptions({
        pixelOffset: new google.maps.Size(0, -34)
        });
        
        infowindow.open(map);
    });

        // ptboCatholicSecondary Info Window    
    ptboCatholicSecondary.addListener('click', function (event) {
        infowindow.setContent('<strong>' + event.feature.getProperty('Secondary'));

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
        var listener = google.maps.event.addListener(map, "idle", function() { 
          if (map.getZoom() > 16) map.setZoom(16); 
          google.maps.event.removeListener(listener); 
});
    });
    // [END region_getplaces]      

}// [END initialize function]


// Changes Active Layer on Map
function addLayer(layer){
    ptboAreas.setMap(null);
    ptboBound.setMap(null);
    ptboCatholicElementary.setMap(null);
    ptboCatholicSecondary.setMap(null);
    setLayerStyle(layer);//Styles new active layer before displaying
    setMouseover(layer);//Sets Mouseover before displaying
    layer.setMap(map);
    
}

// Styles layers based on attributes in the geojson file
function setLayerStyle(layer){
    layer.setStyle(function (feature) {
        return /** @type {google.maps.Data.StyleOptions} */ ({
            fillColor: feature.getProperty('Color'),
            fillOpacity: feature.getProperty('Opacity'),
            strokeColor: feature.getProperty('St_Color'),
            strokeWeight: feature.getProperty('St_Weight'),
            strokeOpacity: feature.getProperty('St_Opacity')
        });
    });
    }

//Sets mouseover for layers
function setMouseover(layer){   
    layer.addListener('mouseover', function (event) {
    layer.revertStyle();
    layer.overrideStyle(event.feature, {
            strokeWeight: 3
        });
    });

    layer.addListener('mouseout', function (event) {
    layer.revertStyle();
    });    
}

