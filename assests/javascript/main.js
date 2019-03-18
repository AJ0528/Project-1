var name = "";
var state = "";
var city = "";
var zip = "";
var type = "";
var tags = "";

var breweryName;
var breweryType;
var breweryPhone = [];
var breweryURL;
var breweryRating;
var breweryLong;
var breweryLat;

var userLatLng;



//geocodeQuery();
//breweryQuery();
//getaddress();

$("#runQuery").on("click", function () {
    if( $("#name").val() == ""){
        name = "";
    } else{
        name = $("#name").val();;
    }
    

    if ($("#state").is(":checked")) { state = $("#citystatezip").val() };

    if ($("#city").is(":checked")) { city = $("#citystatezip").val() };

    if ($("#zip").is(":checked")) {
        geocodeQuery()
        zip = $("#citystatezip  ").val()

        
    };

    type = $("option").val();

    switch (type) {
        case 1:
            type = "micro";
            break;
        case 2:
            type = "reigonal"
            break;
        case 3:
            type = "brewpub"
            break;
        default:
            type = "";
            break;
    }
console.log(name);
console.log(state);
console.log(city);
console.log(zip);
console.log(type);


    breweryQuery();


});


$("getDirections").on("click", function () {



});



function breweryQuery() {
    var queryURL = "https://api.openbrewerydb.org/breweries?by_name=" + name + "&by_state=" + state + "&by_city=" + city + "&by_type=" + type + "&by_tag=" + tags;
    //console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.length)
        for(i=0;i<response.length;i++){
        breweryName = response[i].name;
        breweryType = response[i].brewery_type;
        breweryPhone = response[i].phone;
        // breweryPhone = ""+response[i].phone.split("");

        // if(breweryPhone = ""){
        //     console.log("nothing")
        // }else {
        //     console.log("something")
        //     phoneSplice();
        // }

        breweryURL = response[i].website_url;
        breweryLong = response[i].longitude;
        breweryLat = response[i].latitude;
        
        var newQuery = $("<tr>").append(
            $("<td>").text(breweryName),
            $("<td>").text(breweryType),
            $("<td>").text(breweryPhone),
            $("<td>").text(breweryURL),
        );
        if(i==0){
            $("thead").html('<tr><th>Name</th> <th>Type</th> <th>Phone #</th><th>Website</th> <th>Review</th></tr>')
        }
        $("thead").append(newQuery)
        
       
    }
    
    $("#resultstable").slideDown("1000");})
    
}


function geocodeQuery() {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=32826&key=AIzaSyB3GiXbPMJMdIlm2PKx-85TIQJrkhIVqnY";

    //console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //returns city
        city = response.results[0].postcode_localities[1]
        console.log(city)
        //returns state
        state = response.results[0].address_components[3].long_name
        console.log(state)


    })
}

function phoneSplice(){
            breweryPhone.splice(0, 0, "(");
            breweryPhone.splice(4, 0, ")");
            breweryPhone.splice(5, 0, " ");
            breweryPhone.splice(8, 0, " ");
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
        console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
        userLatLng = location.latitude + ", " + location.longitude;
        console.log(userLatLng)
        createMap();
    }
}


function createMap() {
    console.log("created")
    $("body").append('<div id="map"></div>');
    $("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow&callback=initMap"></script>');

}



