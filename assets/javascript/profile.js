$(document).ready(function () {
 
    //Selectors
        //Display the current temperature
        currentTempDiv = $('#current-temp-div'); 

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
        var getWeather = function(city, country) {
            var APIKEY = '&appid=74adba7da79a4c943ca3b1bec036d74d'; 
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city},${country}${APIKEY}`; 
            $.ajax({
              url : queryURL, 
              method: 'Get'
            }).then(function(response){
              currentTempDiv.text(response.main.temp.toFixed());
              destinationLat = response.coord.lat; 
              destinationLon = response.coord.lon; 
            }); 
        };
        getWeather('toronto', 'canada'); //used this to test that the API call works. We can populate this with the user's location
 
  
    
}); 