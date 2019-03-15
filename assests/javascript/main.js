var name = "";
var state = "";
var city = "";
var zip = "";
var type = "";
var tags = "";

var breweryName;
var breweryLong;
var breweryLat;

var userLatLng;



geocodeQuery();
breweryQuery();
getaddress();



function breweryQuery() {
    var queryURL = "https://api.openbrewerydb.org/breweries?by_name=" + name + "&by_state=" + state + "&by_city=" + city + "&by_type=" + type + "&by_tag=" + tags;
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
        breweryName = response[1].name;
        //console.log(breweryName)
        breweryLong = response[1].longitude;
        //console.log(breweryLong);
        breweryLat = response[1].latitude;
        //console.log(breweryLat);

    })
}


function geocodeQuery() {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=32826&key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow";

    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //returns city
        console.log(response.results[0].postcode_localities[1]);
        //returns state
        console.log(response.results[0].address_components[3].long_name);


    })
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);


    calculateAndDisplayRoute(directionsService, directionsDisplay);


}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: userLatLng,
        destination: ("28.538803, -81.377317"),
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}




function getaddress() {
    var location = {
            latitude: '',
            longitude: ''
        };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log( "Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
        userLatLng = location.latitude+", "+location.longitude;
        console.log(userLatLng)
        $("body").append('<div id="map"></div>');
        $("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKq8REnjHZj_hZnwsvWxa6F_YJ9RL8O7w&callback=initMap"></script>');
    }
}


