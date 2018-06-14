$(document).ready(function () {
   
     
    //Selectors
    var profileCollapseButton = $('.navbar-toggler');
    var profileCollapseContent = $('#navbarNavAltMarkup'); 
    var profilePicInput = $('#profile-pic-input');
    var clearProfilePicBtn = $('#clear-file-input');
    var submitProfilePic = $('#submit-profile-pic-btn');

 
    var logOutBtn = $('#log-out-btn');
    var profileTopBtn = $('#profile-top-btn');
    var calendarTopBtn = $('#calendar-top-btn');
    var userHeader = $('#user-header');
    var changeStartDate = $('#change-start-date');
    var changeEndDate = $('#change-end-date');
    var changeCountryInput = $('#change-coutry-input');
    var changeCityInput = $('#change-city-input');
    var changeInfoBtn = $('#change-info-btn');
    var destinationLabel = $('#destination-label');

    //Function for changing the URL
    var redirect = function (url) {
        window.location.href = url;
    } 

    //Hide the submit profile picture button on page load
    submitProfilePic.hide(); 

    //Global variable updated with the file for the profile picture whenever the input form is updated
    var selectedFile; 

    //Navbar collapse function
    profileCollapseButton.click(function () {
        event.preventDefault();
        var isAnimated = profileCollapseContent.hasClass('animated fadeInDown');
        !isAnimated ? profileCollapseContent.addClass('animated fadeInDown') : profileCollapseContent.removeClass('animated fadeInDown');
    });

    //Change the Date Modal      
    //Date picker
    var from_$input = changeStartDate.pickadate(),
        from_picker = from_$input.pickadate('picker')

    var to_$input = changeEndDate.pickadate(),
        to_picker = to_$input.pickadate('picker');

    //Change the color of the button based on which page you have  
    profileTopBtn.click(function () { 
        event.preventDefault();
        profileTopBtn.addClass('tan-background').removeClass('navy-background');
        calendarTopBtn.addClass('navy-background').removeClass('tan-background');
        redirect('https://trippal-75742.firebaseapp.com/profile.html'); 
    });
    calendarTopBtn.click(function () {
        event.preventDefault();
        calendarTopBtn.addClass('tan-background').removeClass('navy-background');
        profileTopBtn.addClass('navy-background').removeClass('tan-background');
        redirect('https://trippal-75742.firebaseapp.com/calendar.html'); 
    });




}); 