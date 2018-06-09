$(document).ready(function () {

 
    //Selectors
    var profileCollapseButton = $('.navbar-toggler'); 
    var profileCollapseContent = $('#navbarNavAltMarkup');  
    
    var logOutBtn = $('#log-out-btn');  
    var profileTopBtn = $('#profile-top-btn');  
    var calendarTopBtn = $('#calendar-top-btn');  
    var userHeader = $('#user-header');  
    var changeStartDate = $('#change-start-date');   
    var changeEndDate = $('#change-end-date');  
    var newLocationInput = $('#new-location-input');  
    var changeInfoBtn = $('#change-info-btn');  
    var destinationLabel = $('#destination-label');  

    //Navbar collapse function
    profileCollapseButton.click(function() {
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
    profileTopBtn.click(function() {
        profileTopBtn.addClass('tan-background').removeClass('navy-background'); 
        calendarTopBtn.addClass('navy-background').removeClass('tan-background'); 
    }); 
    calendarTopBtn.click(function() {
        calendarTopBtn.addClass('tan-background').removeClass('navy-background'); 
        profileTopBtn.addClass('navy-background').removeClass('tan-background'); 
    }); 
 
});   