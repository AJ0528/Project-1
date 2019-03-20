var name = "";
var state = "";
var city = "";
var zip = "";
var type = "";
var tags = "";

var breweryName;
var breweryType;
var breweryPhone;
var breweryPhoneArr = [];
var breweryURL;
var breweryRating;
var breweryLong;
var breweryLat;
var breweryLatLng;

var userLatLng;

var queryResponse = [];

var alphabetArray = [];

var autoCompleteObj;


//alphabetArr();
//geocodeQuery();
//breweryQuery();


$("#runQuery").on("click", function () {
    name = "";
    state = "";
    city = "";
    zip = "";
    type = "";
    tags = "";

    if ($("#name").val() == "") {
        name = "";
    } else {
        name = $("#name").val();;
    }

    if ($("#state").is(":checked")) { state = $("#citystatezip").val() };

    if ($("#city").is(":checked")) { city = $("#citystatezip").val() };

    type = $("#typedropdown option:selected").text()

    switch (type) {
        case "Micro":
            type = "Micro";
            break;
        case "Regional":
            type = "Regional"
            break;
        case "Brewpub":
            type = "Brewpub"
            break;
        default:
            type = "";
            break;
    }


    if ($("#zipcode").is(":checked")) {
        zip = $("#citystatezip").val()
        geocodeQuery()
        return;
    };

    breweryQuery();


});


$("thead").on("click", ".getDirections", function () {
    event.preventDefault();
    breweryLong = queryResponse[this.id].Long
    breweryLat = queryResponse[this.id].Lat
    breweryLatLng =  breweryLat + ", " + breweryLong;
    getaddress();
    
    
    
});



function breweryQuery() {
    var queryURL = "https://api.openbrewerydb.org/breweries?by_name=" + name + "&by_state=" + state + "&by_city=" + city + "&by_type=" + type;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (i = 0; i < response.length; i++) {
            breweryName = response[i].name;
            breweryType = response[i].brewery_type;
            var capTemp = breweryType.charAt(0).toUpperCase();
            breweryType = breweryType.replaceAt(0, capTemp);
            breweryPhone = response[i].phone;


                if(breweryPhone == ""){
                }else {
                    phoneSplice();
                }

            breweryURL = response[i].website_url;
            breweryLong = response[i].longitude;
            breweryLat = response[i].latitude;

            var results = {
                name: breweryName,
                type: breweryType,
                phone: breweryPhoneArr,
                URL: breweryURL,
                Long: breweryLong,
                Lat: breweryLat
            };

            queryResponse.push(results);
            var directionsButton = '<a class="waves-effect waves-light light grey darken-1 btn getDirections" id='+i+'><i class="material-icons left">directions</i>Directions</a>';

            var newQuery = $("<tr>").append(
                $("<td>").html('<a href="'+breweryURL+'" target="_blank">'+breweryName+'</a>'),
                $("<td>").text(breweryType),
                $("<td>").text(breweryPhoneArr.join("")),
                $("<td id='dirBut'>").append(directionsButton)

            );
            if (i == 0) {
                $("thead").html('<tr><th>Name</th> <th>Type</th> <th>Phone #</th></tr>')
            }
            $("thead").append(newQuery)


        }
        $("#resultstable").slideDown("1000");
    })

}


function geocodeQuery() {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=32826&key=AIzaSyB3GiXbPMJMdIlm2PKx-85TIQJrkhIVqnY";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //returns city
        city = response.results[0].postcode_localities[1]
        //returns state
        state = response.results[0].address_components[3].long_name
    breweryQuery();

    })
}

function phoneSplice() {
    breweryPhoneArr = [];
    for(n=0;n<breweryPhone.length;n++){
        switch(n){
            case 0:
            breweryPhoneArr.push("(");
            break;
            case 3:
            breweryPhoneArr.push(")");
            breweryPhoneArr.push(" ");
            break;
            case 6:
            breweryPhoneArr.push(" ");
            break;
            default:
            break;
        }
        breweryPhoneArr.push(breweryPhone.charAt(n));
        
    }

}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);
    document.getElementById("mappage").scrollIntoView({behavior: "smooth"});

    calculateAndDisplayRoute(directionsService, directionsDisplay);


}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: userLatLng,
        destination: breweryLatLng,
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
        
    }

    function showPosition(position) {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
        userLatLng = location.latitude + ", " + location.longitude;
        
        createMap();
    }
}


function createMap() {
    $("#mappage").append('<div id="map"></div>');
    $("#mappage").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKslsrzneWMfjKEnPVY4lhwgqEtK3wgow&callback=initMap"></script>');
    $("#map").css("height", "480px");
}




function initService() {
    var displaySuggestions = function(predictions, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      predictions.forEach(function(prediction) {
        //change from list
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(prediction.description));
        document.getElementById('results').appendChild(li);
      });
    };

    var service = new google.maps.places.AutocompleteService();
    var inputValue =  $("#input").val();
    service.getQueryPredictions({ input: inputValue }, displaySuggestions);
  }




























function sortByName() {
    var sorted = false;
    var j=0;
    while (sorted != true) {
        for (i = 0; i < queryResponse.length; i++) {
            sorted2 = false;
            while (sorted2 != true){
               
        }
        }
    }

    
}

function azLetterSort(){
    if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) == "" || alphabetArray.indexOf(queryResponse[i+1].name.charAt(j)) == ""){
        j++;
        azLetterSort();
    } else if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) == alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        j++;
        azLetterSort();
    } else if (alphabetArray.indexOf(queryResponse[i].name.charAt(j)) > alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        j=0;
    } else if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) < alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        var temp = queryResponse[i+1].name
        queryResponse[i+1].name = queryResponse[i].name
        queryResponse[i].name = temp
        j=0;
    }
}
function zaLetterSort(){
    if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) == "" || alphabetArray.indexOf(queryResponse[i+1].name.charAt(j)) == ""){
        j++;
        zaLetterSort();
    } else if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) == alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        zaLetterSort();
        j++;
    } else if (alphabetArray.indexOf(queryResponse[i].name.charAt(j)) < alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        j=0;
    } else if(alphabetArray.indexOf(queryResponse[i].name.charAt(j)) > alphabetArray.indexOf(queryResponse[i+1].name.charAt(j))){
        var temp = queryResponse[i+1].name
        queryResponse[i+1].name = queryResponse[i].name
        queryResponse[i].name = temp
        j=0;
    }
}

function sortByRating() {

};

function sortByDistance() {

};

function sortByType() {

} ;

function alphabetArr() {
    for(i=0; i<25;i++){
        alphabetArray.push(String.fromCharCode(65+i));
        alphabetArray.push(String.fromCharCode(97+i));
    }
};


function initService() {
   
    var displaySuggestions = function(predictions, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
      }

      predictions.forEach(function(prediction) {
        // autoCompleteObj = {
        // };
        
      });
    };

    var service = new google.maps.places.AutocompleteService();
    
    var inputValue =  $("#name").val() + " brewery";
    service.getQueryPredictions({ input: inputValue }, displaySuggestions);
  }


  var placeSearch, autocomplete;

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
  
  function initAutocomplete() {
      $("#autocompletescript").empty();
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('name'), {types: ['establishment']});
      
  }
  
  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    
    for (var component in componentForm) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }
    
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
      }
    }
    
  }
  
    $("#name").on("keypress", function (){
      $("#autocompletescript").html('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_B3bW160bYE4oTm4CGpSl_62h1t_nJt8&libraries=places&callback=initAutocomplete"async defer></script>')
      
  
     
  });

  String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}