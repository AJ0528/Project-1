var name = "";
var state = "";
var city = "";
var zip = "";
var type = "";
var tags = "";


var breweryLong;
var breweryLat;

var userIP;
    geocodeQuery();
    breweryQuery();
    userLocation();
    
    
    
function breweryQuery() {   
    var queryURL = "https://api.openbrewerydb.org/breweries?by_name="+name+"&by_state="+state+"&by_city="+city+"&by_type="+type+"&by_tag="+tags;
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        //console.log(response);
        var breweryName = response[1].name;
        //console.log(breweryName)
        var breweryLong = response[1].longitude;
        //console.log(breweryLong);
        var breweryLat = response[1].latitude;
        //console.log(breweryLat);

    })
}


function geocodeQuery() {   
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=32826&key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow";
    
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){

        //returns city
        console.log(response.results[0].postcode_localities[1]);
        //returns state
        console.log(response.results[0].address_components[3].long_name);
        

    })
}

function userLocation() {

    var queryURL = "https://api.ipdata.co?api-key=test";
    
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        console.log(response.latitude);
        console.log(response.longitude);

    })
}





