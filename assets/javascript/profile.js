$(document).ready(function () {
 
    //Selectors
        //Display the current temperature
        currentTempDiv = $('#current-temp-div'); 
        var destinationLat; 
        var destinationLon;  
 
        //Display the duration of the trip
        startDateProfile = $('#start-date-profile');
        endDateProfile = $('#end-date-profile');
 
        //Table for displaying the homepage activities list
        profilePageActivities = $('#profile-page-activities');
 
        //Google map display on the profile page
        profileMap = $('#profile-map'); 
        
        // variables to display the weather of the city the user is currently in
        var userCity; 
        var userCountry;       

        //function for updating the Weather.
        var getWeather = function(city) {
            var APIKEY = '&appid=74adba7da79a4c943ca3b1bec036d74d'; 
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}${APIKEY}`; 
            $.ajax({
              url : queryURL, 
              method: 'Get'
            }).then(function(response){
              currentTempDiv.text(response.main.temp.toFixed());
              destinationLat = response.coord.lat; 
              destinationLon = response.coord.lon;  
              initAutocomplete(destinationLat, destinationLon);  
            });       
        };
        getWeather('montreal'); //used this to test that the API call works. We can populate this with the user's location
    
});      

function initAutocomplete(latitude, longitude) {
  var map = new google.maps.Map(document.getElementById('profile-map'), {
    center: {lat: latitude, lng: longitude},
    zoom: 13,
    mapTypeId: 'roadmap' 
  }); 

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });  

  var position = {lat: latitude, lng: longitude}; 
  
  var markers = new google.maps.Marker({
    position: position, 
    map: map, 
    title: 'You are here'
  }); 
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return; 
    }  

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    }); 
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {   
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
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
}