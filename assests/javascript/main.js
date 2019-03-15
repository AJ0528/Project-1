var name = "";
var state = "";
var city = "";
//var zip = "";
var type = "";
var tags = "";
    
    geocodeQuery();
    breweryQuery();
    directionsQuery();
    
    
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
        //$(".result").text(breweryName + breweryLat + breweryLong)

    })
}


function geocodeQuery() {   
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=32826&key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow";
    
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

    })
}

function directionsQuery() {   
    var queryURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow&callback=initMap";
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

    })
}
